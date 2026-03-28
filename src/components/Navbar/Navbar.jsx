import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../hooks/useAuth";
import AuthModal from "./Authmodal/AuthModal";

function userInitial(user) {
  if (!user) return "?";
  const n = user.displayName?.trim()?.[0];
  if (n) return n.toUpperCase();
  return (user.email?.[0] || "?").toUpperCase();
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <Link to="/" className="nav-logo">
          R<span>17</span>
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/#games">Games</Link>
          </li>
          <li>
            <Link to="/#tournaments">Tournaments</Link>
          </li>
          <li>
            <Link to="/#leaderboard">Leaderboard</Link>
          </li>
          <li>
            <Link to="/#community">Community</Link>
          </li>
          <li>
            <Link to="/#newsletter">Newsletter</Link>
          </li>
        </ul>
        {user ? (
          <Link
            to="/profile"
            className="nav-avatar-link"
            aria-label="Open profile"
            title="Profile"
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="nav-avatar-img"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="nav-avatar-fallback">{userInitial(user)}</span>
            )}
          </Link>
        ) : (
          <a
            href="#"
            className="nav-cta"
            onClick={(e) => {
              e.preventDefault();
              setAuthModalOpen(true);
              setAuthMode("login");
            }}
          >
            Login
          </a>
        )}
        <button
          type="button"
          className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <Link to="/#games" onClick={closeMenu}>
          Games
        </Link>
        <Link to="/#tournaments" onClick={closeMenu}>
          Tournaments
        </Link>
        <Link to="/#leaderboard" onClick={closeMenu}>
          Leaderboard
        </Link>
        <Link to="/#community" onClick={closeMenu}>
          Community
        </Link>
        <Link to="/#newsletter" onClick={closeMenu}>
          Newsletter
        </Link>
        {user ? (
          <Link
            to="/profile"
            className="mobile-profile-link"
            onClick={closeMenu}
          >
            <span className="mobile-profile-avatar">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  referrerPolicy="no-referrer"
                />
              ) : (
                userInitial(user)
              )}
            </span>
            Profile
          </Link>
        ) : (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              setAuthMode("login");
              setAuthModalOpen(true);
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
  );
}
