from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from models.category import Category, CategoryCreate, CategoryUpdate, CategoryResponse
import logging
from datetime import datetime
from jose import JWTError, jwt
import os

logger = logging.getLogger(__name__)
security = HTTPBearer()

SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

def create_router(db):
    router = APIRouter()

    async def verify_token_async(token: str):
        """Verify JWT token and return user"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                return None
            
            user = await db.users.find_one({"username": username}, {"_id": 0})
            return user
        except JWTError:
            return None
        except Exception as e:
            logger.error(f"Error verifying token: {str(e)}")
            return None

    async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
        """Verify JWT token and return user"""
        token = credentials.credentials
        user_dict = await verify_token_async(token)
        if not user_dict:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user_dict

    async def verify_admin(user: dict = Depends(get_current_user)):
        """Verify user is admin"""
        if user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        return user

    @router.get("/categories", response_model=List[CategoryResponse])
    async def get_categories():
        """Get all categories"""
        try:
            categories = await db.categories.find({}, {"_id": 0}).to_list(1000)
            return [CategoryResponse(**cat) for cat in categories]
        except Exception as e:
            logger.error(f"Error fetching categories: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    @router.get("/categories/{category_id}", response_model=CategoryResponse)
    async def get_category(category_id: str):
        """Get category by ID"""
        try:
            category = await db.categories.find_one({"id": category_id}, {"_id": 0})
            if not category:
                raise HTTPException(status_code=404, detail="Category not found")
            return CategoryResponse(**category)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching category: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    @router.post("/categories", response_model=CategoryResponse)
    async def create_category(
        category_data: CategoryCreate,
        admin: dict = Depends(verify_admin)
    ):
        """Create new category (Admin only)"""
        try:
            # Create slug from name
            slug = category_data.name.lower().replace(" ", "-").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u")
            
            # Check if slug already exists
            existing = await db.categories.find_one({"slug": slug})
            if existing:
                raise HTTPException(status_code=400, detail="Category with this name already exists")
            
            category = Category(
                name=category_data.name,
                slug=slug,
                description=category_data.description
            )
            
            await db.categories.insert_one(category.model_dump())
            logger.info(f"Category created: {category.id}")
            
            return CategoryResponse(**category.model_dump())
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error creating category: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    @router.put("/categories/{category_id}", response_model=CategoryResponse)
    async def update_category(
        category_id: str,
        category_data: CategoryUpdate,
        admin: dict = Depends(verify_admin)
    ):
        """Update category (Admin only)"""
        try:
            category = await db.categories.find_one({"id": category_id}, {"_id": 0})
            if not category:
                raise HTTPException(status_code=404, detail="Category not found")
            
            update_data = {k: v for k, v in category_data.model_dump().items() if v is not None}
            
            # Update slug if name changed
            if "name" in update_data:
                update_data["slug"] = update_data["name"].lower().replace(" ", "-").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u")
            
            if update_data:
                await db.categories.update_one(
                    {"id": category_id},
                    {"$set": update_data}
                )
            
            updated_category = await db.categories.find_one({"id": category_id}, {"_id": 0})
            return CategoryResponse(**updated_category)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating category: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    @router.delete("/categories/{category_id}")
    async def delete_category(
        category_id: str,
        admin: dict = Depends(verify_admin)
    ):
        """Delete category (Admin only)"""
        try:
            result = await db.categories.delete_one({"id": category_id})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Category not found")
            
            # Remove category from all products
            await db.products.update_many(
                {"category_ids": category_id},
                {"$pull": {"category_ids": category_id}}
            )
            
            return {"message": "Category deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting category: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    return router
