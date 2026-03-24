import "./Community.css";
import {
  FaDiscord,
  FaTwitter,
  FaInstagram,
  FaTwitch,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

const reviews = [
  {
    stars: "★★★★★",
    av: "ra1",
    letter: "Z",
    name: "ZephyrX",
    handle: "@zephyrx_pro · Shadow Realm",
    text: "R17 completely changed how I approach competitive gaming. The tournament system is flawless and prize payouts are always on time. Addicted since day one.",
  },
  {
    stars: "★★★★★",
    av: "ra2",
    letter: "N",
    name: "NovaBurst",
    handle: "@novaburst_eu · Cyber Siege",
    text: "Nothing comes close to the competition here. I've been in esports for 8 years and R17 has the best infrastructure I've ever played on. Period.",
  },
  {
    stars: "★★★★★",
    av: "ra3",
    letter: "K",
    name: "KryptonPeak",
    handle: "@kryptonpeak · Iron Legion",
    text: "I went from casual to winning my first $10K tournament in three months. The ranked system genuinely pushes you to improve every single match.",
  },
  {
    stars: "★★★★☆",
    av: "ra4",
    letter: "S",
    name: "SolarWarden",
    handle: "@solarwarden · Neon Strike",
    text: "The matchmaking is incredibly fair. Never felt thrown into impossible games. Steady climb up the leaderboard since joining six months ago.",
  },
  {
    stars: "★★★★★",
    av: "ra5",
    letter: "V",
    name: "VoidHunter",
    handle: "@voidhunter_de · Void Protocol",
    text: "Community events, weekly tournaments, daily challenges — there's always something happening. This platform has everything a competitive player needs.",
  },
  {
    stars: "★★★★★",
    av: "ra6",
    letter: "P",
    name: "PhantomAce",
    handle: "@phantomace_jp · Phantom Arena",
    text: "As a streamer, the spectator mode is unreal. My viewers see live stats in real-time. Completely game-changing feature I haven't seen built this well anywhere else.",
  },
];

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
  {
    platform: "TikTok",
    url: "https://tiktok.com/@r17.gaming",
    icon: FaTiktok,
    color: "#000000",
  },
];

export default function Community() {
  return (
    <section id="community">
      <div className="reveal">
        <div className="section-label">Community</div>
        <h2 className="section-title">WHAT PLAYERS SAY</h2>
        <p className="section-sub">
          Join millions of warriors who've already entered the arena.
        </p>
      </div>

      <div className="review-grid reveal">
        {reviews.map((r) => (
          <div className="review-card" key={r.name}>
            <div className="review-stars">{r.stars}</div>
            <p className="review-text">{r.text}</p>
            <div className="review-author">
              <div className={`review-av ${r.av}`}>{r.letter}</div>
              <div>
                <div className="review-name">{r.name}</div>
                <div className="review-handle">{r.handle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
    </section>
  );
}
