'use client';

import Link from 'next/link';

export default function IndexPage() {
  const pages = [
    {
      title: 'Creators Land',
      description: 'Cursos e workshops premium para criadores',
      href: '/creatorsland',
      gradient: 'from-purple-600 via-pink-500 to-orange-500',
      icon: '✨',
    },
    {
      title: 'Shark Tank School',
      description: 'Imersão do Crescimento ao Lucro',
      href: '/sharktank',
      gradient: 'from-blue-600 to-cyan-500',
      icon: '🦈',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Demo Pages</h1>
          <p className="text-gray-400 text-lg">Select a page to preview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] border border-white/10 hover:border-white/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${page.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

              <div className="relative z-10 p-6">
                {/* Real Preview Section */}
                <div className="mb-6 relative h-48 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <div className="absolute inset-0" style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '400%', height: '400%' }}>
                    <iframe
                      src={page.href}
                      className="w-full h-full pointer-events-none"
                      title={`Preview of ${page.title}`}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{page.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{page.title}</h2>
                    <p className="text-gray-400 text-sm mb-4">{page.description}</p>

                    <div className="flex items-center text-white/80 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium">View page</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
