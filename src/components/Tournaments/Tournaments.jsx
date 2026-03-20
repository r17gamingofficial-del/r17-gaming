import './Tournaments.css'

const tournaments = [
  {
    rank: '01',
    name: 'World Championship Series — Shadow Realm',
    date: '🗓 Dec 15–20, 2025', region: '🌍 Global', teams: '128 Teams',
    status: 'live', statusLabel: '● Live Now',
    prize: '$500,000'
  },
  {
    rank: '02',
    name: 'Neon Strike Pro League — Season 6 Playoffs',
    date: '🗓 Jan 5–12, 2026', region: '🌍 Asia–Pacific', teams: '64 Teams',
    status: 'soon', statusLabel: 'Soon',
    prize: '$250,000'
  },
  {
    rank: '03',
    name: 'Cyber Siege Invitational Cup — EU Finals',
    date: '🗓 Jan 18–19, 2026', region: '🌍 Europe', teams: '32 Teams',
    status: 'open', statusLabel: 'Open',
    prize: '$120,000'
  },
  {
    rank: '04',
    name: 'Iron Legion Grand Slam — North America',
    date: '🗓 Feb 2–8, 2026', region: '🌍 Americas', teams: '256 Players',
    status: 'open', statusLabel: 'Open',
    prize: '$180,000'
  },
  {
    rank: '05',
    name: 'Phantom Arena Weekly Showdown — Global Open',
    date: '🗓 Every Sunday', region: '🌍 Global', teams: 'Open Entry',
    status: 'open', statusLabel: 'Open',
    prize: '$10,000'
  },
]

export default function Tournaments() {
  return (
    <section id="tournaments">
      <div className="reveal">
        <div className="section-label">Compete</div>
        <h2 className="section-title">LIVE TOURNAMENTS</h2>
        <p className="section-sub">High stakes. Real rewards. Pick your battlefield.</p>
      </div>

      <div className="reveal">
        {tournaments.map((t) => (
          <div className="tournament-item" key={t.rank}>
            <div className="t-rank">{t.rank}</div>
            <div className="t-info">
              <div className="t-name">{t.name}</div>
              <div className="t-meta">
                <span>{t.date}</span>
                <span>{t.region}</span>
                <span>{t.teams}</span>
                <span>
                  <div className={`status-badge status-${t.status}`}>{t.statusLabel}</div>
                </span>
              </div>
            </div>
            <div className="t-prize">{t.prize}<small>Prize Pool</small></div>
            <button className="t-btn">Register</button>
          </div>
        ))}
      </div>
    </section>
  )
}
