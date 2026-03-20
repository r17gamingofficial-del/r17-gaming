import './Leaderboard.css'

const players = [
  { rank: '01', rankClass: 'gold',   av: 'av1', letter: 'Z', name: 'ZephyrX',    country: '🇰🇷 South Korea', score: '98,420', kd: '4.8' },
  { rank: '02', rankClass: 'silver', av: 'av2', letter: 'N', name: 'NovaBurst',   country: '🇸🇪 Sweden',      score: '94,105', kd: '4.3' },
  { rank: '03', rankClass: 'bronze', av: 'av3', letter: 'R', name: 'R17_Ghost',   country: '🇧🇷 Brazil',      score: '91,882', kd: '4.1' },
  { rank: '04', rankClass: '',       av: 'av4', letter: 'S', name: 'StrikeFury',  country: '🇺🇸 USA',         score: '89,340', kd: '3.9' },
  { rank: '05', rankClass: '',       av: 'av5', letter: 'V', name: 'VoidHunter',  country: '🇩🇪 Germany',     score: '86,720', kd: '3.7' },
  { rank: '06', rankClass: '',       av: 'av6', letter: 'P', name: 'PhantomAce',  country: '🇯🇵 Japan',       score: '84,100', kd: '3.5' },
]

const bars = [
  { label: 'Shadow Realm',  width: '92%', delay: '0.1s',  val: '1.4M' },
  { label: 'Cyber Siege',   width: '78%', delay: '0.25s', val: '980K' },
  { label: 'Neon Strike',   width: '63%', delay: '0.4s',  val: '820K' },
  { label: 'Iron Legion',   width: '50%', delay: '0.55s', val: '640K' },
  { label: 'Void Protocol', width: '38%', delay: '0.7s',  val: '460K' },
  { label: 'Phantom Arena', width: '25%', delay: '0.85s', val: '280K' },
]

export default function Leaderboard() {
  return (
    <section id="leaderboard">
      <div className="reveal">
        <div className="section-label">Rankings</div>
        <h2 className="section-title">GLOBAL LEADERBOARD</h2>
        <p className="section-sub">The best of the best. Where do you stand?</p>
      </div>

      <div className="lb-grid reveal">
        <table className="lb-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Score</th>
              <th>K/D</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.rank}>
                <td className={`lb-rank ${p.rankClass}`}>{p.rank}</td>
                <td>
                  <div className="lb-player">
                    <div className={`lb-avatar ${p.av}`}>{p.letter}</div>
                    <div>
                      <div className="lb-name">{p.name}</div>
                      <div className="lb-country">{p.country}</div>
                    </div>
                  </div>
                </td>
                <td className="lb-score">{p.score}</td>
                <td className="lb-kd">{p.kd}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="lb-chart-panel">
          <div className="lb-chart-title">// Top Games by Active Players</div>
          {bars.map((b) => (
            <div className="bar-row" key={b.label}>
              <div className="bar-label">{b.label}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: b.width, animationDelay: b.delay }} />
              </div>
              <div className="bar-val">{b.val}</div>
            </div>
          ))}

          <div className="lb-live-stats">
            <div className="lb-chart-title">// Live Right Now</div>
            <div className="lb-live-badges">
              <div className="lb-live-badge live">● 8,420 LIVE</div>
              <div className="lb-live-badge neutral">342 TOURNAMENTS</div>
              <div className="lb-live-badge neutral">14 FINALS TODAY</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
