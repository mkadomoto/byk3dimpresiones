from fastapi import APIRouter, HTTPException, status
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from models.user import User, UserCreate, UserLogin, UserResponse
import logging
import os

logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

def create_router(db):
    router = APIRouter()

    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    def create_access_token(data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @router.post("/auth/login")
    async def login(user_credentials: UserLogin):
        """Login user"""
        try:
            user = await db.users.find_one({"username": user_credentials.username}, {"_id": 0})
            
            if not user or not verify_password(user_credentials.password, user["hashed_password"]):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect username or password"
                )
            
            if not user.get("is_active", True):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User account is disabled"
                )
            
            # Create access token
            access_token = create_access_token(
                data={"sub": user["username"], "role": user["role"], "id": user["id"]}
            )
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": UserResponse(**user)
            }
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error during login: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    @router.post("/auth/register", response_model=UserResponse)
    async def register(user_data: UserCreate):
        """Register new user (disabled for now - admin only creation)"""
        raise HTTPException(
            status_code=403,
            detail="Registration is currently disabled. Please contact administrator."
        )

    @router.get("/auth/me")
    async def get_current_user_info(token: str):
        """Get current user info from token"""
        try:
            user = verify_token(token, db)
            if not user:
                raise HTTPException(status_code=401, detail="Invalid token")
            return UserResponse(**user)
        except Exception as e:
            logger.error(f"Error getting user info: {str(e)}")
            raise HTTPException(status_code=401, detail="Invalid token")

    return router

def verify_token(token: str, db):
    """Verify JWT token and return user (synchronous wrapper for async call)"""
    try:
        import asyncio
        from jose import JWTError, jwt
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        
        # Get user from database synchronously
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # If loop is already running, use sync client
            from pymongo import MongoClient
            import os
            sync_client = MongoClient(os.environ['MONGO_URL'])
            sync_db = sync_client[os.environ['DB_NAME']]
            user = sync_db.users.find_one({"username": username}, {"_id": 0})
            sync_client.close()
            return user
        else:
            # If no loop running, use asyncio.run
            user = asyncio.run(db.users.find_one({"username": username}, {"_id": 0}))
            return user
    except JWTError:
        return None
    except Exception as e:
        print(f"Error verifying token: {str(e)}")
        return None
