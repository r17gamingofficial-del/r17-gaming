import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const handleAdminLogin = (password) => {
    // Change this to your desired password
    if (password === "admin123") {
      setIsAdmin(true);
      return true;
    }
    return false;
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
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
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
          }
        />
        <Route
          path="/admin"
          element={
            <>
              <Cursor />
              isAdmin ? <AdminPanel /> :{" "}
              <AdminLogin onLogin={handleAdminLogin} />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin(password)) {
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default App;
