'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function SharkTankSchoolPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Desktop */}
      <section className="hidden md:block relative overflow-hidden min-h-[700px]">
        {/* Full background image spanning entire section */}
        <div className="absolute inset-0">
          <Image
            src="https://eventos.sharktankschool.com.br/wp-content/uploads/2025/11/CAROL-PAIFFER.webp"
            alt="Carol Paiffer e Bruno Pinheiro"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right side - Content */}
        <div className="relative z-10 ml-auto w-1/2 min-h-[700px] flex items-center">
          <div className="text-white space-y-7 px-8 md:px-16 py-12 w-full">
            <div className="relative w-full max-w-xl h-36 mb-4">
              <Image
                src="https://eventos.sharktankschool.com.br/wp-content/uploads/2025/11/ARTES-PAGINA-SHARK-TANK-1-1-1024x474.webp"
                alt="Imersão do Crescimento ao Lucro"
                fill
                className="object-contain object-left"
                priority
              />
            </div>

            <p className="text-xl md:text-2xl leading-relaxed max-w-xl">
              Vamos criar com você a estratégia de crescimento da sua empresa para 2026 e mostrar como os{' '}
              <span className="text-[#FFE262] font-bold">Sharks escalam seus lucros!</span>
            </p>

            <div className="border-2 border-[#FFE262] rounded-md p-4 inline-flex items-center">
              <svg className="w-6 h-6 text-[#FFE262] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 448 512">
                <path d="M400 64h-48V12c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v52H160V12c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v52H48C21.49 64 0 85.49 0 112v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 400H54a6 6 0 0 1-6-6V160h352v298a6 6 0 0 1-6 6zm-52.849-200.65L198.842 404.519c-4.705 4.667-12.303 4.637-16.971-.068l-75.091-75.699c-4.667-4.705-4.637-12.303.068-16.971l22.719-22.536c4.705-4.667 12.303-4.637 16.97.069l44.104 44.461 111.072-110.181c4.705-4.667 12.303-4.637 16.971.068l22.536 22.718c4.667 4.705 4.636 12.303-.069 16.97z"></path>
              </svg>
              <p className="text-base md:text-lg font-semibold">
                <span className="font-bold">ONLINE</span> e <span className="font-bold">AO VIVO</span> dia{' '}
                <span className="font-bold">25/11</span>, das <span className="font-bold">9h às 18h</span>
              </p>
            </div>

            <button
              onClick={() => setIsPopupOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 text-base md:text-lg uppercase shadow-xl inline-block"
            >
              Garanta sua vaga agora por apenas R$97,00
            </button>

            <div className="space-y-3 max-w-xl">
              <p className="text-base md:text-lg leading-relaxed">
                <span className="font-bold">Em 1 dia</span> vamos construir o plano estratégico e te mostrar na prática com ajuda de{' '}
                <span className="font-bold">Agentes de IA</span> como implementar e direcionar seu time com{' '}
                <span className="font-bold">planos de ação claros,</span> fazendo com que entreguem resultados e não desculpas.
              </p>
              <p className="text-base md:text-lg italic">
                Domine o jogo do crescimento ao lucro sem precisar sair de casa!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section - Mobile */}
      <section className="block md:hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            <div className="relative h-[400px] w-full">
              <Image
                src="https://eventos.sharktankschool.com.br/wp-content/uploads/2025/11/CAROL-PAIFFER-1.webp"
                alt="Carol Paiffer"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>

            <div className="text-white space-y-6">
              <p className="text-xl leading-relaxed">
                Vamos criar com você a estratégia de crescimento da sua empresa para 2026 e mostrar como os{' '}
                <span className="text-yellow-400 font-bold">Sharks escalam seus lucros!</span>
              </p>

              <button
                onClick={() => setIsPopupOpen(true)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-6 rounded-lg transition-all"
              >
                Garanta sua vaga agora por apenas R$97,00
              </button>

              <div className="space-y-3">
                <p className="text-base leading-relaxed">
                  <strong>Em 1 dia</strong> vamos construir o plano estratégico e te mostrar na prática com ajuda de{' '}
                  <strong>Agentes de IA</strong> como implementar e direcionar seu time com{' '}
                  <strong>planos de ação claros,</strong> fazendo com que entreguem resultados e não desculpas.
                </p>
                <p className="text-lg font-bold italic">
                  Domine o jogo do crescimento ao lucro sem precisar sair de casa!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Para quem é esse treinamento */}
      <section className="py-16 md:py-20 bg-[#0a1628]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#FFE262] mb-12 md:mb-16">
            Para quem é esse treinamento?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                title: 'Empreendedores',
                text: 'que querem um negócio lucrativo em 2026',
                subtext: 'mas sentem que seu time depende de você para tudo',
              },
              {
                title: 'Quem deseja',
                text: 'construir um negócio sem ser no improviso,',
                subtext: 'com estratégia, clareza e indicadores claros',
              },
              {
                title: 'Diretores, executivos e empresários',
                text: 'que buscam uma empresa lucrativa, atrativa para investidores',
                subtext: 'e com desejo de crescimento',
              },
              {
                title: 'Líderes',
                text: 'que buscam um time remando na mesma direção',
                subtext:
                  'com um plano claro, métricas seguras e que entregue resultados e não desculpas',
              },
            ].map((item, index) => (
              <div key={index} className="bg-[#1a2942] rounded-lg p-5 md:p-6 hover:bg-[#1f3250] transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="bg-[#FFE262] rounded-full p-1.5 flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[#0a1628]" fill="currentColor" viewBox="0 0 512 512">
                      <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
                    </svg>
                  </div>
                  <div className="text-white flex-1">
                    <p className="font-bold text-sm md:text-base mb-1">{item.title}</p>
                    <p className="text-xs md:text-sm leading-relaxed">{item.text}</p>
                    <p className="text-xs md:text-sm text-gray-300 leading-relaxed">{item.subtext}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-10">
              <div className="relative h-32 w-64">
                <Image
                  src="https://eventos.sharktankschool.com.br/wp-content/uploads/2025/11/ARTES-PAGINA-SHARK-TANK-4-819x1024.webp"
                  alt="Shark Tank School"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-5 text-gray-800">
              <p className="text-base md:text-lg leading-relaxed text-center">
                Criada para ajudar empreendedores e empresários a crescerem com estratégia e estrutura, a{' '}
                <strong>Shark Tank School</strong> ensina como ajustar o modelo de negócio, aprimorar a gestão,
                fortalecer o marketing e escalar as vendas com lucro.
              </p>

              <p className="text-base md:text-lg leading-relaxed text-center">
                A <strong>Jornada do Crescimento e Lucro</strong> é um treinamento intenso, prático e transformador
                criado por <strong>Carol Paiffer</strong> e <strong>Bruno Pinheiro</strong> para donos de pequenos e
                médios negócios que querem <strong>dominar o jogo do crescimento.</strong>
              </p>

              <p className="text-base md:text-lg leading-relaxed text-center">
                Durante um dia inteiro, você vai aprender a pensar e agir como um{' '}
                <strong>empresário de alta performance</strong> com clareza estratégica, foco em resultados e execução
                real.
              </p>

              <p className="text-base md:text-lg leading-relaxed text-center">
                Mais do que um curso, é uma <strong>imersão de aceleração</strong> que te entrega o mapa para crescer
                com <strong>método, liderança</strong> e <strong>visão de longo prazo.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* O que você vai aprender */}
      <section className="py-16 md:py-20 bg-[#0a1628] relative">
        {/* Decorative wave divider at top */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-white">
          <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path fill="#0a1628" d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 pt-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#FFE262] mb-12 md:mb-16">
            O que você vai aprender?
          </h2>

          {/* Top row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 max-w-7xl mx-auto">
            {[
              {
                icon: (
                  <path d="M208 0c-29.9 0-54.7 20.5-61.8 48.2-.8 0-1.4-.2-2.2-.2-35.3 0-64 28.7-64 64 0 4.8.6 9.5 1.7 14C52.5 138 32 166.6 32 200c0 12.6 3.2 24.3 8.3 34.9C16.3 248.7 0 274.3 0 304c0 33.3 20.4 61.9 49.4 73.9-.9 4.6-1.4 9.3-1.4 14.1 0 39.8 32.2 72 72 72 4.1 0 8.1-.5 12-1.2 9.6 28.5 36.2 49.2 68 49.2 39.8 0 72-32.2 72-72V64c0-35.3-28.7-64-64-64zm368 304c0-29.7-16.3-55.3-40.3-69.1 5.2-10.6 8.3-22.3 8.3-34.9 0-33.4-20.5-62-49.7-74 1-4.5 1.7-9.2 1.7-14 0-35.3-28.7-64-64-64-.8 0-1.5.2-2.2.2C422.7 20.5 397.9 0 368 0c-35.3 0-64 28.6-64 64v376c0 39.8 32.2 72 72 72 31.8 0 58.4-20.7 68-49.2 3.9.7 7.9 1.2 12 1.2 39.8 0 72-32.2 72-72 0-4.8-.5-9.5-1.4-14.1 29-12 49.4-40.6 49.4-73.9z" />
                ),
                title: 'Mentalidade Shark',
                description: 'Entenda, pense e aja como um empresário de sucesso que lucra',
                highlight: 'todos os meses.',
              },
              {
                icon: (
                  <path d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z" />
                ),
                title: 'Estratégias de crescimento',
                description:
                  'Você vai aprender como definir estratégia de negócio, branding e crescimento e como ter um plano tático com indicadores de resultados claros.',
              },
              {
                icon: (
                  <path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z" />
                ),
                title: 'Da tática ao time que executa e lucra',
                description: 'Você vai aprender como direcionar seu time para que tenham liberdade e entregar resultados.',
              },
            ].map((item, index) => (
              <div key={index} className="bg-[#1a2942] rounded-lg p-6 md:p-8 text-center hover:bg-[#1f3250] transition-colors">
                <div className="flex justify-center mb-4">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 576 512">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-[#FFE262] text-lg md:text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white text-sm md:text-base leading-relaxed">
                  {item.description} {item.highlight && <span className="font-bold">{item.highlight}</span>}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom row - 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
            {[
              {
                icon: (
                  <path d="M0 405.3V448c0 35.3 86 64 192 64s192-28.7 192-64v-42.7C342.7 434.4 267.2 448 192 448S41.3 434.4 0 405.3zM320 128c106 0 192-28.7 192-64S426 0 320 0 128 28.7 128 64s86 64 192 64zM0 300.4V352c0 35.3 86 64 192 64s192-28.7 192-64v-51.6c-41.3 34-116.9 51.6-192 51.6S41.3 334.4 0 300.4zm416 11c57.3-11.1 96-31.7 96-55.4v-42.7c-23.2 16.4-57.3 27.6-96 34.5v63.6zM192 160C86 160 0 195.8 0 240s86 80 192 80 192-35.8 192-80-86-80-192-80zm219.3 56.3c60-10.8 100.7-32 100.7-56.3v-42.7c-35.5 25.1-96.5 38.6-160.7 41.8 29.5 14.3 51.2 33.5 60 57.2z" />
                ),
                title: 'IA que reduz custos e aumenta resultados',
                description:
                  'Vamos te mostrar na prática como acessar agentes que executam o que você precisa fazer potencializando seu time.',
              },
              {
                icon: (
                  <path d="M128 148v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12zm140 12h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm-128 96h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm128 0h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm-76 84v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm76 12h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm180 124v36H0v-36c0-6.6 5.4-12 12-12h19.5V24c0-13.3 10.7-24 24-24h337c13.3 0 24 10.7 24 24v440H436c6.6 0 12 5.4 12 12zM79.5 463H192v-67c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v67h112.5V49L80 48l-.5 415z" />
                ),
                title: 'Empresa Lucrativa e Atrativa',
                description:
                  'Descubra quais ajustes você precisa fazer na sua operação e como construir um pitch de vendas para atrair investidores, parceiros e um time engajado.',
              },
            ].map((item, index) => (
              <div key={index} className="bg-[#1a2942] rounded-lg p-6 md:p-8 text-center hover:bg-[#1f3250] transition-colors">
                <div className="flex justify-center mb-4">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 512 512">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-[#FFE262] text-lg md:text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white text-sm md:text-base leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={() => setIsPopupOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 md:px-12 rounded-lg transition-all transform hover:scale-105 text-base md:text-lg uppercase shadow-lg"
            >
              QUERO PARTICIPAR DA IMERSÃO AO VIVO
            </button>
          </div>
        </div>
      </section>

      {/* Why Participate */}
      <section className="py-16 md:py-20 bg-[#0a1628]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FFE262] mb-6">
                Porque você deve participar desta imersão?
              </h2>
              <p className="text-base md:text-lg leading-relaxed mb-4">
                Vou fazer <strong>5 perguntas</strong> para você, se responder <strong>sim para 3,</strong> essa
                imersão é para você, pois vamos te mostrar como <strong>destravar ainda esse ano</strong> e ter um
                plano claro para crescer em 2026.
              </p>
            </div>

            <div className="space-y-3">
              {[
                'Não conseguiu bater as metas em 2025?',
                'Seu negócio tem mais potencial, mas está travado?',
                'Seu time está batendo cabeça e não entrega resultados?',
                'Você tem um plano de execução claro para seu negócio? Com objetivo, responsável e indicadores.',
                'Acha que não tem time suficiente para executar o que deseja?',
              ].map((question, index) => (
                <div key={index} className="bg-white rounded-lg p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow">
                  <svg className="w-6 h-6 text-[#FFE262] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 384 512">
                    <path d="M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148 25.049-31.381 43.63-49.449 82.757-49.449 30.764 0 68.816 19.799 68.816 49.631 0 22.552-18.617 34.134-48.993 51.164-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271 0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271-31.075-69.27-69.271-69.27z"></path>
                  </svg>
                  <span className="text-gray-900 text-sm md:text-base font-medium">{question}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* No loose tips */}
      <section className="py-16 md:py-20 bg-[#0a1628] text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFE262] mb-6">
            Nesta imersão você não terá dicas soltas.
          </h2>
          <p className="text-base md:text-lg text-white max-w-4xl mx-auto leading-relaxed">
            Você terá um <strong>plano estratégico, tático e operacional</strong> de crescimento e um
            passo a passo de como fazer com seu time implemente e traga lucro em <strong>2026.</strong>
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24 bg-[#050c16] relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-[#0d1b3a] via-[#1a2942] to-[#0d1b3a] rounded-3xl p-8 md:p-16 shadow-2xl border border-[#1e3a5f]/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                {/* Left side - Pricing */}
                <div className="text-center md:text-left space-y-6">
                  <h2 className="text-4xl md:text-5xl font-bold uppercase text-[#FFE262] leading-tight">
                    OFERTA BLACK<br />NOVEMBER
                  </h2>

                  <p className="text-white text-xl line-through opacity-60">De R$1.497,00 por</p>

                  <p className="text-6xl md:text-7xl font-bold text-[#4FC3F7]">R$97,00!</p>

                  <button
                    onClick={() => setIsPopupOpen(true)}
                    className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-5 px-10 rounded-lg transition-all transform hover:scale-105 uppercase text-base md:text-lg shadow-xl"
                  >
                    QUERO GARANTIR MEU INGRESSO
                  </button>
                </div>

                {/* Right side - Benefits */}
                <div className="text-white space-y-6">
                  <p className="text-[#FFE262] text-xl md:text-2xl font-bold uppercase tracking-wide">
                    O LOTE PODE VIRAR A QUALQUER MOMENTO!
                  </p>

                  <p className="text-xl font-bold">Garanta agora a sua vaga</p>

                  <ul className="space-y-4 text-base md:text-lg">
                    <li className="flex items-start">
                      <span className="text-[#FFE262] mr-3 text-xl">•</span>
                      <span>Ingresso para 1 dia de imersão</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFE262] mr-3 text-xl">•</span>
                      <span>Diagnóstico para descobrir o que impede seu crescimento</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFE262] mr-3 text-xl">•</span>
                      <span>Grupo Exclusivo WhatsApp</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFE262] mr-3 text-xl">•</span>
                      <span>Material de Apoio</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bonus */}
      <section className="py-16 md:py-20 bg-[#0a1628]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FFE262]">
                Bônus exclusivo para quem se inscrever agora!
              </h2>
              <div>
                <p className="text-xl md:text-2xl font-bold mb-3">Diagnóstico Shark do seu Negócio</p>
                <p className="text-base md:text-lg leading-relaxed">
                  Descubra seus gargalos e oportunidades e tenha um plano de ação para escalar a sua empresa em 2026!
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative h-[350px] md:h-[400px] w-full">
                <Image
                  src="https://eventos.sharktankschool.com.br/wp-content/uploads/2025/11/ARTES-PAGINA-SHARK-TANK-1-1024x1024.webp"
                  alt="Bonus"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 text-sm md:text-base shadow-lg"
                >
                  ACESSAR O BÔNUS
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Mentors - Desktop */}
      <section className="hidden md:block py-16 md:py-20 bg-[#0a1628]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6 text-white">
              <h2 className="text-2xl md:text-3xl font-bold text-[#FFE262] leading-tight">
                Seu negócio não precisa de mais esforço, precisa de clareza e direção.
              </h2>

              <p className="text-base md:text-lg leading-relaxed">
                <strong>Carol Paiffer,</strong> a maior investidora do <strong>Shark Tank Brasil</strong> com mais de
                130 empresas investidas no seu portfólio, vai te mostrar na prática como{' '}
                <strong>pensar como um tubarão,</strong> construir uma empresa atraente para investidores, parceiros e
                o que precisa ajustar para <strong>trazer lucro aos seus negócios.</strong>
              </p>

              <p className="text-base md:text-lg leading-relaxed">
                <strong>Bruno Pinheiro</strong>, fundador da <strong>Groovia</strong>, estrategista de crescimento de
                negócios, vai mostrar na prática como construir a <strong>estratégia certa</strong> para que seu
                marketing faça vendas, suas vendas virem recorrência e sua operação <strong>lucre com IA.</strong>
              </p>

              <p className="text-base md:text-lg leading-relaxed">
                A <strong>Imersão do Crescimento ao Lucro</strong> é para você que quer crescer mas não tem clareza de
                como fazer isso. <strong>Em apenas um dia,</strong> Bruno e Carol vão dar um caminho claro para você.
              </p>

              <p className="text-base md:text-lg leading-relaxed">
                Com um investimento simbólico de R$97,00 você terá a direção que precisa!
              </p>

              <button
                onClick={() => setIsPopupOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 uppercase shadow-lg"
              >
                QUERO PARTICIPAR DA IMERSÃO
              </button>
            </div>

            <div className="relative h-[500px] md:h-[600px] w-full">
              <Image
                src="https://eventos.sharktankschool.com.br/wp-content/uploads/2025/11/ARTES-PAGINA-SHARK-TANK-2-1024x1024.webp"
                alt="Carol and Bruno"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Mentors - Mobile */}
      <section className="block md:hidden py-16 bg-[#0a1628]">
        <div className="container mx-auto px-4 space-y-6">
          <div className="relative h-[400px] w-full">
            <Image
              src="https://eventos.sharktankschool.com.br/wp-content/uploads/2025/11/ARTES-PAGINA-SHARK-TANK-2-1024x1024.webp"
              alt="Carol and Bruno"
              fill
              className="object-contain"
            />
          </div>

          <div className="space-y-6 text-white">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFE262] leading-tight">
              Seu negócio não precisa de mais esforço, precisa de clareza e direção.
            </h2>

            <p className="text-base leading-relaxed">
              <strong>Carol Paiffer,</strong> a maior investidora do <strong>Shark Tank Brasil</strong> com mais de 130
              empresas investidas no seu portfólio, vai te mostrar na prática como{' '}
              <strong>pensar como um tubarão,</strong> construir uma empresa atraente para investidores, parceiros e o
              que precisa ajustar para <strong>trazer lucro aos seus negócios.</strong>
            </p>

            <p className="text-base leading-relaxed">
              <strong>Bruno Pinheiro</strong>, fundador da <strong>Groovia</strong>, estrategista de crescimento de
              negócios, vai mostrar na prática como construir a <strong>estratégia certa</strong> para que seu marketing
              faça vendas, suas vendas virem recorrência e sua operação <strong>lucre com IA.</strong>
            </p>

            <p className="text-base leading-relaxed">
              A <strong>Imersão do Crescimento ao Lucro</strong> é para você que quer crescer mas não tem clareza de como
              fazer isso. <strong>Em apenas um dia,</strong> Bruno e Carol vão dar um caminho claro para você.
            </p>

            <p className="text-base leading-relaxed">
              Com um investimento simbólico de R$97,00 você terá a direção que precisa!
            </p>

            <button
              onClick={() => setIsPopupOpen(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 uppercase shadow-lg"
            >
              QUERO PARTICIPAR DA IMERSÃO
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-[#050c16]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 md:mb-16">Perguntas Frequentes</h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'É ao vivo ou gravado?',
                answer: 'É 100% ao vivo, no dia 25/11, pelo Zoom. Não terá replay.',
              },
              {
                question: 'Preciso ter empresa aberta?',
                answer: 'Não. Mas o conteúdo é voltado para quem já vende e quer crescer com clareza.',
              },
              {
                question: 'E se eu não souber nada de IA?',
                answer: 'Você vai aprender do zero como usar agentes prontos para acelerar sua operação.',
              },
              {
                question: 'Vale para times?',
                answer: 'Sim! Você pode participar junto com sua liderança ou gestor de marketing/vendas.',
              },
            ].map((faq, index) => (
              <details key={index} className="group bg-[#0a1628] rounded-lg p-5 md:p-6 cursor-pointer border border-[#1a2942] hover:border-[#FFE262]/30 transition-colors">
                <summary className="flex items-center justify-between font-bold text-[#FFE262] text-base md:text-lg list-none">
                  <span>{faq.question}</span>
                  <svg
                    className="w-5 h-5 text-[#FFE262] transition-transform group-open:rotate-90 flex-shrink-0 ml-3"
                    fill="currentColor"
                    viewBox="0 0 256 512"
                  >
                    <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />
                  </svg>
                </summary>
                <p className="mt-4 text-white text-sm md:text-base leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full relative animate-[fadeInDown_0.3s_ease-out]">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl"
            >
              ×
            </button>

            <p className="text-white text-xl mb-6 text-center">
              Preencha o formulário para <strong className="text-yellow-400">garantir sua vaga exclusiva!</strong>
            </p>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />

              <input
                type="tel"
                placeholder="Seu número"
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />

              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105"
              >
                GARANTIR MINHA VAGA
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Google Tag Manager & Facebook Pixel Scripts would go in layout.tsx or a separate component */}
    </div>
  );
}
