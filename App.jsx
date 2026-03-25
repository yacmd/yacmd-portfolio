import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { MessageCircle, Instagram, Mail, Copy, Check, Star, ChevronRight, Play, Layers } from "lucide-react";
import data from "/data.json";
import "/index.css";
/* ─── Helpers ─────────────────────────────────── */
const NEON = "#00f2ff";

function useCounter(target, inView, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

/* ─── Custom Cursor ───────────────────────────── */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => {
      if (dot.current) {
        dot.current.style.left = `${e.clientX - 3}px`;
        dot.current.style.top = `${e.clientY - 3}px`;
      }
      if (ring.current) {
        ring.current.style.left = `${e.clientX - 18}px`;
        ring.current.style.top = `${e.clientY - 18}px`;
      }
    };
    const over = (e) => {
      if (e.target.closest("a,button,[data-cursor]")) setHovering(true);
    };
    const out = () => setHovering(false);
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className={`cursor-ring ${hovering ? "hovering" : ""}`} />
    </>
  );
}

/* ─── Navbar ──────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between transition-all duration-500 ${scrolled ? "nav-scrolled" : ""}`}
    >
      {/* Logo */}
      <a href="#" className="font-syne font-800 text-xl tracking-widest text-white hover:text-[#00f2ff] transition-colors duration-300">
        YACMD
      </a>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8">
        {data.nav.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-sm text-white/50 hover:text-white transition-colors duration-300 tracking-widest uppercase font-medium"
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <a
        href={`mailto:${data.brand.email}`}
        className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-black pulse-glow"
        style={{ background: NEON }}
      >
        {data.brand.ctaButton}
        <ChevronRight size={14} />
      </a>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-px w-6 bg-white"
            animate={
              menuOpen
                ? i === 0 ? { rotate: 45, y: 8 }
                : i === 1 ? { opacity: 0 }
                : { rotate: -45, y: -8 }
                : { rotate: 0, y: 0, opacity: 1 }
            }
            transition={{ duration: 0.3 }}
          />
        ))}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-b border-white/5 py-6 px-8 flex flex-col gap-6 md:hidden"
          >
            {data.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-white/70 hover:text-white tracking-widest uppercase"
              >
                {item.label}
              </a>
            ))}
            <a
              href={`mailto:${data.brand.email}`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-black w-fit pulse-glow"
              style={{ background: NEON }}
            >
              {data.brand.ctaButton}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ─── Hero ────────────────────────────────────── */
function Hero() {
  const imgRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });

  const handleMouseMove = useCallback((e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.18;
    const dy = (e.clientY - cy) * 0.18;
    mx.set(dx);
    my.set(dy);
  }, [mx, my]);

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 md:px-12 pt-24 pb-16">
      {/* Mesh gradients */}
      <div className="absolute inset-0 mesh-tl pointer-events-none" />
      <div className="absolute inset-0 mesh-br pointer-events-none" />
      <div className="absolute inset-0 mesh-tr pointer-events-none" />
      <div className="absolute inset-0 noise-overlay" />

      {/* Background YACMD */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <span
          className="font-syne font-bold text-white bg-drift select-none"
          style={{
            fontSize: "clamp(120px, 22vw, 300px)",
            opacity: 0.025,
            filter: "blur(12px)",
            letterSpacing: "0.1em",
            userSelect: "none",
          }}
        >
          YACMD
        </span>
      </div>

      {/* Decorative lines */}
      <div className="absolute top-1/3 left-0 w-32 h-px" style={{ background: `linear-gradient(90deg, transparent, ${NEON})`, opacity: 0.3 }} />
      <div className="absolute bottom-1/3 right-0 w-48 h-px" style={{ background: `linear-gradient(270deg, transparent, ${NEON})`, opacity: 0.2 }} />

      <div className="relative z-10 max-w-6xl w-full mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-8" style={{ background: NEON }} />
            <span className="text-xs tracking-[0.25em] uppercase font-medium" style={{ color: NEON }}>
              Creative Studio
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-syne font-bold leading-[1.05] mb-6"
            style={{ fontSize: "clamp(42px, 6vw, 88px)" }}
          >
            {data.brand.tagline.split(" ").map((word, i) => (
              <span key={i} className={i === 1 || i === 2 ? "block" : ""}>
                {i === 2 ? (
                  <span style={{ color: NEON, textShadow: `0 0 30px rgba(0,242,255,0.4)` }}>{word} </span>
                ) : (
                  <span className="text-white">{word} </span>
                )}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-white/50 text-lg leading-relaxed mb-10 max-w-md"
          >
            {data.brand.subtagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#portfolio"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-black pulse-glow transition-all duration-300 hover:scale-105"
              style={{ background: NEON }}
            >
              <Play size={14} fill="black" /> View Work
            </a>
            <a
              href={`mailto:${data.brand.email}`}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium text-white/80 glass hover:text-white hover:border-white/20 transition-all duration-300"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Let's Talk
            </a>
          </motion.div>
        </div>

        {/* Magnetic Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex justify-center md:justify-end"
          ref={imgRef}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            style={{ x: sx, y: sy }}
            className="relative"
            data-cursor="true"
          >
            {/* Outer glow ring */}
            <div
              className="absolute -inset-4 rounded-full opacity-30"
              style={{
                background: `radial-gradient(circle, rgba(0,242,255,0.3) 0%, transparent 70%)`,
                filter: "blur(20px)",
              }}
            />
            {/* Rotating border */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, transparent 70%, ${NEON} 100%)`,
                opacity: 0.6,
              }}
            />
            {/* Image container */}
            <div
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden"
              style={{ border: "1px solid rgba(0,242,255,0.2)" }}
            >
              <img
                src={data.brand.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {/* Inner glass overlay */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(0,242,255,0.08) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 glass rounded-2xl px-4 py-2.5"
              style={{ border: "1px solid rgba(0,242,255,0.2)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: "0 0 6px #4ade80" }} />
                <span className="text-xs text-white/70 font-medium">Available for work</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12"
          style={{ background: `linear-gradient(180deg, transparent, ${NEON})` }}
        />
      </motion.div>
    </section>
  );
}

/* ─── Stats ───────────────────────────────────── */
function StatCard({ stat }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCounter(stat.value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass rounded-2xl p-8 relative overflow-hidden group"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      data-cursor="true"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,242,255,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10">
        <div className="stat-number font-syne font-bold mb-2" style={{ fontSize: "clamp(40px, 5vw, 64px)" }}>
          {count.toLocaleString()}{stat.suffix}
        </div>
        <div className="text-white/40 text-sm tracking-widest uppercase font-medium">
          {stat.label}
        </div>
      </div>

      {/* Corner accent */}
      <div
        className="absolute bottom-0 right-0 w-20 h-20 opacity-10"
        style={{ background: `radial-gradient(circle at bottom right, ${NEON}, transparent)` }}
      />
    </motion.div>
  );
}

function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="stats" className="py-24 px-6 md:px-12 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8" style={{ background: NEON }} />
            <span className="text-xs tracking-[0.25em] uppercase" style={{ color: NEON }}>By the numbers</span>
            <span className="h-px w-8" style={{ background: NEON }} />
          </div>
          <h2 className="font-syne font-bold text-4xl md:text-5xl text-white">Impact at Scale</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>

      <div className="gradient-line mt-24" />
    </section>
  );
}

/* ─── Portfolio ───────────────────────────────── */
function PortfolioItem({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const sizeClass =
    item.size === "large" ? "md:col-span-2 md:row-span-2" :
    item.size === "medium" ? "md:col-span-2" : "";

  const heightClass =
    item.size === "large" ? "h-72 md:h-full min-h-[340px]" :
    item.size === "medium" ? "h-52" : "h-52";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`portfolio-item glass rounded-2xl overflow-hidden relative group ${sizeClass}`}
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      data-cursor="true"
    >
      <div className={`relative ${heightClass} w-full`}>
       {item.videoUrl ? (
  <video
    src={item.videoUrl}
    poster={item.image}
    controls
    playsInline
    preload="metadata"
    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
    style={{ aspectRatio: item.aspectRatio === '9/16' ? '9/16' : '16/9' }}
  />
) : (
  <img
    src={item.image}
    alt={item.title}
    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
  />
)}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Neon overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "linear-gradient(to top, rgba(0,242,255,0.12) 0%, transparent 60%)" }}
        />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="tag-pill">{item.tag}</span>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,242,255,0.15)", border: "1px solid rgba(0,242,255,0.3)" }}
            >
              <ChevronRight size={14} color={NEON} />
            </motion.div>
          </div>
          <h3 className="font-syne font-bold text-white text-lg leading-tight">{item.title}</h3>
          <p className="text-white/50 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Portfolio() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Video", "Design"];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const filtered = filter === "All" ? data.portfolio : data.portfolio.filter(i => i.tag === filter);

  return (
    <section id="portfolio" className="py-24 px-6 md:px-12 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: NEON }} />
              <span className="text-xs tracking-[0.25em] uppercase" style={{ color: NEON }}>Selected work</span>
            </div>
            <h2 className="font-syne font-bold text-4xl md:text-5xl text-white">The Portfolio</h2>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === f
                    ? "text-black"
                    : "glass text-white/50 hover:text-white"
                }`}
                style={filter === f ? { background: NEON, border: "none" } : { border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" style={{ gridAutoRows: "minmax(180px, auto)" }}>
          {filtered.map((item, i) => (
            <PortfolioItem key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>

      <div className="gradient-line mt-24" />
    </section>
  );
}

/* ─── Testimonials ────────────────────────────── */
function TestimonialCard({ testimonial }) {
  return (
    <div
      className="glass rounded-2xl p-6 w-80 flex-shrink-0 relative"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.stars }).map((_, i) => (
          <Star key={i} size={12} fill={NEON} color={NEON} />
        ))}
      </div>

      <p className="text-white/60 text-sm leading-relaxed mb-5">"{testimonial.quote}"</p>

      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-10 h-10 rounded-full object-cover"
          style={{ border: "1px solid rgba(0,242,255,0.2)" }}
        />
        <div>
          <div className="text-white text-sm font-medium font-syne">{testimonial.name}</div>
          <div className="text-white/40 text-xs">{testimonial.role}</div>
        </div>
      </div>

      {/* Accent */}
      <div
        className="absolute top-4 right-4 opacity-20 font-syne font-bold text-5xl leading-none"
        style={{ color: NEON }}
      >"</div>
    </div>
  );
}

function Testimonials() {
  const doubled = [...data.testimonials, ...data.testimonials];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="testimonials" className="py-24 overflow-hidden" ref={ref}>
      <div className="px-6 md:px-12 max-w-6xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8" style={{ background: NEON }} />
            <span className="text-xs tracking-[0.25em] uppercase" style={{ color: NEON }}>Social proof</span>
            <span className="h-px w-8" style={{ background: NEON }} />
          </div>
          <h2 className="font-syne font-bold text-4xl md:text-5xl text-white">What Clients Say</h2>
        </motion.div>
      </div>

      {/* Fade masks */}
      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #000, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(270deg, #000, transparent)" }}
        />

        <div className="flex gap-5 infinite-scroll w-max px-6">
          {doubled.map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
          ))}
        </div>
      </div>

      <div className="gradient-line mt-24 px-6 md:px-12" />
    </section>
  );
}

/* ─── Footer / Contact ────────────────────────── */
function Footer() {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const copyEmail = () => {
    navigator.clipboard.writeText(data.brand.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const iconMap = { MessageCircle, Instagram, Mail };

  return (
    <footer className="py-24 px-6 md:px-12 relative" ref={ref}>
      {/* Mesh */}
      <div className="absolute inset-0 mesh-tl pointer-events-none opacity-50" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8" style={{ background: NEON }} />
            <span className="text-xs tracking-[0.25em] uppercase" style={{ color: NEON }}>Let's create</span>
            <span className="h-px w-8" style={{ background: NEON }} />
          </div>
          <h2 className="font-syne font-bold mb-6" style={{ fontSize: "clamp(36px, 5vw, 72px)" }}>
            Ready to <span style={{ color: NEON }}>Elevate</span>?
          </h2>
          <p className="text-white/40 text-lg max-w-md mx-auto mb-10">
            Let's turn your vision into something unforgettable.
          </p>

          {/* Email copy */}
          <div className="relative inline-flex items-center">
            <button
              onClick={copyEmail}
              className="flex items-center gap-3 px-8 py-4 glass rounded-2xl group transition-all duration-300 hover:border-white/20"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              data-cursor="true"
            >
              <span className="text-white/70 font-mono text-sm group-hover:text-white transition-colors">
                {data.brand.email}
              </span>
              <span
                className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300"
                style={{
                  background: copied ? "rgba(0,242,255,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${copied ? "rgba(0,242,255,0.4)" : "rgba(255,255,255,0.1)"}`,
                }}
              >
                {copied ? <Check size={14} color={NEON} /> : <Copy size={14} className="text-white/50" />}
              </span>
            </button>
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(0,242,255,0.15)", color: NEON, border: "1px solid rgba(0,242,255,0.3)" }}
                >
                  Copied!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-4 mb-16"
        >
          {data.social.map((s) => {
            const Icon = iconMap[s.icon];
            return (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 glass rounded-2xl flex items-center justify-center group transition-all duration-300 hover:scale-110"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                title={s.platform}
                data-cursor="true"
              >
                <Icon
                  size={18}
                  className="text-white/40 group-hover:text-white transition-colors duration-300"
                  style={{ "--hover-color": NEON }}
                />
              </a>
            );
          })}
        </motion.div>

        {/* Bottom bar */}
        <div className="gradient-line mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-syne font-bold text-xl tracking-widest" style={{ color: NEON }}>
            YACMD
          </span>
          <span className="text-white/20 text-xs tracking-widest">
            © {new Date().getFullYear()} {data.brand.name}. All rights reserved.
          </span>
          <div className="flex items-center gap-2">
            <Layers size={12} className="text-white/20" />
            <span className="text-white/20 text-xs">Crafted with precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── App ─────────────────────────────────────── */
export default function App() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Portfolio />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
