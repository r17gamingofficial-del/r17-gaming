import { useState } from "react";
import "./Leaderboard.css";
import { useAppContext } from "../../Context/AppContext.jsx";

const bars = [
  { label: "Shadow Realm", width: "92%", delay: "0.1s", val: "1.4M" },
  { label: "Cyber Siege", width: "78%", delay: "0.25s", val: "980K" },
  { label: "Neon Strike", width: "63%", delay: "0.4s", val: "820K" },
  { label: "Iron Legion", width: "50%", delay: "0.55s", val: "640K" },
  { label: "Void Protocol", width: "38%", delay: "0.7s", val: "460K" },
  { label: "Phantom Arena", width: "25%", delay: "0.85s", val: "280K" },
];

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

        <div className="lb-chart-panel">
          <div className="lb-chart-title">// Top Games by Active Players</div>
          {bars.map((b) => (
            <div className="bar-row" key={b.label}>
              <div className="bar-label">{b.label}</div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: b.width, animationDelay: b.delay }}
                />
              </div>
              <div className="bar-val">{b.val}</div>
            </div>
          ))}

          <div className="lb-live-stats">
            <div className="lb-chart-title">// Live Right Now</div>
            <div className="lb-live-badges">
              <div className="lb-live-badge live">● 8,420 LIVE</div>
              <div className="lb-live-badge neutral">342 TOURNAMENTS</div>
              <div className="lb-live-badge neutral">14 FINALS TODAY</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
