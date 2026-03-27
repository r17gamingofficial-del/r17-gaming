import { useState, useEffect } from 'react'
import './Navbar.css'
import { useAuth } from '../../hooks/useAuth'
import AuthModal from './Authmodal/AuthModal'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const { user, loading, logout } = useAuth()

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
        {user ? (
          <button
            type="button"
            className="nav-cta"
            onClick={() => logout().finally(() => setAuthModalOpen(false))}
            disabled={loading}
          >
            Logout
          </button>
        ) : (
          <a
            href="#"
            className="nav-cta"
            onClick={(e) => {
              e.preventDefault()
              setAuthModalOpen(true)
              setAuthMode('login')
            }}
          >
            Login
          </a>
        )}
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
        {user ? (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              closeMenu()
              logout().finally(() => setAuthModalOpen(false))
            }}
          >
            Logout
          </a>
        ) : (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              closeMenu()
              setAuthMode('login')
              setAuthModalOpen(true)
            }}
          >
            Login
          </a>
        )}
      </div>

      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      )}
    </>
  )
}
