import { useState } from "react";
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
        {/* Left Side - Photo Gallery */}
        <div className="tournaments-gallery reveal">
          <div className="gallery-header">
            <h3 className="gallery-title">{selectedTournament.name}</h3>
          </div>

          <div className="gallery-vertical-container">
            <div className="gallery-vertical-scroll">
              {selectedTournament.gallery.map((img, index) => (
                <div key={index} className="gallery-vertical-item-wrapper">
                  <div className="gallery-vertical-item">
                    <img
                      src={img}
                      alt={`${selectedTournament.name} - Image ${index + 1}`}
                    />
                  </div>
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
