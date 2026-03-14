import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Search, ShoppingBag } from 'lucide-react';

import { db } from "../firebase";

import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy 
} from "firebase/firestore";


const StorePage = () => {

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);


  // PRODUCTOS EN TIEMPO REAL
  useEffect(() => {

    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setAllProducts(lista);
      setProducts(lista);
      setLoading(false);

    });

    return () => unsubscribe();

  }, []);


  // CATEGORÍAS EN TIEMPO REAL
  useEffect(() => {

    const q = query(collection(db, "categories"), orderBy("name"));

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setCategories(lista);

    });

    return () => unsubscribe();

  }, []);


  // FILTROS
  useEffect(() => {

    let filtered = [...allProducts];

    if (selectedCategory) {

      filtered = filtered.filter(p =>
        p.category_ids?.includes(selectedCategory)
      );

    }

    if (searchTerm) {

      const term = searchTerm.toLowerCase();

      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );

    }

    setProducts(filtered);

  }, [searchTerm, selectedCategory, allProducts]);


  const handleContactForProduct = (product) => {

    const message = `Hola, estoy interesado en el producto: ${product.name} ($${product.price})`;

    window.location.href =
      `/?product=${product.id}&message=${encodeURIComponent(message)}#contacto`;

  };


  return (

    <div className="min-h-screen bg-slate-50">

      <Header />

      <main className="pt-24 pb-12">

        <div className="container mx-auto px-4">

          {/* HERO */}
          <div className="text-center mb-12">

            <div className="flex items-center justify-center gap-2 mb-4">
              <ShoppingBag className="w-8 h-8 text-cyan-600" />

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                Tienda 3D
              </h1>
            </div>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Explora nuestra colección de impresiones 3D listas para usar
            </p>

          </div>


          {/* BUSCADOR */}
          <div className="max-w-2xl mx-auto mb-12">

            <div className="relative">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 text-lg"
              />

            </div>

          </div>


          {/* FILTROS */}
          <div className="mb-12">

            <div className="flex flex-wrap gap-3 justify-center">

              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-cyan-600 hover:bg-cyan-700" : ""}
              >
                Todos
              </Button>

              {categories.map(category => (

                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "bg-cyan-600 hover:bg-cyan-700" : ""}
                >
                  {category.name}
                </Button>

              ))}

            </div>

          </div>


          {/* PRODUCTOS */}

          {loading ? (

            <div className="text-center py-12">

              <div className="inline-block w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>

              <p className="mt-4 text-slate-600">
                Cargando productos...
              </p>

            </div>

          ) : products.length === 0 ? (

            <div className="text-center py-12">

              <p className="text-slate-600 text-lg">
                No se encontraron productos
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {products.map(product => (

                <Card key={product.id} className="hover:shadow-xl transition-shadow flex flex-col">

                  <div className="aspect-square overflow-hidden bg-slate-100">

                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                  </div>

                  <CardHeader className="flex-grow">

                    <div className="h-14 mb-2">

                      {product.category_ids?.length > 0 ? (

                        <div className="flex flex-wrap gap-2">

                          {product.category_ids.map((catId, i) => {

                            const cat = categories.find(c => c.id === catId);

                            return cat ? (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {cat.name}
                              </Badge>
                            ) : null;

                          })}

                        </div>

                      ) : (
                        <div className="h-6"></div>
                      )}

                    </div>

                    <CardTitle className="text-lg line-clamp-2">
                      {product.name}
                    </CardTitle>

                    <CardDescription className="line-clamp-2 min-h-[40px]">
                      {product.description}
                    </CardDescription>

                  </CardHeader>

                  <CardContent className="pt-0">

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-cyan-600">
                        ${product.price}
                      </span>
                    </div>

                    <Button
                      className="w-full bg-slate-900 hover:bg-cyan-600"
                      onClick={() => handleContactForProduct(product)}
                    >
                      Contactar para Comprar
                    </Button>

                  </CardContent>

                </Card>

              ))}

            </div>

          )}

        </div>

      </main>

      <Footer />

    </div>
  );

};

export default StorePage;
