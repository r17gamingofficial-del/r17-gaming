import './Footer.css'

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <a href="#" className="footer-logo">R<span>17</span></a>
          <p className="footer-desc">
            The world's premier competitive gaming platform. Home to millions of warriors, hundreds of tournaments, and the most intense esports action on the planet.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-btn" aria-label="X / Twitter">𝕏</a>
            <a href="#" className="social-btn" aria-label="Discord">⬡</a>
            <a href="#" className="social-btn" aria-label="YouTube">▶</a>
            <a href="#" className="social-btn" aria-label="Twitch">▷</a>
            <a href="#" className="social-btn" aria-label="Instagram">◈</a>
          </div>
        </div>

        <div>
          <div className="footer-col-title">Platform</div>
          <ul className="footer-links">
            <li><a href="#">All Games</a></li>
            <li><a href="#">Tournaments</a></li>
            <li><a href="#">Leaderboard</a></li>
            <li><a href="#">Live Matches</a></li>
            <li><a href="#">Prize Pool</a></li>
          </ul>
        </div>

        <div>
          <div className="footer-col-title">Company</div>
          <ul className="footer-links">
            <li><a href="#">About R17</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press Kit</a></li>
            <li><a href="#">Partners</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        <div>
          <div className="footer-col-title">Support</div>
          <ul className="footer-links">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2025 R17 Gaming. Built with <span className="red">♥</span> for warriors.</span>
        <span className="season-tag">SEASON 6 · LIVE NOW</span>
      </div>
    </footer>
  )
}
