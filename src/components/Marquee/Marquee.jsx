import './Marquee.css'

const items = [
  'SEASON 6 NOW LIVE',
  '$2.8M PRIZE POOL',
  'WORLD CHAMPIONSHIP · DEC 2025',
  'NEW MAPS DROP TODAY',
  'REGISTER NOW',
]

export default function Marquee() {
  const allItems = [...items, ...items]

  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {allItems.map((item, i) => (
          <span className="marquee-item" key={i}>
            {item} <span className="dot">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
