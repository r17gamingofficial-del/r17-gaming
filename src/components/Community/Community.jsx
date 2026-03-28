import "./Community.css";
import {
  FaDiscord,
  FaTwitter,
  FaInstagram,
  FaTwitch,
  FaYoutube,
} from "react-icons/fa";
import { useAppContext } from "../../Context/AppContext.jsx";

const socialLinks = [
  {
    platform: "Discord",
    url: "https://discord.gg/r17gaming",
    icon: FaDiscord,
    color: "#5865F2",
  },
  {
    platform: "Twitter",
    url: "https://twitter.com/R17Gaming",
    icon: FaTwitter,
    color: "#1DA1F2",
  },
  {
    platform: "Instagram",
    url: "https://instagram.com/r17.gaming",
    icon: FaInstagram,
    color: "#E4405F",
  },
  {
    platform: "Twitch",
    url: "https://twitch.tv/R17Gaming",
    icon: FaTwitch,
    color: "#9146FF",
  },
  {
    platform: "YouTube",
    url: "https://youtube.com/@R17Gaming",
    icon: FaYoutube,
    color: "#FF0000",
  },
];

export default function Community() {
  const { communityPosts, loading } = useAppContext();
  const posts = Array.isArray(communityPosts) ? communityPosts : [];

  return (
    <section id="community">
      <div className="reveal">
        <div className="section-label">Community</div>
        <h2 className="section-title">WHAT PLAYERS SAY</h2>
        {/* Social Links Section */}
        <div className="social-section reveal">
          <div className="social-links">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                  aria-label={social.platform}
                  style={{ "--social-color": social.color }}
                >
                  <Icon className="social-icon-svg" />
                </a>
              );
            })}
          </div>
        </div>
        <p className="section-sub">
          Join millions of warriors who've already entered the arena.
        </p>
      </div>

      <div className="review-grid reveal">
        {loading && posts.length === 0 ? (
          <p className="community-loading">Loading community posts…</p>
        ) : (
          posts.map((r) => (
            <div className="review-card" key={r.id}>
              <div className="review-stars">{r.stars}</div>
              <p className="review-text">{r.text}</p>
              <div className="review-author">
                <div className={`review-av ${r.av || "ra1"}`}>
                  {(r.letter || "?").slice(0, 1)}
                </div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-handle">{r.handle}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
