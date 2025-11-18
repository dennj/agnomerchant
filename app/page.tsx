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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-6 relative">
      {/* Top Navigation Links */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
        {/* Dashboard Link */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors group"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-sm font-medium">Dashboard</span>
        </Link>

        {/* GitHub Link */}
        <a
          href="https://github.com/dennj/agnomerchant"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors group"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">GitHub</span>
        </a>
      </div>

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
