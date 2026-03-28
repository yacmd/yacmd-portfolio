import { useState, useEffect, useRef } from "react";
import { Mail, MessageCircle, Instagram, Play, X, ExternalLink, ChevronDown } from "lucide-react";

const portfolioData = [
  {
    id: 1, type: 'video', title: 'Instagram Reels Style',
    poster: 'https://res.cloudinary.com/dqjkemqw3/image/upload/v1774462819/ChatGPT_Image_9_mars_2026_21_09_29_ny7j8f.png',
    src: 'https://res.cloudinary.com/dqjkemqw3/video/upload/v1774445704/0128_1_avwt1j.mp4'
  },
  {
    id: 2, type: 'video', title: 'Cinematic Storytelling',
    poster: 'https://res.cloudinary.com/dqjkemqw3/image/upload/v1774462754/ChatGPT_Image_9_mars_2026_22_09_50_b51bbk.png',
    src: 'https://res.cloudinary.com/dqjkemqw3/video/upload/v1774446013/0131_4_lvohdb.mp4'
  },
  {
    id: 3, type: 'video', title: 'Desert Vibes Edit',
    poster: 'https://res.cloudinary.com/dqjkemqw3/image/upload/v1774446088/WhatsApp_Image_2025-06-22_at_14.27.13_3a0d7429_zaavnf.jpg',
    src: 'https://res.cloudinary.com/dqjkemqw3/video/upload/v1774446216/1209_9_rodejh.mp4'
  },
  {
    id: 4, type: 'image', title: 'E-Sports Jersey Front',
    src: 'https://res.cloudinary.com/dqjkemqw3/image/upload/v1774446057/Screenshot_2025-05-23_224910_yxbcxz.png'
  },
  {
    id: 5, type: 'image', title: 'E-Sports Jersey Back',
    src: 'https://res.cloudinary.com/dqjkemqw3/image/upload/v1774446044/2_dqovim.png'
  },
  {
    id: 6, type: 'image', title: 'Nakheel Logo Design',
    src: 'https://res.cloudinary.com/dqjkemqw3/image/upload/v1774446092/%D9%86%D8%AE%D9%8A%D9%84_vjplfs.png'
  }
];

const PROFILE_IMG = "https://res.cloudinary.com/dqjkemqw3/image/upload/v1774463539/gemini-2.5-flash-image_make_the_eyes_with_your_creativity_i_want_in_my_eyes_a_reflection_of_a_timeline_-0_1_ujn6a0.jpg";

