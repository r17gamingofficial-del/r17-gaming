import React, { useState, useRef } from "react";
import "./Teams.css";
import { useAppContext } from "../../Context/AppContext.jsx";

export default function Teams() {
  const { teams = [] } = useAppContext();
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = 300;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Advanced Scrolling Handlers
  const handleWheel = (e) => {
    if (!carouselRef.current) return;
    const delta = e.deltaY || e.deltaX;
    carouselRef.current.scrollLeft += delta;
    e.preventDefault();
  };

  const handleMouseDown = (e) => {
    const container = carouselRef.current;
    if (!container) return;
    container.isDragging = true;
    container.startX = e.pageX - container.offsetLeft;
    container.scrollLeftStart = container.scrollLeft;
    container.style.cursor = "grabbing";
    container.style.scrollBehavior = "auto"; // Disable smooth scroll while dragging
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    const container = carouselRef.current;
    if (!container || !container.isDragging) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - container.startX) * 1.5; // Scroll speed multiplier
    container.scrollLeft = container.scrollLeftStart - walk;
  };

  const handleMouseUpOrLeave = () => {
    const container = carouselRef.current;
    if (!container) return;
    container.isDragging = false;
    container.style.cursor = "grab";
    container.style.scrollBehavior = "smooth"; // Re-enable for snapping/buttons
  };

  const handleTouchStart = (e) => {
    const container = carouselRef.current;
    if (!container) return;
    const touch = e.touches[0];
    container.touchStartX = touch.pageX - container.offsetLeft;
    container.touchScrollLeft = container.scrollLeft;
    container.style.scrollBehavior = "auto";
  };

  const handleTouchMove = (e) => {
    const container = carouselRef.current;
    if (!container || !container.touchStartX) return;
    const touch = e.touches[0];
    const dx = touch.pageX - container.offsetLeft;
    const walk = dx - container.touchStartX;
    container.scrollLeft = container.touchScrollLeft - walk;
  };

  return (
    <section id="teams" className="teams-section">
      <div className="reveal">
        <div className="section-label">Rosters</div>
        <h2 className="section-title">OUR TEAMS</h2>
        <p className="section-sub">
          Meet the champions who represent R17 on the global stage.
        </p>
      </div>

      {!teams.length ? (
        <p className="no-teams">No teams available</p>
      ) : (
        <>
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
            {/* <button className="carousel-btn left" onClick={() => scroll("left")}>
              ‹
            </button> */}

            {/* Players */}
            <div 
              className="players-carousel" 
              ref={carouselRef}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              style={{ cursor: "grab" }}
            >
              {teams[selectedTeamIndex]?.players?.map((player) => {
                const currentTeam = teams[selectedTeamIndex];
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

                    {/* Team Logo */}
                    {currentTeam.logo && (
                      <img
                        src={currentTeam.logo}
                        alt={`${currentTeam.name} Logo`}
                        className="player-team-logo"
                      />
                    )}

                    {/* Vertical Tag */}
                    <div className="player-tag">
                      {player.ign || player.role || player.name}
                    </div>

                    {/* Bottom Name */}
                    <div className="player-name-bottom">{player.name}</div>

                    {/* Hover Details */}
                    <div className="player-details-hover">
                      <div className="player-hover-ign">{player.ign || player.name}</div>
                      {player.role && <div className="player-hover-role">{player.role}</div>}
                      {player.bio && <p className="player-hover-bio">{player.bio}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Arrow */}
            {/* <button className="carousel-btn right" onClick={() => scroll("right")}>
              ›
            </button> */}
          </div>
        </>
      )}
    </section>
  );
}
