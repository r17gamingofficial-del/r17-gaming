import './Featured.css'

export default function Featured() {
  return (
    <div id="featured" className="reveal">
      <div className="featured-content">
        <div className="section-label">Editor's Pick · Season 6</div>
        <h3 className="featured-title">SHADOW<br />REALM X</h3>
        <div className="featured-score">
          <div className="score-num">9.8</div>
          <div className="score-label">CRITIC<br />SCORE</div>
        </div>
        <div className="featured-meta">
          <span>🎮 Tactical FPS</span>
          <span>👥 5v5</span>
          <span>🏆 $500K Prize Pool</span>
          <span>🌍 Global Servers</span>
        </div>
        <div className="featured-tags">
          <span className="f-tag">Season 6 Live</span>
          <span className="f-tag">128-Tick Servers</span>
          <span className="f-tag">Anti-Cheat</span>
          <span className="f-tag">Ranked Mode</span>
          <span className="f-tag">Free to Play</span>
        </div>
        <p className="featured-desc">
          The next evolution of tactical shooters is here. Season 6 introduces the Void Map — a subterranean battleground with dynamic lighting — alongside 12 new agents, a complete weapons overhaul, and a rebuilt ranking system that rewards skill, not grind. Over 1.4 million active players. Zero pay-to-win.
        </p>
        <div className="featured-actions">
          <a href="#" className="btn-primary">Play Now — Free</a>
          <a href="#" className="btn-ghost">Watch Trailer</a>
        </div>
      </div>
    </div>
  )
}
