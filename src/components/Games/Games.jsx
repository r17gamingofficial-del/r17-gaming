import { useState, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import "./Games.css";

const getRowGames = (games) => {
  const totalGames = games.length;
  const midPoint = Math.ceil(totalGames / 2);
  const row1 = games.slice(0, midPoint);
  const row2 = games.slice(midPoint);
  return { row1, row2 };
};

export default function Games({ onGameSelect, selectedGame }) {
  const { games } = useAppContext();
  const { row1, row2 } = getRowGames(games);

  // Set default selected game when games load
  useEffect(() => {
    if (games && games.length > 0 && !selectedGame && onGameSelect) {
      onGameSelect(games[0]);
    }
  }, [games, selectedGame, onGameSelect]);

  // Handle wheel scroll for horizontal scrolling
  const handleWheel = (e) => {
    const container = e.currentTarget;
    const delta = e.deltaY || e.deltaX;
    container.scrollLeft += delta;
    e.preventDefault();
  };

  // Drag-to-scroll handlers
  const handleMouseDown = (e, container) => {
    container.isDragging = true;
    container.startX = e.pageX - container.offsetLeft;
    container.scrollLeftStart = container.scrollLeft;
    container.style.cursor = "grabbing";
    e.preventDefault();
  };

  const handleMouseMove = (e, container) => {
    if (!container.isDragging) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - container.startX) * 1.2;
    container.scrollLeft = container.scrollLeftStart - walk;
  };

  const handleMouseUp = (container) => {
    container.isDragging = false;
    container.style.cursor = "grab";
  };

  const handleMouseLeave = (container) => {
    container.isDragging = false;
    container.style.cursor = "grab";
  };

  const handleTouchStart = (e, container) => {
    const touch = e.touches[0];
    container.touchStartX = touch.pageX - container.offsetLeft;
    container.touchScrollLeft = container.scrollLeft;
  };

  const handleTouchMove = (e, container) => {
    if (!container.touchStartX) return;
    const touch = e.touches[0];
    const dx = touch.pageX - container.offsetLeft;
    const walk = dx - container.touchStartX;
    container.scrollLeft = container.touchScrollLeft - walk;
    e.preventDefault();
  };

  const handleTouchEnd = (container) => {
    container.touchStartX = 0;
  };

  const handleGameClick = (game) => {
    if (onGameSelect) {
      onGameSelect(game);
    }
  };

  // Show loading or empty state if no games
  if (!games || games.length === 0) {
    return (
      <section id="games">
        <div className="reveal">
          <div className="section-label">Our Titles</div>
          <h2 className="section-title">FEATURED GAMES</h2>
          <div className="no-games">
            <p>No games available at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="games">
      <div className="reveal">
        <div className="section-label">Our Titles</div>
        <h2 className="section-title">FEATURED GAMES</h2>
      </div>

      {row1.length > 0 && (
        <div className="slider-row-container">
          <div className="row-header">
            <div className="row-title">
              <span>/// Trending Now</span>
            </div>
          </div>
          <div
            className="slider-row"
            id="sliderRow1"
            onWheel={handleWheel}
            onMouseDown={(e) => handleMouseDown(e, e.currentTarget)}
            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
            onMouseUp={(e) => handleMouseUp(e.currentTarget)}
            onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
            onTouchStart={(e) => handleTouchStart(e, e.currentTarget)}
            onTouchMove={(e) => handleTouchMove(e, e.currentTarget)}
            onTouchEnd={(e) => handleTouchEnd(e.currentTarget)}
            style={{ cursor: "grab" }}
          >
            <div className="games-horizontal">
              {row1.map((g, index) => (
                <div
                  className={`game-card c${(g.id % 6) + 1} ${selectedGame?.id === g.id ? "active" : ""}`}
                  key={`row1-${g.id}-${index}`}
                  onClick={() => handleGameClick(g)}
                >
                  <div className="game-card-art">
                    {g.art || g.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="game-card-top">
                    <div className="game-platforms">
                      {g.platforms &&
                        g.platforms.map((p) => (
                          <span className="plat" key={p}>
                            {p}
                          </span>
                        ))}
                    </div>
                    <span className={`game-tag ${g.tagClass || ""}`}>
                      {g.tag || "NEW"}
                    </span>
                  </div>
                  <div className="game-card-body">
                    <div className="game-genre">{g.genre || g.category}</div>
                    <div className="game-name">{g.name}</div>
                    <div className="game-desc">{g.description || g.desc}</div>
                    <div className="game-rating">
                      <span className="stars">{g.stars || "★★★★☆"}</span>
                      <span className="rating-val">
                        {g.rating || "4.5 / 5 · 10K reviews"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {row2.length > 0 && (
        <div className="slider-row-container">
          <div className="row-header">
            <div className="row-title">
              <span>/// Most Played</span>
            </div>
          </div>
          <div
            className="slider-row"
            id="sliderRow2"
            onWheel={handleWheel}
            onMouseDown={(e) => handleMouseDown(e, e.currentTarget)}
            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
            onMouseUp={(e) => handleMouseUp(e.currentTarget)}
            onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
            onTouchStart={(e) => handleTouchStart(e, e.currentTarget)}
            onTouchMove={(e) => handleTouchMove(e, e.currentTarget)}
            onTouchEnd={(e) => handleTouchEnd(e.currentTarget)}
            style={{ cursor: "grab" }}
          >
            <div className="games-horizontal">
              {row2.map((g, index) => (
                <div
                  className={`game-card c${(g.id % 6) + 1} ${selectedGame?.id === g.id ? "active" : ""}`}
                  key={`row2-${g.id}-${index}`}
                  onClick={() => handleGameClick(g)}
                >
                  <div className="game-card-art">
                    {g.art || g.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="game-card-top">
                    <div className="game-platforms">
                      {g.platforms &&
                        g.platforms.map((p) => (
                          <span className="plat" key={p}>
                            {p}
                          </span>
                        ))}
                    </div>
                    <span className={`game-tag ${g.tagClass || ""}`}>
                      {g.tag || "NEW"}
                    </span>
                  </div>
                  <div className="game-card-body">
                    <div className="game-genre">{g.genre || g.category}</div>
                    <div className="game-name">{g.name}</div>
                    <div className="game-desc">{g.description || g.desc}</div>
                    <div className="game-rating">
                      <span className="stars">{g.stars || "★★★★☆"}</span>
                      <span className="rating-val">
                        {g.rating || "4.5 / 5 · 10K reviews"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
