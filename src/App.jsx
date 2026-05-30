import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AppProvider, useAppContext } from "./Context/AppContext.jsx";
import CinematicLoader from "./components/Loader/CinematicLoader.jsx";
import Cursor from "./components/Cursor/Cursor.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Marquee from "./components/Marquee/Marquee.jsx";
import Games from "./components/Games/Games.jsx";
import Featured from "./components/Featured/Featured.jsx";
import HowItWorks from "./components/HowItWorks/HowItWorks.jsx";
import Tournaments from "./components/Tournaments/Tournaments.jsx";
import Leaderboard from "./components/Leaderboard/Leaderboard.jsx";
import Community from "./components/Community/Community.jsx";
import Newsletter from "./components/Newsletter/Newsletter.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AdminPanel from "./components/Admin/AdminPanel.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Teams from "./components/Teams/Teams.jsx";
import AnnouncementsCarousel from "./components/Announcements/AnnouncementsCarousel.jsx";
import Store from "./components/Store/Store.jsx";
import Checkout from "./components/Checkout/Checkout.jsx";

// Create a separate component that uses the context
function HomePage({ bootState }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const { games, announcementSlides } = useAppContext();

  useEffect(() => {
    if (games && games.length > 0 && !selectedGame) {
      setSelectedGame(games[0]);
    }
  }, [games, selectedGame]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            setTimeout(() => e.target.classList.add("visible"), 80);
        }),
      { threshold: 0.07 },
    );
    document.querySelectorAll(".reveal").forEach((r) => obs.observe(r));
    return () => obs.disconnect();
  }, [announcementSlides]);

  return (
    <>
      <Cursor />
      <Navbar />
      <Hero bootState={bootState} />
      <Marquee />
      <Games onGameSelect={handleGameSelect} selectedGame={selectedGame} />
      <Featured selectedGame={selectedGame} />
      <AnnouncementsCarousel />
      <Teams />
      <HowItWorks />
      <Tournaments />
      <Leaderboard />
      <Community />
      <Newsletter />
      <Footer />
    </>
  );
}

// Admin Login Component
function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const attemptLogin = (value) => {
    if (onLogin(String(value || "").trim())) {
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedPassword =
      e.currentTarget.elements.adminPassword?.value || password;
    attemptLogin(submittedPassword);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-background">
        <div className="bg-gradient"></div>
        <div className="bg-particles"></div>
      </div>

      <div className="admin-login-card">
        <div className="login-header">
          <div className="login-icon">🎮</div>
          <h1 className="login-title">Admin Access</h1>
          <p className="login-subtitle">
            Enter credentials to access dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">
              <span className="label-icon">🔑</span>
              Admin Password
            </label>
            <div className="password-input-wrapper">
              <input
                type="password"
                name="adminPassword"
                placeholder="Enter your admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
                autoFocus
              />
              <span className="input-shine"></span>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            onClick={(e) =>
              attemptLogin(e.currentTarget.form?.elements.adminPassword?.value || password)
            }
          >
            <span className="button-text">Access Dashboard</span>
            <span className="button-icon">→</span>
          </button>
        </form>

        <div className="login-footer">
          <div className="security-badge">
            <span className="shield-icon">🛡️</span>
            Secure Area
          </div>
          <div className="version-badge">v1.0.0</div>
        </div>
      </div>

      <div className="admin-login-decoration">
        <div className="decoration-line"></div>
        <div className="decoration-line"></div>
        <div className="decoration-line"></div>
      </div>
    </div>
  );
}

// Admin Route Component
function AdminRoute() {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminLogin = (password) => {
    if (String(password || "").trim() === "admin123") {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  return (
    <>
      <Cursor />
      {isAdmin ? <AdminPanel /> : <AdminLogin onLogin={handleAdminLogin} />}
    </>
  );
}

function ProfileRoute() {
  return (
    <>
      <Cursor />
      <Navbar />
      <Profile />
      <Footer />
    </>
  );
}

function StoreRoute() {
  return (
    <>
      <Cursor />
      <Store />
    </>
  );
}

function CheckoutRoute() {
  return (
    <>
      <Cursor />
      <Checkout />
    </>
  );
}

function App() {
  const [bootState, setBootState] = useState("booting");

  const handleTransitionStart = () => {
    setBootState("transitioning");
  };

  const handleBootComplete = () => {
    setBootState("complete");
  };

  useEffect(() => {
    // Force absolute scroll reset on mount
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (bootState !== "complete") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [bootState]);

  return (
    <AppProvider>
      <AnimatePresence>
        {bootState !== "complete" && (
          <CinematicLoader 
            key="loader" 
            onTransitionStart={handleTransitionStart}
            onComplete={handleBootComplete} 
          />
        )}
      </AnimatePresence>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage bootState={bootState} />} />
          <Route path="/store" element={<StoreRoute />} />
          <Route path="/checkout" element={<CheckoutRoute />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route path="/admin" element={<AdminRoute />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
