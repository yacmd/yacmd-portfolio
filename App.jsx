import React, { useState, useEffect } from 'react';
import { Instagram, Mail, MessageCircle, ChevronRight, Menu, X } from 'lucide-react';

const App = () => {
  const [data, setData] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Error loading data:", err));
  }, []);

  if (!data) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  const filteredPortfolio = activeFilter === 'All' 
    ? data.portfolio 
    : data.portfolio.filter(item => item.tag === activeFilter);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Nav */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-black tracking-tighter uppercase">{data.brand.name}</h1>
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest">
          {data.nav.map((link, i) => <a key={i} href={link.href} className="hover:text-cyan-400 transition-colors">{link.label}</a>)}
        </div>
        <button className="bg-cyan-500 text-black px-5 py-2 rounded-full text-xs font-bold uppercase hover:bg-cyan-400 transition-all">
          {data.brand.ctaButton}
        </button>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-6xl md:text-8xl font-black leading-none tracking-tighter uppercase">
            {data.brand.tagline}
          </h2>
          <p className="text-gray-400 text-lg max-w-sm">{data.brand.subtagline}</p>
          <button className="bg-white text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-500 transition-all group">
            VIEW PORTFOLIO <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-cyan-500/20 blur-[120px] rounded-full"></div>
          <img src={data.brand.profileImage} alt="Profile" className="relative w-80 h-80 md:w-[450px] md:h-[450px] rounded-full object-cover border-2 border-white/10 shadow-2xl" />
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <h3 className="text-4xl font-black uppercase tracking-tighter">Selected Work</h3>
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            {['All', 'Video', 'Design', 'Logo'].map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === f ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid Fix */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPortfolio.map((item) => (
            <div key={item.id} className="break-inside-avoid bg-[#111] rounded-2xl overflow-hidden border border-white/5 group hover:border-cyan-500/50 transition-all duration-500 shadow-xl">
              
              {/* Media Display - Fixed to show full content */}
              <div className="bg-black flex items-center justify-center min-h-[250px] w-full relative">
                {item.videoUrl ? (
                  <video 
                    key={item.videoUrl}
                    src={item.videoUrl} 
                    poster={item.image} 
                    controls 
                    playsInline 
                    className="w-full h-auto object-contain max-h-[70vh]"
                  />
                ) : (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                    onClick={() => window.open(item.image, '_blank')}
                  />
                )}
                <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[10px] font-bold tracking-widest uppercase border border-white/10">
                  {item.tag}
                </div>
              </div>

              <div className="p-5 border-t border-white/5">
                <h4 className="font-bold text-lg uppercase tracking-tight">{item.title}</h4>
                <p className="text-gray-500 text-xs mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-20 border-t border-white/5 text-center">
        <div className="flex gap-6 justify-center mb-8">
          {data.social.map(s => (
            <a key={s.id} href={s.url} className="p-4 bg-white/5 rounded-full hover:bg-cyan-500 hover:text-black transition-all">
              {s.icon === 'Instagram' && <Instagram size={20} />}
              {s.icon === 'MessageCircle' && <MessageCircle size={20} />}
              {s.icon === 'Mail' && <Mail size={20} />}
            </a>
          ))}
        </div>
        <p className="text-gray-600 text-[10px] font-bold tracking-[0.3em] uppercase">© {new Date().getFullYear()} {data.brand.name} • DIGITAL STUDIO</p>
      </footer>
    </div>
  );
};

export default App;
