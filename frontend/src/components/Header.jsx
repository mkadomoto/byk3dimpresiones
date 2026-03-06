import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Printer, Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    // If we're not on home page, navigate there first
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo-square.png" alt="B&K 3D" className="w-10 h-10" />
            <span className="text-xl font-bold text-slate-800">B&K <span className="text-cyan-600">3D</span></span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <button onClick={() => scrollToSection('inicio')} className="text-slate-600 hover:text-cyan-600 transition-colors font-medium">
              Inicio
            </button>
            <button onClick={() => scrollToSection('servicios')} className="text-slate-600 hover:text-cyan-600 transition-colors font-medium">
              Servicios
            </button>
            <button onClick={() => scrollToSection('sobre-nosotros')} className="text-slate-600 hover:text-cyan-600 transition-colors font-medium">
              Nosotros
            </button>
            <Link to="/tienda" className="text-slate-600 hover:text-cyan-600 transition-colors font-medium">
              Tienda
            </Link>
            <button onClick={() => scrollToSection('contacto')} className="text-slate-600 hover:text-cyan-600 transition-colors font-medium">
              Contacto
            </button>
          </div>
          
          <div className="hidden lg:block">
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white" onClick={() => scrollToSection('contacto')}>
              Cotizar Proyecto
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-3">
            <button 
              onClick={() => scrollToSection('inicio')} 
              className="block w-full text-left py-2 text-slate-600 hover:text-cyan-600 transition-colors font-medium"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('servicios')} 
              className="block w-full text-left py-2 text-slate-600 hover:text-cyan-600 transition-colors font-medium"
            >
              Servicios
            </button>
            <button 
              onClick={() => scrollToSection('sobre-nosotros')} 
              className="block w-full text-left py-2 text-slate-600 hover:text-cyan-600 transition-colors font-medium"
            >
              Nosotros
            </button>
            <Link 
              to="/tienda" 
              className="block w-full text-left py-2 text-slate-600 hover:text-cyan-600 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tienda
            </Link>
            <button 
              onClick={() => scrollToSection('contacto')} 
              className="block w-full text-left py-2 text-slate-600 hover:text-cyan-600 transition-colors font-medium"
            >
              Contacto
            </button>
            <Button 
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white mt-4" 
              onClick={() => scrollToSection('contacto')}
            >
              Cotizar Proyecto
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;