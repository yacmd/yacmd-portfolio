import { useState, useEffect, useRef } from "react";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Settings, X, ChevronLeft, ChevronRight,
  Mail, MessageCircle, Instagram, Clapperboard, Palette, ZoomIn
} from "lucide-react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const portfolioData = [
  { id: 1, category: "video",  title: "Instagram Reels Style",  src: "https://res.cloudinary.com/dqjkemqw3/video/upload/v1774445704/0128_1_avwt1j.mp4",   poster: "https://res.cloudinary.com/dqjkemqw3/image/upload/v1774462819/ChatGPT_Image_9_mars_2026_21_09_29_ny7j8f.png" },
  { id: 2, category: "video",  title: "Cinematic Storytelling", src: "https://res.cloudinary.com/dqjkemqw3/video/upload/v1774446013/0131_4_lvohdb.mp4",   poster: "https://res.cloudinary.com/dqjkemqw3/image/upload/v1774462754/ChatGPT_Image_9_mars_2026_22_09_50_b51bbk.png" },
  { id: 3, category: "video",  title: "Desert Vibes Edit",      src: "https://res.cloudinary.com/dqjkemqw3/video/upload/v1774446216/1209_9_rodejh.mp4",   poster: "https://res.cloudinary.com/dqjkemqw3/image/upload/v1774446088/WhatsApp_Image_2025-06-22_at_14.27.13_3a0d7429_zaavnf.jpg" },
  { id: 4, category: "design", title: "E-Sports Jersey Front",  src: "https://res.cloudinary.com/dqjkemqw3/image/upload/v1774446057/Screenshot_2025-05-23_224910_yxbcxz.png" },
  { id: 5, category: "design", title: "E-Sports Jersey Back",   src: "https://res.cloudinary.com/dqjkemqw3/image/upload/v1774446042/1_iodwws.png" },
  { id: 6, category: "design", title: "Jersey Design Variant",  src: "https://res.cloudinary.com/dqjkemqw3/image/upload/v1774446044/2_dqovim.png" },
  { id: 7, category: "design", title: "Nakheel Logo Design",    src: "https://res.cloudinary.com/dqjkemqw3/image/upload/v1774446092/%D9%86%D8%AE%D9%8A%D9%84_vjplfs.png" },
];

const PROFILE_IMG =
  "https://res.cloudinary.com/dqjkemqw3/image/upload/v1774463539/gemini-2.5-flash-image_make_the_eyes_with_your_creativity_i_want_in_my_eyes_a_reflection_of_a_timeline_-0_1_ujn6a0.jpg";

const QUALITIES = ["4K", "1080p", "720p", "480p"];

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=JetBrains+Mono:wght@400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --black:#060606;--surface:#0d0d0d;--card:#111;--card2:#171717;
  --border:#1e1e1e;--border2:#2a2a2a;
  --green:#16a34a;--ghi:#22c55e;--gxhi:#4ade80;
  --gglow:rgba(22,163,74,.3);--gglow2:rgba(22,163,74,.12);
  --white:#f0f0f0;--white2:#999;--muted:#484848;
  --fd:'Bebas Neue',sans-serif;--fb:'DM Sans',sans-serif;--fm:'JetBrains Mono',monospace;
  --r:10px;--tr:.3s cubic-bezier(.4,0,.2,1);
}
html{scroll-behavior:smooth}
body{background:var(--black);color:var(--white);font-family:var(--fb);overflow-x:hidden;cursor:none}
::selection{background:var(--green);color:#000}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--surface)}
::-webkit-scrollbar-thumb{background:var(--green);border-radius:2px}

/* noise overlay */
body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:1;opacity:.022;
  background:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* cursor */
.ycur{position:fixed;pointer-events:none;z-index:9999;width:10px;height:10px;border-radius:50%;background:var(--ghi);top:0;left:0;mix-blend-mode:exclusion}
.yring{position:fixed;pointer-events:none;z-index:9998;width:38px;height:38px;border-radius:50%;border:1.5px solid rgba(34,197,94,.5);top:0;left:0}

/* keyframes */
@keyframes fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-11px)}}
@keyframes pulseglow{0%,100%{box-shadow:0 0 0 0 var(--gglow)}50%{box-shadow:0 0 24px 6px var(--gglow)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes scanline{0%{top:-8%}100%{top:108%}}
@keyframes scaleIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
@keyframes tabIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes progressPing{0%{opacity:.7;transform:translateY(-50%) scale(1)}100%{opacity:0;transform:translateY(-50%) scale(2.4)}}

.au{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) both}
.ai{animation:fadeIn .4s ease both}
.as{animation:scaleIn .3s cubic-bezier(.16,1,.3,1) both}
.ati{animation:tabIn .38s cubic-bezier(.16,1,.3,1) both}
.af{animation:float 4.5s ease-in-out infinite}
.asp{animation:spin 14s linear infinite}
.apg{animation:pulseglow 2.2s ease infinite}
.d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}
.d4{animation-delay:.45s}.d5{animation-delay:.6s}.d6{animation-delay:.85s}