// ─── CSS injected globally ───────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #070707;
    --dark: #0d0d0d;
    --card: #111111;
    --border: #1f1f1f;
    --green: #16a34a;
    --green-light: #22c55e;
    --green-glow: rgba(22, 163, 74, 0.35);
    --white: #f5f5f5;
    --muted: #6b7280;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'Syne', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: var(--font-body);
    overflow-x: hidden;
    cursor: none;
  }

  /* Custom cursor */
  .cursor {
    position: fixed;
    top: 0; left: 0;
    width: 12px; height: 12px;
    background: var(--green-light);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.15s ease, opacity 0.2s;
    mix-blend-mode: exclusion;
  }
  .cursor-ring {
    position: fixed;
    top: 0; left: 0;
    width: 40px; height: 40px;
    border: 1.5px solid var(--green);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s;
    opacity: 0.6;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--dark); }
  ::-webkit-scrollbar-thumb { background: var(--green); border-radius: 2px; }

  /* Noise texture overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.025;
    pointer-events: none;
    z-index: 0;
  }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-green {
    0%, 100% { box-shadow: 0 0 0 0 var(--green-glow); }
    50%       { box-shadow: 0 0 28px 8px var(--green-glow); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes glitch {
    0%   { clip-path: inset(0 0 98% 0); transform: translate(-2px, 0); }
    10%  { clip-path: inset(50% 0 40% 0); transform: translate(2px, 0); }
    20%  { clip-path: inset(20% 0 70% 0); transform: translate(-2px, 0); }
    30%  { clip-path: inset(80% 0 5% 0); transform: translate(2px, 0); }
    40%  { clip-path: inset(0 0 90% 0); transform: translate(0, 0); }
    100% { clip-path: inset(0 0 98% 0); transform: translate(0, 0); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes scanline {
    0%   { top: -10%; }
    100% { top: 110%; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }

  .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-500 { animation-delay: 0.5s; }
  .delay-700 { animation-delay: 0.7s; }

  /* Hero glitch text */
  .glitch-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-size: clamp(100px, 20vw, 260px);
    color: var(--green);
    filter: blur(28px);
    opacity: 0.18;
    user-select: none;
    letter-spacing: -4px;
    line-height: 1;
  }

  /* Marquee */
  .marquee-track {
    display: flex;
    gap: 0;
    animation: marquee 18s linear infinite;
    white-space: nowrap;
  }

  /* Portfolio card */
  .port-card {
    break-inside: avoid;
    margin-bottom: 20px;
    border-radius: 12px;
    overflow: hidden;
    background: var(--card);
    border: 1px solid var(--border);
    position: relative;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.3s;
    cursor: pointer;
  }
  .port-card:hover {
    transform: scale(1.025) translateY(-4px);
    border-color: var(--green);
    box-shadow: 0 0 32px var(--green-glow), 0 20px 40px rgba(0,0,0,0.6);
  }
  .port-card .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s;
    display: flex;
    align-items: flex-end;
    padding: 20px;
  }
  .port-card:hover .card-overlay { opacity: 1; }

  /* Modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.92);
    backdrop-filter: blur(12px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeUp 0.25s ease both;
  }

  /* Contact link */
  .contact-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 28px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--card);
    color: var(--white);
    text-decoration: none;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 15px;
    transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s, background 0.25s;
  }
  .contact-link:hover {
    border-color: var(--green);
    background: rgba(22,163,74,0.08);
    box-shadow: 0 0 20px var(--green-glow);
    transform: translateY(-3px);
  }

  /* Section label */
  .section-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--green-light);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .section-label::before {
    content: '';
    display: block;
    width: 32px;
    height: 1px;
    background: var(--green);
  }

  /* Nav */
  .nav-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--green);
    animation: pulse-green 2s ease infinite;
  }

  /* Profile ring */
  .profile-ring {
    animation: spin-slow 12s linear infinite;
    position: absolute;
    inset: -12px;
    border-radius: 50%;
    border: 1.5px dashed rgba(22,163,74,0.4);
    pointer-events: none;
  }

  /* Scanline on profile */
  .scanline::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 3px;
    background: linear-gradient(to right, transparent, rgba(34,197,94,0.5), transparent);
    animation: scanline 3s linear infinite;
  }

  /* Float */
  .float-anim { animation: float 4s ease-in-out infinite; }

  /* Green tag */
  .green-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background: rgba(22,163,74,0.12);
    border: 1px solid rgba(22,163,74,0.3);
    border-radius: 100px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--green-light);
    letter-spacing: 0.1em;
  }

  /* Video element */
  video {
    display: block;
    width: 100%;
    background: #000;
  }

  /* Selection */
  ::selection { background: var(--green); color: #000; }
`;

export default function App() {
  const [modalItem, setModalItem] = useState(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const ringRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  // Inject styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Custom cursor
  useEffect(() => {
    const onMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);

    const animRing = () => {
      ringRef.current.x += (mousePos.x - ringRef.current.x) * 0.12;
      ringRef.current.y += (mousePos.y - ringRef.current.y) * 0.12;
      setRingPos({ ...ringRef.current });
      rafRef.current = requestAnimationFrame(animRing);
    };
    rafRef.current = requestAnimationFrame(animRing);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mousePos.x, mousePos.y]);

  const openModal = (item) => {
    if (item.type === "image") setModalItem(item);
  };

  return (
    <>
      {/* Custom cursor */}
      <div
        className="cursor"
        style={{ transform: `translate(${mousePos.x - 6}px, ${mousePos.y - 6}px)` }}
      />
      <div
        className="cursor-ring"
        style={{ transform: `translate(${ringPos.x - 20}px, ${ringPos.y - 20}px)` }}
      />

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "20px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: "rgba(7,7,7,0.8)",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="nav-dot" />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.12em", color: "var(--white)" }}>
            YACMD
          </span>
        </div>
        <div style={{ display: "flex", gap: 32, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase" }}>
          {["Work", "About", "Contact"].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "var(--green-light)"}
              onMouseLeave={e => e.target.style.color = "var(--muted)"}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="about" style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: 80,
      }}>
        {/* Glow bg blobs */}
        <div style={{
          position: "absolute", top: "20%", left: "10%",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "5%",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(22,163,74,0.07) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none",
        }} />

        {/* YACMD blur backdrop */}
        <div className="glitch-text" aria-hidden="true">YACMD</div>

        {/* Profile image */}
        <div className="animate-fade-up float-anim" style={{ position: "relative", marginBottom: 48, zIndex: 1 }}>
          <div className="profile-ring" />
          <div className="scanline" style={{
            width: 200, height: 200,
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid rgba(22,163,74,0.5)",
            boxShadow: "0 0 40px var(--green-glow), 0 0 80px rgba(22,163,74,0.15)",
            position: "relative",
          }}>
            <img
              src={PROFILE_IMG}
              alt="YACMD Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          {/* Live badge */}
          <div style={{
            position: "absolute", bottom: 8, right: 0,
            background: "var(--green)", borderRadius: 100,
            padding: "4px 10px",
            fontFamily: "var(--font-mono)", fontSize: 9,
            color: "#000", fontWeight: 700, letterSpacing: "0.15em",
          }}>OPEN</div>
        </div>

        {/* Headline */}
        <div style={{ textAlign: "center", zIndex: 1, padding: "0 20px" }}>
          <div className="green-tag animate-fade-up delay-100" style={{ marginBottom: 24, justifyContent: "center" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green-light)" }} />
            Video Editing & Graphic Design
          </div>

          <h1 className="animate-fade-up delay-200" style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(52px, 10vw, 120px)",
            lineHeight: 0.9,
            letterSpacing: "-1px",
            color: "var(--white)",
            marginBottom: 8,
          }}>
            Elevating
          </h1>
          <h1 className="animate-fade-up delay-300" style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(52px, 10vw, 120px)",
            lineHeight: 0.9,
            letterSpacing: "-1px",
            WebkitTextStroke: "1px var(--green)",
            color: "transparent",
            marginBottom: 32,
          }}>
            Digital Narrative.
          </h1>

          <p className="animate-fade-up delay-500" style={{
            maxWidth: 480, margin: "0 auto 40px",
            fontFamily: "var(--font-body)", fontSize: 16,
            color: "var(--muted)", lineHeight: 1.7, fontWeight: 400,
          }}>
            Crafting cinematic visuals and bold brand identities that stop the scroll and tell your story.
          </p>

          <a
            href="#work"
            className="animate-fade-up delay-700"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "14px 32px",
              background: "var(--green)",
              color: "#000", borderRadius: 6,
              fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14,
              textDecoration: "none", letterSpacing: "0.05em",
              transition: "box-shadow 0.3s, transform 0.3s",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 28px var(--green-glow)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            View Work <ChevronDown size={16} />
          </a>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted)",
          letterSpacing: "0.2em", textTransform: "uppercase",
          animation: "fadeUp 1s 1.2s both",
        }}>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, var(--green))" }} />
          Scroll
        </div>
      </section>

      {/* ── MARQUEE DIVIDER ── */}
      <div style={{
        overflow: "hidden",
        borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
        padding: "14px 0",
        background: "var(--dark)",
      }}>
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 0 }}>
              {["Video Editing", "⬡", "Graphic Design", "⬡", "Motion Graphics", "⬡", "Brand Identity", "⬡", "Reels", "⬡", "Cinematic", "⬡"].map((w, j) => (
                <span key={j} style={{
                  fontFamily: "var(--font-display)", fontSize: 13,
                  letterSpacing: "0.3em", color: j % 2 === 1 ? "var(--green)" : "var(--muted)",
                  padding: "0 28px", whiteSpace: "nowrap",
                }}>{w}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── PORTFOLIO GRID ── */}
      <section id="work" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="section-label">Selected Work</div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 72px)",
          marginBottom: 16, lineHeight: 1, letterSpacing: "0.02em",
        }}>
          THE PORTFOLIO
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 56, maxWidth: 480, lineHeight: 1.6 }}>
          A curated selection of edits, designs, and visual identities I've built for clients and creative projects.
        </p>

        {/* Masonry grid */}
        <div style={{
          columns: "1",
          columnGap: 20,
        }}
          className="port-masonry"
        >
          <style>{`
            @media (min-width: 640px) { .port-masonry { columns: 2 !important; } }
            @media (min-width: 1024px) { .port-masonry { columns: 3 !important; } }
          `}</style>

          {portfolioData.map((item) => (
            <div
              key={item.id}
              className="port-card"
              onClick={() => openModal(item)}
            >
              {item.type === "video" ? (
                <div style={{ position: "relative" }}>
                  <video
                    src={item.src}
                    poster={item.poster}
                    controls
                    playsInline
                    preload="metadata"
                    style={{
                      width: "100%",
                      maxHeight: 420,
                      objectFit: "contain",
                      background: "#000",
                      display: "block",
                    }}
                  />
                  {/* Play badge */}
                  <div style={{
                    position: "absolute", top: 12, right: 12,
                    background: "var(--green)", borderRadius: 4,
                    padding: "3px 8px",
                    fontFamily: "var(--font-mono)", fontSize: 9,
                    color: "#000", fontWeight: 700, letterSpacing: "0.1em",
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <Play size={8} fill="#000" /> VIDEO
                  </div>
                </div>
              ) : (
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      width: "100%",
                      display: "block",
                      objectFit: "contain",
                      background: "#0a0a0a",
                    }}
                  />
                  <div className="card-overlay">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <ExternalLink size={14} color="var(--green-light)" />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white)", letterSpacing: "0.12em" }}>
                        VIEW FULL
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Card footer */}
              <div style={{
                padding: "14px 18px",
                borderTop: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{
                  fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13,
                  color: "var(--white)", letterSpacing: "0.02em",
                }}>
                  {item.title}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 9,
                  color: item.type === "video" ? "var(--green-light)" : "var(--muted)",
                  textTransform: "uppercase", letterSpacing: "0.15em",
                }}>
                  {item.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{
        padding: "100px 40px",
        borderTop: "1px solid var(--border)",
        background: "var(--dark)",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Let's Connect</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(40px, 7vw, 80px)",
            marginBottom: 16, lineHeight: 0.95,
          }}>
            GOT A PROJECT?<br />
            <span style={{ WebkitTextStroke: "1px var(--green)", color: "transparent" }}>LET'S TALK.</span>
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 52, lineHeight: 1.6 }}>
            Available for freelance projects, brand collaborations, and creative direction.
          </p>

          <div style={{
            display: "flex", flexWrap: "wrap",
            gap: 16, justifyContent: "center",
          }}>
            <a href="mailto:yassineworld48@gmail.com" className="contact-link">
              <Mail size={18} color="var(--green-light)" />
              yassineworld48@gmail.com
            </a>
            <a href="https://wa.me/212640161819" target="_blank" rel="noopener noreferrer" className="contact-link">
              <MessageCircle size={18} color="var(--green-light)" />
              WhatsApp
            </a>
            <a href="https://www.instagram.com/yacmd_motion" target="_blank" rel="noopener noreferrer" className="contact-link">
              <Instagram size={18} color="var(--green-light)" />
              @yacmd_motion
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "28px 40px",
        borderTop: "1px solid var(--border)",
        display: "flex", flexWrap: "wrap",
        alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--white)", letterSpacing: "0.1em" }}>
          YACMD
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.15em" }}>
          © {new Date().getFullYear()} — VIDEO EDITING & GRAPHIC DESIGN
        </span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div className="nav-dot" style={{ width: 5, height: 5 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--green-light)", letterSpacing: "0.12em" }}>
            AVAILABLE FOR WORK
          </span>
        </div>
      </footer>

      {/* ── IMAGE MODAL ── */}
      {modalItem && (
        <div
          className="modal-backdrop"
          onClick={() => setModalItem(null)}
        >
          <button
            onClick={() => setModalItem(null)}
            style={{
              position: "absolute", top: 24, right: 24,
              background: "rgba(255,255,255,0.08)", border: "1px solid var(--border)",
              borderRadius: "50%", width: 44, height: 44,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "none", color: "var(--white)",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(22,163,74,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          >
            <X size={18} />
          </button>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "90vw", maxHeight: "90vh",
              borderRadius: 12, overflow: "hidden",
              border: "1px solid var(--green)",
              boxShadow: "0 0 60px var(--green-glow)",
            }}
          >
            <img
              src={modalItem.src}
              alt={modalItem.title}
              style={{ display: "block", maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
            />
          </div>
          <div style={{
            position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
            fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)",
            letterSpacing: "0.2em", textTransform: "uppercase",
          }}>
            {modalItem.title}
          </div>
        </div>
      )}
    </>
  );
}
