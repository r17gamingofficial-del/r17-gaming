import React, { useState } from "react";
import "./Teams.css";
import { useAppContext } from "../../Context/AppContext.jsx";

export default function Teams() {
  const { teams = [] } = useAppContext();
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);

  if (!teams.length) {
    return (
      <section id="teams" className="teams-section">
        <h2 className="teams-heading">Teams</h2>
        <p className="no-teams">No teams available</p>
      </section>
    );
  }

  const currentTeam = teams[selectedTeamIndex];

  const scroll = (direction) => {
    const container = document.getElementById("players-carousel");
    if (!container) return;

    const scrollAmount = 300;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="teams" className="teams-section">
      <h2 className="teams-heading">Our Teams</h2>

      {/* 🔥 Game Tabs */}
      <div className="game-tabs">
        {teams.map((team, idx) => (
          <button
            key={team.id || team.name}
            className={`game-tab ${idx === selectedTeamIndex ? "active" : ""}`}
            onClick={() => setSelectedTeamIndex(idx)}
          >
            {team.name}
          </button>
        ))}
      </div>

      {/* 🔥 Carousel */}
      <div className="players-carousel-wrapper">
        {/* Left Arrow */}
        <button className="carousel-btn left" onClick={() => scroll("left")}>
          ‹
        </button>

        {/* Players */}
        <div className="players-carousel" id="players-carousel">
          {currentTeam?.players?.map((player) => {
            const image =
              player.image ||
              player.avatar ||
              currentTeam.thumbnail ||
              "/assets/default-avatar.png";

            return (
              <div className="player-card-new" key={player.id || player.name}>
                <img
                  src={image}
                  alt={player.name}
                  className="player-img"
                  onError={(e) => (e.target.src = "/assets/default-avatar.png")}
                />

                {/* Overlay */}
                <div className="player-overlay" />

                {/* Vertical Tag */}
                <div className="player-tag">
                  {player.ign || player.role || player.name}
                </div>

                {/* Bottom Name */}
                <div className="player-name-bottom">{player.name}</div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button className="carousel-btn right" onClick={() => scroll("right")}>
          ›
        </button>
      </div>
    </section>
  );
}
