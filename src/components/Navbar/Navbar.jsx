import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <a href="#" className="nav-logo">R<span>17</span></a>
        <ul className="nav-links">
          <li><a href="#games">Games</a></li>
          <li><a href="#tournaments">Tournaments</a></li>
          <li><a href="#leaderboard">Leaderboard</a></li>
          <li><a href="#community">Community</a></li>
          <li><a href="#newsletter">Newsletter</a></li>
        </ul>
        <a href="#" className="nav-cta">Login</a>
        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <a href="#games" onClick={closeMenu}>Games</a>
        <a href="#tournaments" onClick={closeMenu}>Tournaments</a>
        <a href="#leaderboard" onClick={closeMenu}>Leaderboard</a>
        <a href="#community" onClick={closeMenu}>Community</a>
        <a href="#newsletter" onClick={closeMenu}>Newsletter</a>
      </div>
    </>
  )
}
