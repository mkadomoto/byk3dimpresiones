import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

import { db } from "../firebase";
import {
  collection,
  getDocs
} from "firebase/firestore";

const HomePage = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();

    // Scroll por hash (#contacto, etc)
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));

    const lista = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setProducts(lista);
  };

  // ⚠️ CAMBIÁ ESTE NÚMERO POR EL TUYO
  const whatsappNumber = "5491123456789";

  const generarMensaje = (producto) => {
    return `Hola! Me interesa este producto: ${producto.name}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-20">
        <HeroSection />
        <ServicesSection />

        {/* 🔥 SECCIÓN PRODUCTOS */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">

            <h2 className="text-3xl font-bold text-center mb-10">
              Productos Destacados
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {products.slice(0, 6).map(product => (

                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-md p-4 border"
                >

                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-56 object-cover rounded-xl mb-4"
                    />
                  )}

                  <h3 className="text-xl font-semibold mb-2">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-2">
                    {product.description}
                  </p>

                  <p className="font-bold text-lg mb-4">
                    ${product.price}
                  </p>

                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(generarMensaje(product))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl transition"
                  >
                    Contactar para comprar
                  </a>

                </div>

              ))}

            </div>

          </div>
        </section>

        <AboutSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
