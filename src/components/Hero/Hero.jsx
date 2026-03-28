import { useEffect, useRef } from "react";
import { useAppContext } from "../../Context/AppContext.jsx";
import "./Hero.css";

export default function Hero() {
  const { hero } = useAppContext();
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  const h = hero || {};
  const backgroundMode = h.backgroundMode === "image" ? "image" : "youtube";
  const backgroundImageUrl = (h.backgroundImageUrl || "").trim();
  const youtubeVideoId = (h.youtubeVideoId || "EZMYvAWbyLo").trim();
  const embedSrc = youtubeVideoId
    ? `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=0&modestbranding=1&rel=0&playsinline=1`
    : "";

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    let W,
      H,
      pts = [],
      raf;

    const resize = () => {
      W = canvas.width = wrap.offsetWidth;
      H = canvas.height = wrap.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 80; i++) {
      pts.push({
        x: Math.random() * 2000,
        y: Math.random() * 900,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.8 + 0.4,
        a: Math.random() * 0.7 + 0.1,
        c: Math.random() < 0.6 ? "255,34,51" : "255,255,255",
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const defaultStats = [
    { main: "4.2", inner: "M", label: "Active Players" },
    { main: "$", inner: "2.8M", label: "Prize Pool" },
    { main: "340", inner: "+", label: "Tournaments" },
    { main: "18", inner: "+", label: "Game Titles" },
  ];
  const stats =
    Array.isArray(h.stats) && h.stats.length ? h.stats : defaultStats;

  return (
    <section id="hero" ref={wrapRef}>
      <div className="hero-video-bg">
        {backgroundMode === "image" && backgroundImageUrl ? (
          <div
            className="hero-image-bg"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            role="img"
            aria-hidden
          />
        ) : embedSrc ? (
          <iframe
            key={youtubeVideoId}
            title="Hero background video"
            src={embedSrc}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : null}
        <div className="video-overlay"></div>
      </div>

      <canvas ref={canvasRef} className="hero-particles" aria-hidden />

      <div className="hero-overlay"></div>
      <div className="scanlines"></div>

      <div className="hero-content">
        <h1 className="hero-title">
          <span className="glitch" data-text={h.titleGlitch || "DOMINATE"}>
            {h.titleGlitch || "DOMINATE"}
          </span>
          <br />
          {h.titlePrefix || "THE "}
          <span className="accent">{h.titleAccent || "ARENA"}</span>
        </h1>
        <p className="hero-sub">
          {h.subtitle ||
            "Elite competitive gaming. Forge your legacy. Rise through the ranks and claim glory in the world's most intense tournaments."}
        </p>
      </div>

      <div className="hero-stats">
        {stats.flatMap((s, i) => {
          const item = (
            <div className="stat-item" key={`stat-${i}`}>
              <div className="stat-num">
                {s.main}
                <span>{s.inner}</span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          );
          if (i === 0) return [item];
          return [
            <div className="divider" key={`div-${i}`} />,
            item,
          ];
        })}
      </div>

      <div className="scroll-ind">
        <div className="scroll-line"></div>
        Scroll1
      </div>
    </section>
  );
}
