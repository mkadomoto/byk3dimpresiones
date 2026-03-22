// AdminPage.jsx

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Toaster } from "../components/ui/sonner";

import { Plus, Trash2, LogOut, Package, Tag } from "lucide-react";

import { db } from "../firebase";

import {
 collection,
 addDoc,
 getDocs,
 orderBy,
 query,
 serverTimestamp,
 doc,
 deleteDoc
} from "firebase/firestore";

const AdminPage = ({ logout }) => {

 const [products, setProducts] = useState([]);
 const [categories, setCategories] = useState([]);

 const [showProductDialog, setShowProductDialog] = useState(false);
 const [showCategoryDialog, setShowCategoryDialog] = useState(false);

 const [productForm, setProductForm] = useState({
  name: "",
  description: "",
  price: "",
  image_file: null,
  category_ids: []
 });

 const [categoryForm, setCategoryForm] = useState({
  name: "",
  description: ""
 });

 useEffect(() => {
  fetchProducts();
  fetchCategories();
 }, []);


 const fetchProducts = async () => {

  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  const lista = snapshot.docs.map(doc => ({
   id: doc.id,
   ...doc.data()
  }));

  setProducts(lista);
 };


 const fetchCategories = async () => {

  const q = query(collection(db, "categories"), orderBy("name"));
  const snapshot = await getDocs(q);

  const lista = snapshot.docs.map(doc => ({
   id: doc.id,
   ...doc.data()
  }));

  setCategories(lista);
 };


 const uploadImage = async (file) => {

  const url = "https://api.cloudinary.com/v1_1/duiwinvef/image/upload";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  const response = await fetch(url,{
   method:"POST",
   body:formData
  });

  const data = await response.json();

  return data.secure_url;
 };


 const handleSaveProduct = async (e) => {

  e.preventDefault();

  try {

   let imageUrl = "";

   if(productForm.image_file){
    imageUrl = await uploadImage(productForm.image_file);
   }

   const data = {

    name: productForm.name,
    description: productForm.description,
    price: parseFloat(productForm.price),
    image_url: imageUrl,
    category_ids: productForm.category_ids,
    createdAt: serverTimestamp()

   };

   await addDoc(collection(db,"products"),data);

   toast.success("Producto creado");

   setShowProductDialog(false);

   setProductForm({
    name:"",
    description:"",
    price:"",
    image_file:null,
    category_ids:[]
   });

   fetchProducts();

  } catch(err){

   console.error(err);
   toast.error("Error creando producto");

  }

 };


 const handleDeleteProduct = async(id)=>{

  if(window.confirm("¿Eliminar producto?")){

   await deleteDoc(doc(db,"products",id));

   toast.success("Producto eliminado");

   fetchProducts();

  }

 };


 const handleSaveCategory = async(e)=>{

  e.preventDefault();

  await addDoc(collection(db,"categories"),{
   name:categoryForm.name,
   description:categoryForm.description
  });

  toast.success("Categoría creada");

  setShowCategoryDialog(false);

  setCategoryForm({
   name:"",
   description:""
  });

  fetchCategories();

 };


 const toggleCategory = (id)=>{

  setProductForm(prev=>({

   ...prev,

   category_ids: prev.category_ids.includes(id)
    ? prev.category_ids.filter(c=>c!==id)
    : [...prev.category_ids,id]

  }));

 };


 return (

  <div className="min-h-screen bg-slate-50">

   <Toaster richColors/>

   <header className="bg-white border-b">

    <div className="container mx-auto px-4 py-4 flex justify-between">

     <h1 className="text-2xl font-bold">
      Panel Admin
     </h1>

     <Button variant="outline" onClick={logout}>
      <LogOut className="w-4 h-4 mr-2"/> Salir
     </Button>

    </div>

   </header>


   <div className="container mx-auto px-4 py-10">

    <Tabs defaultValue="products">

     <TabsList className="mb-6">

      <TabsTrigger value="products">
       <Package className="w-4 h-4 mr-2"/> Productos
      </TabsTrigger>

      <TabsTrigger value="categories">
       <Tag className="w-4 h-4 mr-2"/> Categorías
      </TabsTrigger>

     </TabsList>


     <TabsContent value="products">

      <Button
       onClick={()=>setShowProductDialog(true)}
       className="mb-6"
      >
       <Plus className="w-4 h-4 mr-2"/> Nuevo Producto
      </Button>


      <div className="grid md:grid-cols-3 gap-6">

       {products.map(p=>(

        <Card key={p.id}>

         <CardHeader>
          <CardTitle>{p.name}</CardTitle>
         </CardHeader>

         <CardContent>

          {p.image_url && (
           <img
            src={p.image_url}
            className="mb-4 rounded"
           />
          )}

          <p className="text-sm mb-2">
           {p.description}
          </p>

          <p className="font-bold mb-4">
           ${p.price}
          </p>

          <Button
           size="sm"
           variant="outline"
           onClick={()=>handleDeleteProduct(p.id)}
          >
           <Trash2 className="w-4 h-4"/>
          </Button>

         </CardContent>

        </Card>

       ))}

      </div>

     </TabsContent>


     <TabsContent value="categories">

      <Button
       onClick={()=>setShowCategoryDialog(true)}
       className="mb-6"
      >
       <Plus className="w-4 h-4 mr-2"/> Nueva Categoría
      </Button>


      <div className="grid md:grid-cols-3 gap-6">

       {categories.map(c=>(

        <Card key={c.id}>

         <CardHeader>
          <CardTitle>{c.name}</CardTitle>
         </CardHeader>

         <CardContent>

          <p className="text-sm mb-4">
           {c.description}
          </p>

         </CardContent>

        </Card>

       ))}

      </div>

     </TabsContent>

    </Tabs>

   </div>


   {/* DIALOG PRODUCTO */}

   <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>

    <DialogContent>

     <DialogHeader>
      <DialogTitle>Nuevo Producto</DialogTitle>
     </DialogHeader>

     <form onSubmit={handleSaveProduct} className="space-y-4">

      <div>
       <Label>Nombre</Label>
       <Input
        value={productForm.name}
        onChange={(e)=>setProductForm({...productForm,name:e.target.value})}
       />
      </div>

      <div>
       <Label>Descripción</Label>
       <Textarea
        value={productForm.description}
        onChange={(e)=>setProductForm({...productForm,description:e.target.value})}
       />
      </div>

      <div>
       <Label>Precio</Label>
       <Input
        type="number"
        value={productForm.price}
        onChange={(e)=>setProductForm({...productForm,price:e.target.value})}
       />
      </div>

      <div>
       <Label>Imagen</Label>
       <Input
        type="file"
        onChange={(e)=>setProductForm({...productForm,image_file:e.target.files[0]})}
       />
      </div>

      <div>

       <Label>Categorías</Label>

       <div className="flex flex-wrap gap-2 mt-2">

        {categories.map(cat=>(

         <Button
          key={cat.id}
          type="button"
          variant={
           productForm.category_ids.includes(cat.id)
            ? "default"
            : "outline"
          }
          onClick={()=>toggleCategory(cat.id)}
         >
          {cat.name}
         </Button>

        ))}

       </div>

      </div>

      <Button type="submit" className="w-full">
       Crear Producto
      </Button>

     </form>

    </DialogContent>

   </Dialog>


  </div>

 );

};

export default AdminPage;
