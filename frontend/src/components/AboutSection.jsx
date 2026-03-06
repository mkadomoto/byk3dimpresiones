import React from 'react';
import { Badge } from './ui/badge';
import { CheckCircle2, Award, Clock, Shield } from 'lucide-react';

const AboutSection = () => {
  const values = [
    {
      icon: <Award className="w-8 h-8 text-cyan-600" />,
      title: "Calidad Premium",
      description: ""
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Plazos de entrega mínimos",
      description: ""
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-600" />,
      title: "Garantía Total",
      description: ""
    }
  ];

  return (
    <section id="sobre-nosotros" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <Badge className="mb-4 bg-cyan-100 text-cyan-700 hover:bg-cyan-200">Sobre Nosotros</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Expertos en Impresión 3D para Profesionales
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Somos una empresa especializada en servicios de impresión 3D de alta calidad, enfocados en satisfacer 
              las necesidades de arquitectos, diseñadores de interiores y empresas que buscan soluciones innovadoras.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Con años de experiencia y tecnología de punta, transformamos ideas digitales en objetos físicos 
              con precisión excepcional. Nuestro equipo de expertos trabaja de cerca con cada cliente para 
              garantizar resultados que superan las expectativas.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-cyan-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Tecnología Avanzada</h4>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-cyan-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Materiales Diversos</h4>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-cyan-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Asesoría Profesional</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1642969164999-979483e21601"
                alt="3D Printing Process"
                className="rounded-lg shadow-xl w-full h-64 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1761940546803-ad87f8155b6a"
                alt="Architectural Model"
                className="rounded-lg shadow-xl w-full h-64 object-cover mt-8"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-100"
            >
              <div className="mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
              {value.description && <p className="text-slate-600">{value.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
