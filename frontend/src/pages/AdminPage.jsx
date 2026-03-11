// AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Toaster } from '../components/ui/sonner';
import { Plus, Edit, Trash2, LogOut, Package, Tag } from 'lucide-react';
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp, doc, deleteDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.16.0/firebase-firestore.js';

const AdminPage = ({ user, logout }) => {

  const navigate = useNavigate();
  const db = window.db;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image_file: null,
    image_url: '',
    category_ids: []
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(lista);
  };

  const fetchCategories = async () => {
    const q = query(collection(db, 'categories'), orderBy('name'));
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCategories(lista);
  };

  // CLOUDINARY UPLOAD
  const uploadImage = async (file) => {

    const url = `https://api.cloudinary.com/v1_1/duiwinvef/image/upload`;

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

    let imageUrl = productForm.image_url;

    if(productForm.image_file){
      imageUrl = await uploadImage(productForm.image_file);
    }

    const data = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category_ids: productForm.category_ids,
      image_url: imageUrl,
      createdAt: serverTimestamp()
    };

    if(editingProduct){

      const docRef = doc(db,'products',editingProduct.id);
      await updateDoc(docRef,data);
      toast.success("Producto actualizado");

    } else {

      await addDoc(collection(db,'products'),data);
      toast.success("Producto creado");

    }

    setShowProductDialog(false);
    setEditingProduct(null);

    setProductForm({
      name:'',
      description:'',
      price:'',
      image_file:null,
      image_url:'',
      category_ids:[]
    });

    fetchProducts();
  };

  const handleDeleteProduct = async(id)=>{

    if(window.confirm("¿Eliminar producto?")){

      await deleteDoc(doc(db,'products',id));
      fetchProducts();
      toast.success("Producto eliminado");

    }
  };

  const handleSaveCategory = async(e)=>{

    e.preventDefault();

    const data = {
      name:categoryForm.name,
      description:categoryForm.description
    };

    if(editingCategory){

      const docRef = doc(db,'categories',editingCategory.id);
      await updateDoc(docRef,data);
      toast.success("Categoría actualizada");

    } else {

      await addDoc(collection(db,'categories'),data);
      toast.success("Categoría creada");

    }

    setShowCategoryDialog(false);
    setEditingCategory(null);

    setCategoryForm({
      name:'',
      description:''
    });

    fetchCategories();
  };

  const handleDeleteCategory = async(id)=>{

    if(window.confirm("¿Eliminar categoría?")){

      await deleteDoc(doc(db,'categories',id));
      fetchCategories();
      toast.success("Categoría eliminada");

    }
  };

  const toggleCategoryInProduct = (categoryId) => {

    setProductForm(prev => ({

      ...prev,

      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]

    }));
  };

  return (

    <div className="min-h-screen bg-slate-50">

      <Toaster richColors />

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

          {/* PRODUCTOS */}

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

                    <div className="flex gap-2">

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={()=>handleDeleteProduct(p.id)}
                      >
                        <Trash2 className="w-4 h-4"/>
                      </Button>

                    </div>

                  </CardContent>

                </Card>

              ))}

            </div>

          </TabsContent>

          {/* CATEGORIAS */}

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

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={()=>handleDeleteCategory(c.id)}
                    >
                      <Trash2 className="w-4 h-4"/>
                    </Button>

                  </CardContent>

                </Card>

              ))}

            </div>

          </TabsContent>

        </Tabs>

      </div>

    </div>
  );

};

export default AdminPage;