/* layout */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:18px 48px;background:rgba(6,6,6,.84);backdrop-filter:blur(24px);border-bottom:1px solid var(--border)}
@media(max-width:600px){.nav{padding:14px 20px}}
.nav-logo{font-family:var(--fd);font-size:22px;letter-spacing:.15em}
.nav-links{display:flex;gap:28px;font-family:var(--fm);font-size:10px;letter-spacing:.22em;text-transform:uppercase}
.nav-link{color:var(--muted);text-decoration:none;transition:color var(--tr)}
.nav-link:hover{color:var(--ghi)}
.nav-dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulseglow 2s ease infinite}

/* hero */
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;padding-top:80px}
.hero-glow{position:absolute;border-radius:50%;pointer-events:none;filter:blur(80px)}
.hero-yacmd{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-size:clamp(90px,18vw,250px);color:var(--green);filter:blur(34px);opacity:.13;user-select:none;pointer-events:none;letter-spacing:-.04em}
.avatar-wrap{position:relative;margin-bottom:44px;z-index:2}
.avatar{width:190px;height:190px;border-radius:50%;overflow:hidden;position:relative;border:2px solid rgba(34,197,94,.45);box-shadow:0 0 52px var(--gglow),0 0 100px rgba(22,163,74,.1)}
.avatar img{width:100%;height:100%;object-fit:cover;display:block}
.avatar::after{content:'';position:absolute;left:0;right:0;height:2px;background:linear-gradient(to right,transparent,rgba(34,197,94,.55),transparent);animation:scanline 3.2s linear infinite;pointer-events:none}
.avatar-ring{position:absolute;inset:-15px;border-radius:50%;border:1.5px dashed rgba(34,197,94,.33);pointer-events:none}
.avatar-badge{position:absolute;bottom:8px;right:-6px;background:var(--green);border-radius:100px;padding:3px 10px;font-family:var(--fm);font-size:8px;color:#000;font-weight:600;letter-spacing:.15em}
.hero-tag{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:100px;margin-bottom:22px;background:rgba(22,163,74,.1);border:1px solid rgba(22,163,74,.28);font-family:var(--fm);font-size:10px;color:var(--ghi);letter-spacing:.12em}
.h1{font-family:var(--fd);line-height:.92;font-size:clamp(58px,11vw,132px);color:var(--white);text-align:center}
.h1o{font-family:var(--fd);line-height:.92;font-size:clamp(58px,11vw,132px);text-align:center;-webkit-text-stroke:1.5px var(--green);color:transparent}
.hero-sub{max-width:460px;text-align:center;margin:26px auto 38px;font-size:15px;color:var(--white2);line-height:1.72;font-weight:300}
.cta{display:inline-flex;align-items:center;gap:10px;padding:13px 32px;border-radius:6px;background:var(--green);color:#000;font-family:var(--fb);font-weight:700;font-size:14px;text-decoration:none;letter-spacing:.04em;transition:box-shadow var(--tr),transform var(--tr)}
.cta:hover{box-shadow:0 0 36px var(--gglow);transform:translateY(-2px)}

/* marquee */
.mq-wrap{overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:13px 0;background:var(--surface)}
.mq-track{display:flex;animation:marquee 22s linear infinite;white-space:nowrap}
.mq-item{font-family:var(--fd);font-size:12px;letter-spacing:.3em;padding:0 24px}

/* work section */
.work{padding:96px 48px;max-width:1300px;margin:0 auto}
@media(max-width:600px){.work{padding:64px 20px}}
.eyebrow{display:flex;align-items:center;gap:10px;font-family:var(--fm);font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--ghi);margin-bottom:14px}
.eyebrow::before{content:'';display:block;width:28px;height:1px;background:var(--green)}
.work-title{font-family:var(--fd);font-size:clamp(40px,6vw,78px);line-height:.95;margin-bottom:44px}

/* tab switcher */
.tabs{display:inline-flex;padding:5px;border-radius:var(--r);background:var(--card);border:1px solid var(--border);margin-bottom:52px;position:relative;overflow:hidden}
.tab-btn{position:relative;z-index:1;padding:11px 28px;border-radius:7px;border:none;background:transparent;cursor:none;font-family:var(--fm);font-size:11px;letter-spacing:.16em;text-transform:uppercase;display:flex;align-items:center;gap:8px;transition:color var(--tr);white-space:nowrap}
.tab-btn.active{color:#000}
.tab-btn.inactive{color:var(--muted)}
.tab-btn.inactive:hover{color:var(--white2)}
.tab-pill{position:absolute;top:5px;height:calc(100% - 10px);border-radius:7px;background:var(--green);box-shadow:0 0 20px var(--gglow);transition:left .36s cubic-bezier(.16,1,.3,1),width .36s cubic-bezier(.16,1,.3,1);pointer-events:none}

/* video grid */
.vgrid{display:grid;gap:24px;grid-template-columns:repeat(auto-fill,minmax(320px,1fr))}
@media(max-width:700px){.vgrid{grid-template-columns:1fr}}

/* video player */
.vp{border-radius:var(--r);overflow:hidden;background:#000;border:1px solid var(--border);position:relative;transition:border-color var(--tr),box-shadow var(--tr)}
.vp:hover{border-color:var(--green);box-shadow:0 0 30px var(--gglow)}
.vp video{display:block;width:100%;object-fit:contain;background:#000;max-height:400px}
.vp-ctrls{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,.93) 0%,transparent 100%);padding:26px 14px 12px;opacity:0;transition:opacity .25s}
.vp:hover .vp-ctrls,.vp.paused .vp-ctrls{opacity:1}
.vp-bar{width:100%;height:4px;border-radius:2px;background:rgba(255,255,255,.18);position:relative;margin-bottom:10px;cursor:none}
.vp-fill{height:100%;border-radius:2px;background:var(--green);position:relative;pointer-events:none}
.vp-thumb{position:absolute;right:-6px;top:50%;transform:translateY(-50%);width:12px;height:12px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--gglow);opacity:0;transition:opacity .2s}
.vp-bar:hover .vp-thumb{opacity:1}
.vp-ping{position:absolute;right:-6px;top:50%;transform:translateY(-50%);width:12px;height:12px;border-radius:50%;background:var(--green);animation:progressPing 1.3s ease infinite;pointer-events:none}
.vp-row{display:flex;align-items:center;gap:10px}
.vbtn{background:transparent;border:none;cursor:none;padding:5px;color:var(--white);display:flex;align-items:center;justify-content:center;border-radius:4px;transition:color .2s,background .2s;flex-shrink:0}
.vbtn:hover{color:var(--ghi);background:rgba(34,197,94,.1)}
.vtime{font-family:var(--fm);font-size:10px;color:var(--white2);white-space:nowrap;letter-spacing:.05em}
.vtitle{flex:1;font-family:var(--fm);font-size:10px;color:var(--white2);text-overflow:ellipsis;overflow:hidden;white-space:nowrap;letter-spacing:.08em;text-align:center}
.vol-input{-webkit-appearance:none;width:68px;height:3px;border-radius:2px;outline:none;cursor:none}
.vol-input::-webkit-slider-thumb{-webkit-appearance:none;width:10px;height:10px;border-radius:50%;background:var(--ghi);cursor:none}
.qmenu{position:absolute;bottom:54px;right:14px;background:rgba(12,12,12,.97);border:1px solid var(--border2);border-radius:8px;padding:6px;min-width:112px;backdrop-filter:blur(16px);box-shadow:0 8px 32px rgba(0,0,0,.85);animation:scaleIn .2s ease both;transform-origin:bottom right;z-index:10}
.qmenu-hd{padding:5px 12px 7px;font-family:var(--fm);font-size:9px;color:var(--muted);letter-spacing:.22em;text-transform:uppercase;border-bottom:1px solid var(--border)}
.qitem{display:flex;align-items:center;justify-content:space-between;padding:7px 12px;border-radius:5px;cursor:none;font-family:var(--fm);font-size:11px;color:var(--white2);transition:background .15s,color .15s}
.qitem:hover{background:rgba(22,163,74,.15);color:var(--ghi)}
.qitem.qs{color:var(--ghi)}
.qbadge{font-size:8px;padding:1px 5px;border-radius:3px;background:rgba(22,163,74,.22);color:var(--ghi);font-weight:600;letter-spacing:.1em}
.qcheck{width:6px;height:6px;border-radius:50%;background:var(--ghi)}

/* design grid (masonry) */
.dgrid{columns:1;column-gap:20px}
@media(min-width:580px){.dgrid{columns:2}}
@media(min-width:960px){.dgrid{columns:3}}
.dcard{break-inside:avoid;margin-bottom:20px;border-radius:var(--r);overflow:hidden;background:var(--card);border:1px solid var(--border);position:relative;cursor:none;transition:transform .4s cubic-bezier(.16,1,.3,1),border-color .3s,box-shadow .3s}
.dcard:hover{transform:scale(1.024) translateY(-4px);border-color:var(--green);box-shadow:0 0 36px var(--gglow),0 20px 48px rgba(0,0,0,.6)}
.dcard img{width:100%;display:block;object-fit:contain;background:#0a0a0a}
.dcard-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.88) 0%,transparent 55%);opacity:0;transition:opacity .28s;display:flex;align-items:flex-end;padding:18px}
.dcard:hover .dcard-ov{opacity:1}
.dcard-ft{padding:11px 15px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}

