import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle smooth scrolling to sections
  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();

    // If we're not on the home page, navigate to home first
    if (location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }

    // Scroll to section on home page
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Height of fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    // Close mobile menu if open
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <Link to="/" className="nav-logo">
          R<span>17</span>
        </Link>
        <ul className="nav-links">
          <li>
            <a href="#games" onClick={(e) => handleScrollToSection(e, "games")}>
              Games
            </a>
          </li>
          <li>
            <a
              href="#tournaments"
              onClick={(e) => handleScrollToSection(e, "tournaments")}
            >
              Tournaments
            </a>
          </li>
          <li>
            <a
              href="#leaderboard"
              onClick={(e) => handleScrollToSection(e, "leaderboard")}
            >
              Leaderboard
            </a>
          </li>
          <li>
            <a
              href="#community"
              onClick={(e) => handleScrollToSection(e, "community")}
            >
              Community
            </a>
          </li>
          <li>
            <a
              href="#newsletter"
              onClick={(e) => handleScrollToSection(e, "newsletter")}
            >
              Newsletter
            </a>
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
        <a href="#games" onClick={(e) => handleScrollToSection(e, "games")}>
          Games
        </a>
        <a
          href="#tournaments"
          onClick={(e) => handleScrollToSection(e, "tournaments")}
        >
          Tournaments
        </a>
        <a
          href="#leaderboard"
          onClick={(e) => handleScrollToSection(e, "leaderboard")}
        >
          Leaderboard
        </a>
        <a
          href="#community"
          onClick={(e) => handleScrollToSection(e, "community")}
        >
          Community
        </a>
        <a
          href="#newsletter"
          onClick={(e) => handleScrollToSection(e, "newsletter")}
        >
          Newsletter
        </a>
        {user ? (
          <Link
            to="/profile"
            className="mobile-profile-link"
            onClick={closeMenu}
          >
            <span className="mobile-profile-avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />
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
