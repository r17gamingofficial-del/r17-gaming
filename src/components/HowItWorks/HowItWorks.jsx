import './HowItWorks.css'

const steps = [
  {
    num: '01', icon: '🎮', title: 'Create Account',
    desc: 'Sign up in 60 seconds. Link your game accounts and build your player profile instantly.'
  },
  {
    num: '02', icon: '⚔️', title: 'Choose Your Game',
    desc: 'Pick from 18+ supported titles. Find your game, your genre, and your competitive niche.'
  },
  {
    num: '03', icon: '🏆', title: 'Join Tournament',
    desc: 'Enter daily scrimmages or major championship brackets. Find your level and compete hard.'
  },
  {
    num: '04', icon: '💰', title: 'Earn & Rise',
    desc: 'Win real prizes, climb global rankings, and build your name as a legendary competitor.'
  },
]

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="reveal">
        <div className="section-label">Getting Started</div>
        <h2 className="section-title">HOW IT WORKS</h2>
        <p className="section-sub">From rookie to champion — your path starts here.</p>
      </div>
      <div className="steps-grid reveal">
        {steps.map((s) => (
          <div className="step-card" key={s.num}>
            <span className="step-num">{s.num}</span>
            <span className="step-icon">{s.icon}</span>
            <div className="step-title">{s.title}</div>
            <p className="step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