/* lightbox */
.lb{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.94);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;animation:fadeIn .22s ease both}
.lb-img{max-width:92vw;max-height:90vh;object-fit:contain;display:block;border-radius:8px;border:1px solid var(--green);box-shadow:0 0 60px var(--gglow);animation:scaleIn .3s cubic-bezier(.16,1,.3,1) both}
.lb-close{position:absolute;top:20px;right:20px;background:rgba(255,255,255,.07);border:1px solid var(--border2);border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:none;color:var(--white);transition:background .2s,border-color .2s}
.lb-close:hover{background:rgba(22,163,74,.2);border-color:var(--green)}
.lb-nav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.07);border:1px solid var(--border2);border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;cursor:none;color:var(--white);transition:background .2s,border-color .2s}
.lb-nav:hover{background:rgba(22,163,74,.2);border-color:var(--green)}
.lb-cap{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);font-family:var(--fm);font-size:11px;color:var(--white2);letter-spacing:.18em;text-transform:uppercase;background:rgba(0,0,0,.6);padding:6px 16px;border-radius:100px;white-space:nowrap}

/* contact */
.contact{padding:96px 48px;border-top:1px solid var(--border);background:var(--surface)}
@media(max-width:600px){.contact{padding:64px 20px}}
.contact-inner{max-width:680px;margin:0 auto;text-align:center}
.contact-h2{font-family:var(--fd);font-size:clamp(46px,7.5vw,90px);line-height:.92;margin-bottom:14px}
.clinks{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:48px}
.clink{display:flex;align-items:center;gap:11px;padding:16px 26px;border:1px solid var(--border2);border-radius:8px;background:var(--card);color:var(--white);text-decoration:none;font-family:var(--fb);font-weight:600;font-size:14px;transition:border-color var(--tr),box-shadow var(--tr),transform var(--tr),background var(--tr)}
.clink:hover{border-color:var(--green);background:rgba(22,163,74,.07);box-shadow:0 0 24px var(--gglow);transform:translateY(-3px)}

