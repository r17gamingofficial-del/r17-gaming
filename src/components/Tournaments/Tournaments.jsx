import { useState, useRef, useEffect } from "react";
import "./Tournaments.css";
import { useAppContext } from "../../Context/AppContext.jsx";

function registerHref(raw) {
  const s = (raw || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

export default function Tournaments() {
  const { tournaments, loading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const videoRefs = useRef({});

  useEffect(() => {
    if (!selectedTournament && tournaments?.length) {
      setSelectedTournament(tournaments[0]);
    }
  }, [tournaments, selectedTournament]);

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

  const openRegistration = (e, tournament) => {
    e.stopPropagation();
    const href = registerHref(tournament?.registerUrl);
    if (!href) return;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  // Handle video autoplay on hover for cards
  const handleVideoHover = (tournamentId, isHovering) => {
    const video = videoRefs.current[`hover-${tournamentId}`];
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
          {!selectedTournament ? (
            <div className="no-results">
              <p>{loading ? "Loading tournaments..." : "No tournaments found."}</p>
            </div>
          ) : (
            <>
              {/*
                Normalize gallery so we always have an array, even if Firestore stored
                a string or null.
              */}
              {(() => {
                if (!selectedTournament) return null;
                const rawGallery = selectedTournament.gallery;
                let normalizedGallery = [];
                if (Array.isArray(rawGallery)) {
                  normalizedGallery = rawGallery;
                } else if (typeof rawGallery === "string") {
                  normalizedGallery = rawGallery
                    .split(",")
                    .map((url) => url.trim())
                    .filter((url) => url);
                }
                selectedTournament.gallery = normalizedGallery;
                return null;
              })()}

              {/* Tournament Card */}
              <div 
                className="gallery-tournament-card"
                onMouseEnter={() => {
                  setHoveredCard(selectedTournament.id || selectedTournament.rank);
                  handleVideoHover(selectedTournament.id || selectedTournament.rank, true);
                }}
                onMouseLeave={() => {
                  setHoveredCard(null);
                  handleVideoHover(selectedTournament.id || selectedTournament.rank, false);
                }}
              >
                <div className="card-image">
                  <img
                    src={
                      selectedTournament.thumbnail ||
                      selectedTournament.image ||
                      "https://via.placeholder.com/600x400?text=No+Image"
                    }
                    alt={selectedTournament.name}
                    className={`card-bg-img ${(hoveredCard === (selectedTournament.id || selectedTournament.rank)) && selectedTournament.videoUrl ? 'card-image-hidden' : ''}`}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/600x400?text=No+Image";
                    }}
                  />
                  {/* Hover Trailer Overlay */}
                  {selectedTournament.videoUrl && (
                    <div className={`card-video-overlay ${hoveredCard === (selectedTournament.id || selectedTournament.rank) ? 'visible' : ''}`}>
                      {selectedTournament.videoUrl.includes("youtube.com") || selectedTournament.videoUrl.includes("youtu.be") ? (
                        hoveredCard === (selectedTournament.id || selectedTournament.rank) && (
                          <iframe
                            className="card-hover-video"
                            src={`${selectedTournament.videoUrl}${selectedTournament.videoUrl.includes("?") ? "&" : "?"}autoplay=1&mute=1&controls=0`}
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                          ></iframe>
                        )
                      ) : (
                        <video
                          ref={(el) => (videoRefs.current[`hover-${selectedTournament.id || selectedTournament.rank}`] = el)}
                          className="card-hover-video"
                          muted
                          loop
                          playsInline
                        >
                          <source src={selectedTournament.videoUrl} type="video/mp4" />
                        </video>
                      )}
                    </div>
                  )}

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
                      <span className="detail-text">
                        {selectedTournament.date}
                      </span>
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
                    type="button"
                    className="register-btn"
                    disabled={!registerHref(selectedTournament.registerUrl)}
                    title={
                      registerHref(selectedTournament.registerUrl)
                        ? "Open registration page"
                        : "Registration link not set (add it in Admin → Tournaments)"
                    }
                    onClick={(e) => openRegistration(e, selectedTournament)}
                  >
                    Register Now →
                  </button>
                </div>
              </div>
              
              {/* Game-style Mini Cards for Other Tournaments */}
              <div className="neon-mini-gallery" style={{ marginTop: "2rem" }}>
                <h4 className="section-heading" style={{ color: "var(--red)", marginBottom: "1.5rem" }}>⚡ OTHER TOURNAMENTS</h4>
                <div className="neon-grid-mini">
                  {tournaments.map((t) => (
                    <div 
                      key={t.id || t.rank} 
                      className={`mini-game-card ${selectedTournament?.id === t.id || selectedTournament?.rank === t.rank ? 'active' : ''}`}
                      onClick={() => handleTournamentClick(t)}
                    >
                      <div 
                        className="mini-game-card-thumb"
                        style={{ backgroundImage: `url(${t.thumbnail || t.image || "https://via.placeholder.com/600x400?text=No+Image"})` }}
                      />
                      <div className="mini-game-card-overlay" />
                      
                      <div className="mini-game-card-top">
                        <span className={`game-tag mini-tag status-${t.status}`}>
                          {t.status}
                        </span>
                      </div>
                      
                      <div className="mini-game-card-body">
                        <div className="mini-game-genre">{t.region || "GLOBAL"}</div>
                        <div className="mini-game-name">{t.name}</div>
                        <div className="mini-game-desc">{t.date} • {t.teams} Teams</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
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
                  className={`tournament-item ${selectedTournament?.rank === t.rank ? "active" : ""}`}
                  key={t.id || t.rank}
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
                    type="button"
                    className="t-btn"
                    disabled={!registerHref(t.registerUrl)}
                    title={
                      registerHref(t.registerUrl)
                        ? "Open registration page"
                        : "Registration link not set (add it in Admin → Tournaments)"
                    }
                    onClick={(e) => openRegistration(e, t)}
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
