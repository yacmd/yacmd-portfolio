import React, { useState, useEffect } from 'react';
import { 
  Instagram, 
  Mail, 
  MessageCircle, 
  ExternalLink, 
  Play, 
  Pause,
  ChevronRight,
  Star,
  Menu,
  X
} from 'lucide-react';

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

  if (!data) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>;

  const filteredPortfolio = activeFilter === 'All' 
    ? data.portfolio 
    : data.portfolio.filter(item => item.tag === activeFilter);

  const filters = ['All', 'Video', 'Design', 'Logo'];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-cyan-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            {data.brand.name}
          </h1>
          
          <div className="hidden md:flex gap-8">
            {data.nav.map((link, i) => (
              <a key={i} href={link.href} className="text-sm font-medium hover:text-cyan-400 transition-colors uppercase tracking-widest">
                {link.label}
              </a>
            ))}
          </div>

          <button className="hidden md:block bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105">
            {data.brand.ctaButton}
          </button>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Available for work
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              {data.brand.tagline.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? "text-cyan-500 block" : "block"}>{word}</span>
              ))}
            </h2>
            
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              {data.brand.subtagline}
            </p>

            <div className="flex gap-4">
              <button className="bg-white text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-500 transition-all group">
                View Work <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img 
              src={data.brand.profileImage} 
              alt="Profile" 
              className="relative w-80 h-80 md:w-[500px] md:h-[500px] rounded-full object-cover mx-auto border-2 border-white/10"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 border-y border-white/5 bg-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {data.stats.map((stat) => (
            <div key={stat.id}>
              <div className="text-4xl md:text-6xl font-black text-white mb-2">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-gray-500 uppercase tracking-widest text-xs font-bold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter">Selected Projects</h3>
              <div className="h-1 w-20 bg-cyan-500"></div>
            </div>
            
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeFilter === filter ? 'bg-cyan-500 text-black' : 'hover:bg-white/5 text-gray-400'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredPortfolio.map((item) => (
              <div key={item.id} className="break-inside-avoid group relative bg-[#151515] rounded-2xl overflow-hidden border border-white/5 hover:border-cyan-500/50 transition-all duration-500">
                
                {/* Media Container */}
                <div className="relative w-full overflow-hidden bg-black/40">
                  {item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      poster={item.image}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain cursor-pointer transition-transform duration-700 group-hover:scale-105"
                      onClick={() => window.open(item.image, '_blank')}
                    />
                  )}
                  
                  {/* Overlay for Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">{item.title}</h4>
                  <p className="text-gray-500 text-sm mt-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="py-20 bg-black border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">LET'S CREATE SOMETHING<br/><span className="text-cyan-500 uppercase">ICONIC</span></h2>
          
          <div className="flex gap-6 mb-12">
            {data.social.map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noreferrer"
                className="p-4 bg-white/5 rounded-full hover:bg-cyan-500 hover:text-black transition-all transform hover:-translate-y-2"
              >
                {link.icon === 'Instagram' && <Instagram size={24} />}
                {link.icon === 'MessageCircle' && <MessageCircle size={24} />}
                {link.icon === 'Mail' && <Mail size={24} />}
              </a>
            ))}
          </div>
          
          <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">
            © {new Date().getFullYear()} {data.brand.name} • ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
