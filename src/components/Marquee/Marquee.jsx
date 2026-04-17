import { useAppContext } from '../../Context/AppContext'
import './Marquee.css'

export default function Marquee({ overrideItems }) {
  const { marquee } = useAppContext();
  
  // Use overrideItems if provided (for live preview), otherwise use context, otherwise fallback
  let itemsToUse = overrideItems;
  if (!itemsToUse) {
    itemsToUse = marquee?.items?.length ? marquee.items : [
      'SEASON 6 NOW LIVE',
      '$2.8M PRIZE POOL',
      'WORLD CHAMPIONSHIP · DEC 2025',
      'NEW MAPS DROP TODAY',
      'REGISTER NOW',
    ];
  }

  const allItems = [...itemsToUse, ...itemsToUse]

  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {allItems.map((item, i) => (
          <span className="marquee-item" key={i}>
            {item} 
          </span>
        ))}
      </div>
    </div>
  )
}
