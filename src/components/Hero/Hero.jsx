import { useEffect, useRef } from "react";
import "./Hero.css";

export default function Hero() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

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

  return (
    <section id="hero">
      {/* YouTube video background */}
      <div className="hero-video-bg">
        <iframe
          src="https://www.youtube.com/watch?v=s3pDMUWlA6I"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Hero Background"
        />
      </div>

      <div className="hero-bg">
        <div className="hero-bg-grid"></div>
        <div className="hero-bg-glow g1"></div>
        <div className="hero-bg-glow g2"></div>
        <div className="hero-bg-glow g3"></div>
        <div className="hero-particles" ref={wrapRef}>
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>

      <div className="hero-overlay"></div>
      <div className="scanlines"></div>

      <div className="hero-content">
        {/* <div className="hero-badge">Season 6 · Now Live</div> */}
        <h1 className="hero-title">
          <span className="glitch" data-text="DOMINATE">
            DOMINATE
          </span>
          <br />
          THE <span className="accent">ARENA</span>
        </h1>
        <p className="hero-sub">
          Elite competitive gaming. Forge your legacy. Rise through the ranks
          and claim glory in the world's most intense tournaments.
        </p>
        {/* <div className="hero-buttons">
          <a href="#games" className="btn-primary">
            Enter the Arena
          </a>
          <a href="#tournaments" className="btn-ghost">
            View Tournaments
          </a>
        </div> */}
      </div>

      <div className="hero-stats">
        <div className="stat-item">
          <div className="stat-num">
            4.2<span>M</span>
          </div>
          <div className="stat-label">Active Players</div>
        </div>
        <div className="divider"></div>
        <div className="stat-item">
          <div className="stat-num">
            $<span>2.8M</span>
          </div>
          <div className="stat-label">Prize Pool</div>
        </div>
        <div className="divider"></div>
        <div className="stat-item">
          <div className="stat-num">
            340<span>+</span>
          </div>
          <div className="stat-label">Tournaments</div>
        </div>
        <div className="divider"></div>
        <div className="stat-item">
          <div className="stat-num">
            18<span>+</span>
          </div>
          <div className="stat-label">Game Titles</div>
        </div>
      </div>

      <div className="scroll-ind">
        <div className="scroll-line"></div>
        Scroll
      </div>
    </section>
  );
}
