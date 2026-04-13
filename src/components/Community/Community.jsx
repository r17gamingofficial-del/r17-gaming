import React from "react";
import "./Community.css";
import {
  FaDiscord,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaTwitch,
  FaYoutube,
} from "react-icons/fa";
import { useAppContext } from "../../Context/AppContext.jsx";

const socialLinks = [
  {
    platform: "Discord",
    url: "https://discord.gg/CDJMJa7dyh",
    icon: FaDiscord,
    color: "#5865F2",
  },
  // {
  //   platform: "Twitter",
  //   url: "https://twitter.com/R17Gaming",
  //   icon: FaTwitter,
  //   color: "#1DA1F2",
  // },
  {
    platform: "Instagram",
    url: "https://www.instagram.com/r17_esport?igsh=bXNxY2pmcDlnZDVm",
    icon: FaInstagram,
    color: "#E4405F",
  },
  {
    platform: "WhatsApp",
    url: "https://chat.whatsapp.com/CCkV0XuX0ZH9PV5CZIMPxw",
    icon: FaWhatsapp,
    color: "#17aa3cff",
  },
  // {
  //   platform: "Twitch",
  //   url: "https://twitch.tv/R17Gaming",
  //   icon: FaTwitch,
  //   color: "#9146FF",
  // },
  // {
  //   platform: "YouTube",
  //   url: "https://youtube.com/@R17Gaming",
  //   icon: FaYoutube,
  //   color: "#FF0000",
  // },
];

export default function Community() {
  const { communityPosts, loading, adminComments } = useAppContext();
  const posts = Array.isArray(communityPosts) ? communityPosts : [];
  const announcements = Array.isArray(adminComments) ? adminComments : [];

  return (
    <section id="community">
      <div className="reveal">
        <div className="section-label">Community</div>
        <h2 className="section-title">JOIN THE ARENA</h2>
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
          Connect with millions of warriors, read reviews, and share your thoughts.
        </p>
      </div>

      <div className="community-split reveal">
        {/* Left Side: Reviews */}
        <div className="community-left">
          <h3 className="sub-section-title">Blogs</h3>
          <div className="scrollable-content">
            <div className="review-grid">
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
          </div>
        </div>

        {/* Center Logo Divider */}
        <div className="community-center-logo">
          <span className="logo-r">R</span><span className="logo-17">17</span>
        </div>

        {/* Right Side: Admin Announcements */}
        <div className="community-right">
          <h3 className="sub-section-title">Comments</h3>
          <div className="scrollable-content">
            <div className="comment-list">
              {loading && announcements.length === 0 ? (
                <p className="community-loading">Loading announcements…</p>
              ) : announcements.length === 0 ? (
                <p style={{ textAlign: "center", fontStyle: "italic", opacity: 0.5, fontSize: "0.85rem", margin: "0.5rem 0" }}>
                  No new announcements at this time.
                </p>
              ) : (
                announcements.map((comment) => (
                  <div className="comment-card" key={comment.id}>
                    <div className="comment-header">
                      <span className="comment-author" style={{ color: "var(--gold)" }}>{comment.author}</span>
                      <span className="comment-date">
                        {comment.createdAt ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
