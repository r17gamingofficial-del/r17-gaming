import './Community.css'

const reviews = [
  {
    stars: '★★★★★', av: 'ra1', letter: 'Z',
    name: 'ZephyrX', handle: '@zephyrx_pro · Shadow Realm',
    text: 'R17 completely changed how I approach competitive gaming. The tournament system is flawless and prize payouts are always on time. Addicted since day one.'
  },
  {
    stars: '★★★★★', av: 'ra2', letter: 'N',
    name: 'NovaBurst', handle: '@novaburst_eu · Cyber Siege',
    text: "Nothing comes close to the competition here. I've been in esports for 8 years and R17 has the best infrastructure I've ever played on. Period."
  },
  {
    stars: '★★★★★', av: 'ra3', letter: 'K',
    name: 'KryptonPeak', handle: '@kryptonpeak · Iron Legion',
    text: 'I went from casual to winning my first $10K tournament in three months. The ranked system genuinely pushes you to improve every single match.'
  },
  {
    stars: '★★★★☆', av: 'ra4', letter: 'S',
    name: 'SolarWarden', handle: '@solarwarden · Neon Strike',
    text: "The matchmaking is incredibly fair. Never felt thrown into impossible games. Steady climb up the leaderboard since joining six months ago."
  },
  {
    stars: '★★★★★', av: 'ra5', letter: 'V',
    name: 'VoidHunter', handle: '@voidhunter_de · Void Protocol',
    text: "Community events, weekly tournaments, daily challenges — there's always something happening. This platform has everything a competitive player needs."
  },
  {
    stars: '★★★★★', av: 'ra6', letter: 'P',
    name: 'PhantomAce', handle: '@phantomace_jp · Phantom Arena',
    text: "As a streamer, the spectator mode is unreal. My viewers see live stats in real-time. Completely game-changing feature I haven't seen built this well anywhere else."
  },
]

export default function Community() {
  return (
    <section id="community">
      <div className="reveal">
        <div className="section-label">Community</div>
        <h2 className="section-title">WHAT PLAYERS SAY</h2>
        <p className="section-sub">Join millions of warriors who've already entered the arena.</p>
      </div>

      <div className="review-grid reveal">
        {reviews.map((r) => (
          <div className="review-card" key={r.name}>
            <div className="review-stars">{r.stars}</div>
            <p className="review-text">{r.text}</p>
            <div className="review-author">
              <div className={`review-av ${r.av}`}>{r.letter}</div>
              <div>
                <div className="review-name">{r.name}</div>
                <div className="review-handle">{r.handle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
