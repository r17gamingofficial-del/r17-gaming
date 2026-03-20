import { useEffect } from 'react'
import Cursor from './components/Cursor/Cursor.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero/Hero.jsx'
import Marquee from './components/Marquee/Marquee.jsx'
import Games from './components/Games/Games.jsx'
import Featured from './components/Featured/Featured.jsx'
import HowItWorks from './components/HowItWorks/HowItWorks.jsx'
import Tournaments from './components/Tournaments/Tournaments.jsx'
import Leaderboard from './components/Leaderboard/Leaderboard.jsx'
import Community from './components/Community/Community.jsx'
import Newsletter from './components/Newsletter/Newsletter.jsx'
import Footer from './components/Footer/Footer.jsx'

function App() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), 80)
      }),
      { threshold: 0.07 }
    )
    document.querySelectorAll('.reveal').forEach((r) => obs.observe(r))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Cursor />
      <Navbar />
      <Hero />
      <Marquee />
      <Games />
      <Featured />
      <HowItWorks />
      <Tournaments />
      <Leaderboard />
      <Community />
      <Newsletter />
      <Footer />
    </>
  )
}

export default App