/* footer */
.footer{padding:26px 48px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
@media(max-width:600px){.footer{padding:20px}}
.flogo{font-family:var(--fd);font-size:20px;letter-spacing:.15em}
.fcopy{font-family:var(--fm);font-size:9px;color:var(--muted);letter-spacing:.18em}
.fstatus{display:flex;align-items:center;gap:7px;font-family:var(--fm);font-size:9px;color:var(--ghi);letter-spacing:.14em}
`;

/* ─────────────────────────────────────────────
   UTILS
───────────────────────────────────────────── */
function fmt(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/* ─────────────────────────────────────────────
   CUSTOM VIDEO PLAYER
───────────────────────────────────────────── */
function VideoPlayer({ item }) {
  const vRef = useRef(null);
  const barRef = useRef(null);
  const wrapRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dur, setDur] = useState(0);
  const [cur, setCur] = useState(0);
  const [muted, setMuted] = useState(false);
  const [vol, setVol] = useState(1);
  const [fs, setFs] = useState(false);
  const [showQ, setShowQ] = useState(false);
  const [quality, setQuality] = useState("1080p");

  const toggle = () => {
    if (!vRef.current) return;
    playing ? vRef.current.pause() : vRef.current.play();
    setPlaying(p => !p);
  };

  useEffect(() => {
    const v = vRef.current;
    if (!v) return;
    const onTime = () => { setCur(v.currentTime); setProgress((v.currentTime / v.duration) * 100 || 0); };
    const onMeta = () => setDur(v.duration);
    const onEnd  = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", onEnd);
    return () => { v.removeEventListener("timeupdate", onTime); v.removeEventListener("loadedmetadata", onMeta); v.removeEventListener("ended", onEnd); };
  }, []);

  const seek = (e) => {
    const rect = barRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    vRef.current.currentTime = ratio * dur;
    setProgress(ratio * 100);
  };

  const toggleFs = () => {
    if (!document.fullscreenElement) { wrapRef.current?.requestFullscreen(); setFs(true); }
    else { document.exitFullscreen(); setFs(false); }
  };

  const onVol = (e) => {
    const v = parseFloat(e.target.value);
    vRef.current.volume = v; setVol(v); setMuted(v === 0);
  };

  const toggleMute = () => { vRef.current.muted = !muted; setMuted(m => !m); };

  const volPct = muted ? 0 : vol * 100;

  return (
    <div ref={wrapRef} className={`vp${!playing ? " paused" : ""}`}>
      <video ref={vRef} src={item.src} poster={item.poster} playsInline preload="metadata"
        style={{ cursor: "none" }} onClick={toggle} className="vp-video" />

      <div className="vp-ctrls">
        {/* progress bar */}
        <div ref={barRef} className="vp-bar" onClick={seek}>
          <div className="vp-fill" style={{ width: `${progress}%` }}>
            <div className="vp-thumb" />
            {playing && <div className="vp-ping" />}
          </div>
        </div>

        {/* bottom row */}
        <div className="vp-row">
          <button className="vbtn" onClick={toggle}>
            {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
          <button className="vbtn" onClick={toggleMute}>
            {muted || vol === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <input type="range" min="0" max="1" step="0.02" value={muted ? 0 : vol}
            onChange={onVol} className="vol-input"
            style={{ background: `linear-gradient(to right,var(--green) ${volPct}%,rgba(255,255,255,.18) ${volPct}%)` }} />
          <span className="vtime">{fmt(cur)} / {fmt(dur)}</span>
          <span className="vtitle">{item.title}</span>

          {/* quality */}
          <div style={{ position: "relative" }}>
            <button className="vbtn" onClick={() => setShowQ(q => !q)}>
              <Settings size={15} style={{ transition: "transform .3s", transform: showQ ? "rotate(90deg)" : "none" }} />
            </button>
            {showQ && (
              <div className="qmenu">
                <div className="qmenu-hd">Quality</div>
                {QUALITIES.map(q => (
                  <div key={q} className={`qitem${quality === q ? " qs" : ""}`}
                    onClick={() => { setQuality(q); setShowQ(false); }}>
                    {q}
                    {q === "1080p" && <span className="qbadge">AUTO</span>}
                    {quality === q && <span className="qcheck" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="vbtn" onClick={toggleFs}>
            {fs ? <Minimize size={15} /> : <Maximize size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LIGHTBOX
───────────────────────────────────────────── */
function Lightbox({ items, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx(i => (i - 1 + items.length) % items.length);
  const next = () => setIdx(i => (i + 1) % items.length);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  });

  return (
    <div className="lb" onClick={onClose}>
      <button className="lb-close" onClick={onClose}><X size={18} /></button>
      <button className="lb-nav" style={{ left: 20 }} onClick={e => { e.stopPropagation(); prev(); }}><ChevronLeft size={20} /></button>
      <img key={idx} src={items[idx].src} alt={items[idx].title} className="lb-img" onClick={e => e.stopPropagation()} />
      <button className="lb-nav" style={{ right: 20 }} onClick={e => { e.stopPropagation(); next(); }}><ChevronRight size={20} /></button>
      <div className="lb-cap">{items[idx].title} &mdash; {idx + 1} / {items.length}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB SWITCHER
───────────────────────────────────────────── */
const TABS = [
  { id: "video",  label: "Motion & Editing", Icon: Clapperboard },
  { id: "design", label: "Graphic Design",   Icon: Palette },
];

function TabBar({ active, onChange }) {
  const btnRefs = useRef([]);
  const [pill, setPill] = useState({ left: 5, width: 0 });

  useEffect(() => {
    const i = TABS.findIndex(t => t.id === active);
    const el = btnRefs.current[i];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

  return (
    <div className="tabs">
      <div className="tab-pill" style={{ left: pill.left, width: pill.width }} />
      {TABS.map((t, i) => (
        <button key={t.id} ref={el => btnRefs.current[i] = el}
          className={`tab-btn ${active === t.id ? "active" : "inactive"}`}
          onClick={() => onChange(t.id)}>
          <t.Icon size={13} />
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   APP
───────────────────────────────────────────── */
export default function App() {
  const [tab, setTab]       = useState("video");
  const [gridKey, setKey]   = useState(0);
  const [lb, setLb]         = useState(null);   // { items, index }
  const [dot, setDot]       = useState({ x: -99, y: -99 });
  const [ring, setRing]     = useState({ x: -99, y: -99 });
  const ringRef             = useRef({ x: -99, y: -99 });
  const rafRef              = useRef(null);
  const latestDot           = useRef({ x: -99, y: -99 });

  /* CSS injection */
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  /* Cursor */
  useEffect(() => {
    const onMove = (e) => { latestDot.current = { x: e.clientX, y: e.clientY }; setDot({ x: e.clientX, y: e.clientY }); };
    window.addEventListener("mousemove", onMove);
    const anim = () => {
      ringRef.current.x += (latestDot.current.x - ringRef.current.x) * 0.11;
      ringRef.current.y += (latestDot.current.y - ringRef.current.y) * 0.11;
      setRing({ x: ringRef.current.x, y: ringRef.current.y });
      rafRef.current = requestAnimationFrame(anim);
    };
    rafRef.current = requestAnimationFrame(anim);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  const switchTab = (t) => { setTab(t); setKey(k => k + 1); };

  const videos  = portfolioData.filter(d => d.category === "video");
  const designs = portfolioData.filter(d => d.category === "design");

  return (
    <>
      {/* Cursor */}
      <div className="ycur" style={{ transform: `translate(${dot.x - 5}px,${dot.y - 5}px)` }} />
      <div className="yring" style={{ transform: `translate(${ring.x - 19}px,${ring.y - 19}px)` }} />

      {/* ── NAV ── */}
      <nav className="nav">
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div className="nav-dot" />
          <span className="nav-logo">YACMD</span>
        </div>
        <div className="nav-links">
          {["Work", "About", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="about" className="hero">
        <div className="hero-glow" style={{ top:"14%", left:"7%", width:560, height:560, background:"radial-gradient(circle,rgba(22,163,74,.1) 0%,transparent 70%)" }} />
        <div className="hero-glow" style={{ bottom:"8%",  right:"5%", width:400, height:400, background:"radial-gradient(circle,rgba(22,163,74,.06) 0%,transparent 70%)" }} />
        <div className="hero-yacmd" aria-hidden="true">YACMD</div>

        {/* Avatar */}
        <div className="avatar-wrap au af">
          <div className="avatar-ring asp" />
          <div className="avatar">
            <img src={PROFILE_IMG} alt="YACMD Profile" />
          </div>
          <div className="avatar-badge">OPEN</div>
        </div>

        {/* Copy */}
        <div style={{ textAlign: "center", zIndex: 2, padding: "0 24px" }}>
          <div className="hero-tag au d1">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ghi)" }} />
            Video Editing & Graphic Design
          </div>
          <div className="h1 au d2">Elevating</div>
          <div className="h1o au d3">Digital Narrative.</div>
          <p className="hero-sub au d4">Cinematic edits and bold brand identities — crafted for brands that refuse to blend in.</p>
          <a href="#work" className="cta au d5">
            View Work
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </a>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, animation:"fadeUp 1s .9s both" }}>
          <div style={{ width:1, height:44, background:"linear-gradient(to bottom,transparent,var(--green))" }} />
          <span style={{ fontFamily:"var(--fm)", fontSize:8, color:"var(--muted)", letterSpacing:".22em", textTransform:"uppercase" }}>Scroll</span>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="mq-wrap">
        <div className="mq-track">
          {[...Array(2)].map((_, i) => (
            <span key={i} style={{ display: "flex" }}>
              {["Motion Graphics","◆","Video Editing","◆","Brand Identity","◆","Reels","◆","Cinematic","◆","E-Sports","◆","Logo Design","◆"].map((w, j) => (
                <span key={j} className="mq-item" style={{ color: j % 2 === 1 ? "var(--green)" : "var(--muted)" }}>{w}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── WORK ── */}
      <section id="work" className="work">
        <div className="eyebrow">Selected Work</div>
        <div className="work-title">
          THE&nbsp;<span style={{ WebkitTextStroke: "1.5px var(--green)", color: "transparent" }}>PORTFOLIO</span>
        </div>

        <TabBar active={tab} onChange={switchTab} />

        {/* VIDEO TAB */}
        {tab === "video" && (
          <div key={`v${gridKey}`} className="vgrid">
            {videos.map((item, i) => (
              <div key={item.id} className="ati" style={{ animationDelay: `${i * 0.1}s` }}>
                <VideoPlayer item={item} />
                <div style={{ padding: "11px 4px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--fb)", fontWeight: 600, fontSize: 13, color: "var(--white)" }}>{item.title}</span>
                  <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--ghi)", letterSpacing: ".15em", textTransform: "uppercase" }}>VIDEO</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DESIGN TAB */}
        {tab === "design" && (
          <div key={`d${gridKey}`} className="dgrid">
            {designs.map((item, i) => (
              <div key={item.id} className="dcard ati" style={{ animationDelay: `${i * 0.08}s` }}
                onClick={() => setLb({ items: designs, index: i })}>
                <img src={item.src} alt={item.title} loading="lazy" />
                <div className="dcard-ov">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ZoomIn size={14} color="var(--ghi)" />
                    <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--white)", letterSpacing: ".14em" }}>VIEW FULL</span>
                  </div>
                </div>
                <div className="dcard-ft">
                  <span style={{ fontFamily: "var(--fb)", fontWeight: 600, fontSize: 12, color: "var(--white)" }}>{item.title}</span>
                  <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--muted)", letterSpacing: ".14em", textTransform: "uppercase" }}>Design</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="contact">
        <div className="contact-inner">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Let's Connect</div>
          <div className="contact-h2">
            GOT A<br />
            <span style={{ WebkitTextStroke: "1.5px var(--green)", color: "transparent" }}>PROJECT?</span>
          </div>
          <p style={{ color: "var(--white2)", fontSize: 15, lineHeight: 1.72, fontWeight: 300, marginTop: 16 }}>
            Available for freelance, brand collaborations, and creative direction.
          </p>
          <div className="clinks">
            <a href="mailto:yassineworld48@gmail.com" className="clink">
              <Mail size={17} color="var(--ghi)" /> yassineworld48@gmail.com
            </a>
            <a href="https://wa.me/212640161819" target="_blank" rel="noopener noreferrer" className="clink">
              <MessageCircle size={17} color="var(--ghi)" /> WhatsApp
            </a>
            <a href="https://www.instagram.com/yacmd_motion" target="_blank" rel="noopener noreferrer" className="clink">
              <Instagram size={17} color="var(--ghi)" /> @yacmd_motion
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span className="flogo">YACMD</span>
        <span className="fcopy">© {new Date().getFullYear()} — VIDEO EDITING & GRAPHIC DESIGN</span>
        <div className="fstatus">
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)", animation: "pulseglow 2s ease infinite" }} />
          Available for work
        </div>
      </footer>

      {/* ── LIGHTBOX ── */}
      {lb && <Lightbox items={lb.items} startIndex={lb.index} onClose={() => setLb(null)} />}
    </>
  );
}
