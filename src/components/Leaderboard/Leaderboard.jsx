import { useState } from "react";
import "./Leaderboard.css";
import { useAppContext } from "../../Context/AppContext.jsx";


export default function Leaderboard() {
  const { leaderboard: players, loading } = useAppContext();
  const [searchGame, setSearchGame] = useState("");
  const [selectedGame, setSelectedGame] = useState("all");

  // Get unique games for filter
  const games = ["all", ...new Set(players.map((p) => p.game))];

  // Filter players based on search and selected game
  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.game.toLowerCase().includes(searchGame.toLowerCase()) ||
      player.playerName.toLowerCase().includes(searchGame.toLowerCase());
    const matchesGame = selectedGame === "all" || player.game === selectedGame;
    return matchesSearch && matchesGame;
  });

  return (
    <section id="leaderboard">
      <div className="reveal">
        <div className="section-label">Rankings</div>
        <h2 className="section-title">GLOBAL LEADERBOARD</h2>
        <p className="section-sub">The best of the best. Where do you stand?</p>
      </div>

      <div className="lb-grid reveal">
        <div className="lb-left-panel">
          {/* Search and Filter Section */}
          <div className="lb-search-section">
            <div className="lb-search-bar">
              <input
                type="text"
                placeholder="🔍 Search by player name or game..."
                value={searchGame}
                onChange={(e) => setSearchGame(e.target.value)}
              />
            </div>
            <div className="lb-filter-group">
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="lb-game-filter"
              >
                {games.map((game) => (
                  <option key={game} value={game}>
                    {game === "all" ? "All Games" : game}
                  </option>
                ))}
              </select>
            </div>
            {(searchGame || selectedGame !== "all") && (
              <div className="lb-filter-stats">
                Showing {filteredPlayers.length} of {players.length} players
                <button
                  className="lb-clear-filter"
                  onClick={() => {
                    setSearchGame("");
                    setSelectedGame("all");
                  }}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Leaderboard Table */}
          <div className="lb-table-container">
            <table className="lb-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Game</th>
                  <th>Score</th>
                  <th>K/D</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map((p) => (
                    <tr key={p.id || p.rank} className="lb-player-row">
                      <td className="lb-rank">{p.rank}</td>
                      <td>
                        <div className="lb-player">
                          <div className="lb-avatar av1">
                            {(p.playerName || "?").slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <div className="lb-name">{p.playerName}</div>
                            <div className="lb-country">{p.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="lb-game">
                        <span className="lb-game-badge">{p.game}</span>
                      </td>
                      <td className="lb-score">{p.score}</td>
                      <td className="lb-kd">{p.kd}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="lb-no-results">
                      <div className="lb-no-results-content">
                        <span>🎮</span>
                        <p>
                          {loading
                            ? "Loading leaderboard..."
                            : `No players found for "${searchGame || selectedGame}"`}
                        </p>
                        <button
                          onClick={() => {
                            setSearchGame("");
                            setSelectedGame("all");
                          }}
                        >
                          Show all players
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
