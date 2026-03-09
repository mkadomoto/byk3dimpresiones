import React from 'react';
import { Badge } from './ui/badge';
import { CheckCircle2, Award, Zap, Users } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: <Award className="w-10 h-10 text-cyan-600" />,
      title: "Calidad Premium",
      description: "Materiales de primera calidad y tecnología de vanguardia"
    },
    {
      icon: <Zap className="w-10 h-10 text-blue-600" />,
      title: "Plazos de entrega mínimos",
      description: "Trabajamos eficientemente para que tengas tu producto lo antes posible"
    },
    {
      icon: <Users className="w-10 h-10 text-orange-600" />,
      title: "Atención Personalizada",
      description: "Te asesoramos en cada paso de tu proyecto"
    }
  ];

  const highlights = [
    "Tecnología Avanzada",
    "Materiales Diversos",
    "Asesoría Profesional"
  ];

  return (
    <section id="sobre-nosotros" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-cyan-100 text-cyan-700 hover:bg-cyan-200">Sobre Nosotros</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Expertos en Impresión 3D
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Somos especialistas en impresión 3D en Buenos Aires, enfocados en brindar 
            soluciones innovadoras para arquitectos, diseñadores de interiores y empresas 
            que buscan llevar sus ideas a la realidad.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1642969164999-979483e21601"
                alt="Impresión 3D"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-cyan-600 text-white p-6 rounded-xl shadow-xl max-w-[200px]">
              <div className="text-4xl font-bold mb-1">+3</div>
              <div className="text-sm">Años de experiencia</div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <h3 className="text-3xl font-bold text-slate-900 mb-6">
              Transformamos Ideas en Realidad
            </h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Con tecnología de punta y un equipo apasionado, convertimos diseños digitales 
              en objetos tangibles con precisión excepcional. Cada proyecto es único y merece 
              nuestra máxima atención.
            </p>

            <div className="space-y-4 mb-8">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                  </div>
                  <span className="text-lg font-semibold text-slate-900">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-100">
              <p className="text-slate-700 font-medium">
                💡 Trabajamos con vos para optimizar cada diseño y garantizar los mejores resultados
              </p>
            </div>
          </div>
        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 group hover:border-cyan-300"
            >
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
