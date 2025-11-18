'use client';

import { Chatbot } from '@/components/chatbot';

export default function CreatorsLandPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Creators Land 2025
            </h1>
            <p className="text-2xl md:text-3xl opacity-95 font-light">
              Onde criadores se tornam líderes
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-6">
              <div className="bg-white/20 backdrop-blur-lg px-8 py-4 rounded-full text-lg font-semibold">
                ✨ 21 Cursos Premium
              </div>
              <div className="bg-white/20 backdrop-blur-lg px-8 py-4 rounded-full text-lg font-semibold">
                🎓 Certificação
              </div>
              <div className="bg-white/20 backdrop-blur-lg px-8 py-4 rounded-full text-lg font-semibold">
                🤝 Networking
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="group relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-6xl mb-6">🚀</div>
              <h3 className="text-2xl font-bold mb-4">Empreendedorismo</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Transforme sua ideia em um negócio de sucesso com estratégias comprovadas
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-gradient-to-br from-pink-500 to-orange-500 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-6xl mb-6">💡</div>
              <h3 className="text-2xl font-bold mb-4">Liderança</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Desenvolva habilidades de liderança estratégica e inspire equipes de alta performance
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-gradient-to-br from-green-500 to-teal-500 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-6xl mb-6">📈</div>
              <h3 className="text-2xl font-bold mb-4">Crescimento</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Escale sua carreira com marketing digital, vendas e estratégias de crescimento
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto">
            Fale com nosso assistente para conhecer os cursos e encontrar o perfeito para você
          </p>
          <div className="text-7xl mb-8 animate-bounce">👇</div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot accountId="0e633e01-b2a8-46a2-acd9-f9f6853f8031" />
    </div>
  );
}
