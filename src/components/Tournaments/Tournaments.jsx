import { useState, useRef, useEffect } from "react";
import "./Tournaments.css";

const tournaments = [
  {
    rank: "01",
    name: "World Championship Series — Shadow Realm",
    date: "🗓 Dec 15–20, 2025",
    region: "🌍 Global",
    teams: "128 Teams",
    status: "live",
    statusLabel: "● Live Now",
    prize: "$500,000",
    videoUrl:
      "https://www.youtube.com/embed/Pte7C8wjp1w?autoplay=1&mute=1&loop=1&playlist=Pte7C8wjp1w&controls=0&modestbranding=1&rel=0",
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
    ],
  },
  {
    rank: "02",
    name: "Neon Strike Pro League — Season 6 Playoffs",
    date: "🗓 Jan 5–12, 2026",
    region: "🌍 Asia–Pacific",
    teams: "64 Teams",
    status: "soon",
    statusLabel: "Soon",
    prize: "$250,000",
    videoUrl:
      "https://www.youtube.com/embed/Pte7C8wjp1w?autoplay=1&mute=1&loop=1&playlist=Pte7C8wjp1w&controls=0&modestbranding=1&rel=0",
    thumbnail:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=600&h=400&fit=crop",
    ],
  },
  {
    rank: "03",
    name: "Cyber Siege Invitational Cup — EU Finals",
    date: "🗓 Jan 18–19, 2026",
    region: "🌍 Europe",
    teams: "32 Teams",
    status: "open",
    statusLabel: "Open",
    prize: "$120,000",
    videoUrl:
      "https://www.youtube.com/embed/Pte7C8wjp1w?autoplay=1&mute=1&loop=1&playlist=Pte7C8wjp1w&controls=0&modestbranding=1&rel=0",
    thumbnail:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&h=400&fit=crop",
    ],
  },
  {
    rank: "04",
    name: "Iron Legion Grand Slam — North America",
    date: "🗓 Feb 2–8, 2026",
    region: "🌍 Americas",
    teams: "256 Players",
    status: "open",
    statusLabel: "Open",
    prize: "$180,000",
    videoUrl:
      "https://www.youtube.com/embed/Pte7C8wjp1w?autoplay=1&mute=1&loop=1&playlist=Pte7C8wjp1w&controls=0&modestbranding=1&rel=0",
    thumbnail:
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
    ],
  },
  {
    rank: "05",
    name: "Phantom Arena Weekly Showdown — Global Open",
    date: "🗓 Every Sunday",
    region: "🌍 Global",
    teams: "Open Entry",
    status: "open",
    statusLabel: "Open",
    prize: "$10,000",
    videoUrl:
      "https://www.youtube.com/embed/Pte7C8wjp1w?autoplay=1&mute=1&loop=1&playlist=Pte7C8wjp1w&controls=0&modestbranding=1&rel=0",
    thumbnail:
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
    ],
  },
];

export default function Tournaments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const videoRefs = useRef({});

  // Get unique regions for filter
  const regions = ["all", ...new Set(tournaments.map((t) => t.region))];
  const statuses = ["all", "live", "soon", "open"];

  // Filter tournaments based on search, region, and status
  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRegion =
      selectedRegion === "all" || tournament.region === selectedRegion;
    const matchesStatus =
      selectedStatus === "all" || tournament.status === selectedStatus;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const handleTournamentClick = (tournament) => {
    setSelectedTournament(tournament);
  };

  // Handle video autoplay on hover for cards
  const handleVideoHover = (tournamentId, isHovering) => {
    const video = videoRefs.current[tournamentId];
    if (video) {
      if (isHovering) {
        video.play().catch((error) => {
          console.log("Video autoplay failed:", error);
        });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  return (
    <section id="tournaments" className="tournaments-section">
      <div className="reveal">
        <div className="section-label">Compete</div>
        <h2 className="section-title">LIVE TOURNAMENTS</h2>
        <p className="section-sub">
          High stakes. Real rewards. Pick your battlefield.
        </p>
      </div>

      <div className="tournaments-container">
        {/* Left Side - Gallery Section */}
        <div className="tournaments-gallery reveal">
          {/* Tournament Card */}
          <div className="gallery-tournament-card">
            <div className="card-image">
              <img
                src={
                  selectedTournament.thumbnail ||
                  selectedTournament.image ||
                  "https://via.placeholder.com/600x400?text=No+Image"
                }
                alt={selectedTournament.name}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x400?text=No+Image";
                }}
              />
              <div
                className={`card-status status-${selectedTournament.status}`}
              >
                {selectedTournament.statusLabel}
              </div>
              <div className="prize-badge">{selectedTournament.prize}</div>
            </div>
            <div className="card-content">
              <div className="card-header">
                <h3 className="card-title">{selectedTournament.name}</h3>
              </div>
              <div className="card-details">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span className="detail-text">{selectedTournament.date}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-text">
                    {selectedTournament.region}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">👥</span>
                  <span className="detail-text">
                    {selectedTournament.teams}
                  </span>
                </div>
              </div>
              <button
                className="register-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Register for:", selectedTournament.name);
                }}
              >
                Register Now →
              </button>
            </div>
          </div>

          {/* Video Section */}
          <div className="video-section">
            <h4 className="section-heading">🎬 Tournament Trailer</h4>
            <div className="video-container">
              {selectedTournament.videoUrl &&
              (selectedTournament.videoUrl.includes("youtube.com") ||
                selectedTournament.videoUrl.includes("youtu.be")) ? (
                <iframe
                  className="tournament-video"
                  src={selectedTournament.videoUrl}
                  title={`${selectedTournament.name} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  key={selectedTournament.rank}
                  className="tournament-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                >
                  <source src={selectedTournament.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>

          {/* Photos Gallery */}
          <div className="photos-section">
            <h4 className="section-heading">📸 Tournament Highlights</h4>
            <div className="photos-grid">
              {selectedTournament.gallery.map((img, index) => (
                <div key={index} className="photo-item">
                  <img src={img} alt={`Highlight ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Filters + Tournament Listings */}
        <div className="tournaments-listings">
          {/* Filters Section */}
          <div className="filters-section reveal">
            <div className="search-bar">
              <input
                type="text"
                placeholder="🔍 Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="filter-select"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region === "all" ? "All Regions" : region}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "all"
                      ? "All Status"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tournament Items */}
          <div className="tournaments-list reveal">
            {filteredTournaments.length > 0 ? (
              filteredTournaments.map((t) => (
                <div
                  className={`tournament-item ${selectedTournament.rank === t.rank ? "active" : ""}`}
                  key={t.rank}
                  onClick={() => handleTournamentClick(t)}
                >
                  <div className="t-rank">{t.rank}</div>
                  <div className="t-info">
                    <div className="t-name">{t.name}</div>
                    <div className="t-meta">
                      <span>{t.date}</span>
                      <span>{t.region}</span>
                      <span>{t.teams}</span>
                      <span>
                        <div className={`status-badge status-${t.status}`}>
                          {t.statusLabel}
                        </div>
                      </span>
                    </div>
                  </div>
                  <div className="t-prize">
                    {t.prize}
                    <small>Prize Pool</small>
                  </div>
                  <button
                    className="t-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle registration
                      console.log("Register for:", t.name);
                    }}
                  >
                    Register
                  </button>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No tournaments found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
