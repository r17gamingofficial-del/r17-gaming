import './Games.css'

const games = [
  {
    id: 'c1', art: 'SR', tag: 'HOT', tagClass: 'gold-tag',
    platforms: ['PC', 'PS5'], genre: 'Tactical FPS', name: 'Shadow Realm',
    desc: '5v5 agent-based tactical shooter with destructible environments and real-time ranked matchmaking.',
    stars: '★★★★★', rating: '4.9 / 5 · 120K reviews'
  },
  {
    id: 'c2', art: 'NS', tag: 'NEW', tagClass: 'blue-tag',
    platforms: ['PC', 'Mobile'], genre: 'Battle Royale', name: 'Neon Strike',
    desc: '60-player drop-in battle royale set in a neon-lit cyberpunk metropolis. Fast-paced, no respawns.',
    stars: '★★★★☆', rating: '4.7 / 5 · 88K reviews'
  },
  {
    id: 'c3', art: 'CS', tag: 'FREE', tagClass: 'green-tag',
    platforms: ['PC', 'PS5', 'XSX'], genre: 'MOBA · Strategy', name: 'Cyber Siege',
    desc: '5v5 MOBA featuring 120+ heroes across 3 lanes. Season-based ranked ladder with global championships.',
    stars: '★★★★★', rating: '4.8 / 5 · 214K reviews'
  },
  {
    id: 'c4', art: 'VP', tag: 'S6', tagClass: '',
    platforms: ['PC'], genre: 'RPG · Open World', name: 'Void Protocol',
    desc: 'Massive open-world survival RPG across 5 post-apocalyptic continents. 100+ hours of content.',
    stars: '★★★★☆', rating: '4.6 / 5 · 55K reviews'
  },
  {
    id: 'c5', art: 'IL', tag: 'PRO', tagClass: 'purple-tag',
    platforms: ['PC', 'XSX'], genre: 'FPS · Competitive', name: 'Iron Legion',
    desc: 'No-frills competitive FPS with 128-tick servers, anti-cheat, and the fairest ranking system built.',
    stars: '★★★★★', rating: '4.9 / 5 · 76K reviews'
  },
  {
    id: 'c6', art: 'PA', tag: 'BETA', tagClass: '',
    platforms: ['PC', 'Mobile'], genre: 'Fighting · Arena', name: 'Phantom Arena',
    desc: 'High-speed 3D arena fighter with 80+ characters, cross-platform play, and weekly ranked seasons.',
    stars: '★★★★☆', rating: '4.5 / 5 · 32K reviews'
  },
]

export default function Games() {
  return (
    <section id="games">
      <div className="reveal">
        <div className="section-label">Our Titles</div>
        <h2 className="section-title">FEATURED GAMES</h2>
        <p className="section-sub">Choose your battleground. Each title demands a different kind of warrior.</p>
      </div>

      <div className="games-grid reveal">
        {games.map((g) => (
          <div className={`game-card ${g.id}`} key={g.id}>
            <div className="game-card-art">{g.art}</div>
            <div className="game-card-top">
              <div className="game-platforms">
                {g.platforms.map((p) => <span className="plat" key={p}>{p}</span>)}
              </div>
              <span className={`game-tag ${g.tagClass}`}>{g.tag}</span>
            </div>
            <div className="game-card-body">
              <div className="game-genre">{g.genre}</div>
              <div className="game-name">{g.name}</div>
              <div className="game-desc">{g.desc}</div>
              <div className="game-rating">
                <span className="stars">{g.stars}</span>
                <span className="rating-val">{g.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
