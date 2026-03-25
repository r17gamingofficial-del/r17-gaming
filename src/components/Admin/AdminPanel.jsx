import { useState, useEffect } from "react";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("tournaments");
  const [tournaments, setTournaments] = useState([]);
  const [games, setGames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states for tournaments
  const [tournamentForm, setTournamentForm] = useState({
    name: "",
    date: "",
    region: "",
    teams: "",
    prize: "",
    status: "open",
    image: "",
    gallery: [],
  });

  // Form states for games
  const [gameForm, setGameForm] = useState({
    name: "",
    category: "",
    players: "",
    image: "",
    description: "",
  });

  // Form states for leaderboard
  const [leaderboardForm, setLeaderboardForm] = useState({
    rank: "",
    playerName: "",
    country: "",
    score: "",
    kd: "",
    game: "",
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTournaments = localStorage.getItem("admin_tournaments");
    const savedGames = localStorage.getItem("admin_games");
    const savedLeaderboard = localStorage.getItem("admin_leaderboard");

    if (savedTournaments) setTournaments(JSON.parse(savedTournaments));
    if (savedGames) setGames(JSON.parse(savedGames));
    if (savedLeaderboard) setLeaderboard(JSON.parse(savedLeaderboard));
  }, []);

  // Save data to localStorage
  const saveData = () => {
    localStorage.setItem("admin_tournaments", JSON.stringify(tournaments));
    localStorage.setItem("admin_games", JSON.stringify(games));
    localStorage.setItem("admin_leaderboard", JSON.stringify(leaderboard));
  };

  // Tournament CRUD Operations
  const addTournament = () => {
    if (!tournamentForm.name) return;

    const newTournament = {
      id: Date.now(),
      rank: String(tournaments.length + 1).padStart(2, "0"),
      ...tournamentForm,
      gallery: tournamentForm.gallery.length
        ? tournamentForm.gallery.split(",").map((url) => url.trim())
        : [],
    };

    setTournaments([...tournaments, newTournament]);
    setTournamentForm({
      name: "",
      date: "",
      region: "",
      teams: "",
      prize: "",
      status: "open",
      image: "",
      gallery: [],
    });
    setShowForm(false);
    saveData();
  };

  const updateTournament = () => {
    const updatedTournaments = tournaments.map((t) =>
      t.id === editingItem.id ? { ...editingItem, ...tournamentForm } : t,
    );
    setTournaments(updatedTournaments);
    setEditingItem(null);
    setTournamentForm({
      name: "",
      date: "",
      region: "",
      teams: "",
      prize: "",
      status: "open",
      image: "",
      gallery: [],
    });
    setShowForm(false);
    saveData();
  };

  const deleteTournament = (id) => {
    if (window.confirm("Are you sure you want to delete this tournament?")) {
      const updatedTournaments = tournaments.filter((t) => t.id !== id);
      setTournaments(updatedTournaments);
      saveData();
    }
  };

  // Game CRUD Operations
  const addGame = () => {
    if (!gameForm.name) return;

    const newGame = {
      id: Date.now(),
      ...gameForm,
    };

    setGames([...games, newGame]);
    setGameForm({
      name: "",
      category: "",
      players: "",
      image: "",
      description: "",
    });
    setShowForm(false);
    saveData();
  };

  const updateGame = () => {
    const updatedGames = games.map((g) =>
      g.id === editingItem.id ? { ...editingItem, ...gameForm } : g,
    );
    setGames(updatedGames);
    setEditingItem(null);
    setGameForm({
      name: "",
      category: "",
      players: "",
      image: "",
      description: "",
    });
    setShowForm(false);
    saveData();
  };

  const deleteGame = (id) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      const updatedGames = games.filter((g) => g.id !== id);
      setGames(updatedGames);
      saveData();
    }
  };

  // Leaderboard CRUD Operations
  const addLeaderboardEntry = () => {
    if (!leaderboardForm.playerName) return;

    const newEntry = {
      id: Date.now(),
      rank: String(leaderboard.length + 1).padStart(2, "0"),
      ...leaderboardForm,
    };

    setLeaderboard([...leaderboard, newEntry]);
    setLeaderboardForm({
      rank: "",
      playerName: "",
      country: "",
      score: "",
      kd: "",
      game: "",
    });
    setShowForm(false);
    saveData();
  };

  const updateLeaderboardEntry = () => {
    const updatedLeaderboard = leaderboard.map((l) =>
      l.id === editingItem.id ? { ...editingItem, ...leaderboardForm } : l,
    );
    setLeaderboard(updatedLeaderboard);
    setEditingItem(null);
    setLeaderboardForm({
      rank: "",
      playerName: "",
      country: "",
      score: "",
      kd: "",
      game: "",
    });
    setShowForm(false);
    saveData();
  };

  const deleteLeaderboardEntry = (id) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      const updatedLeaderboard = leaderboard.filter((l) => l.id !== id);
      setLeaderboard(updatedLeaderboard);
      saveData();
    }
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setShowForm(true);

    if (type === "tournaments") {
      setTournamentForm({
        name: item.name,
        date: item.date,
        region: item.region,
        teams: item.teams,
        prize: item.prize,
        status: item.status,
        image: item.image || "",
        gallery: item.gallery ? item.gallery.join(", ") : "",
      });
    } else if (type === "games") {
      setGameForm({
        name: item.name,
        category: item.category,
        players: item.players,
        image: item.image,
        description: item.description,
      });
    } else if (type === "leaderboard") {
      setLeaderboardForm({
        rank: item.rank,
        playerName: item.playerName,
        country: item.country,
        score: item.score,
        kd: item.kd,
        game: item.game,
      });
    }
  };

  const filteredTournaments = tournaments.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredGames = games.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredLeaderboard = leaderboard.filter((l) =>
    l.playerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🎮 Admin Dashboard</h1>
        <p>Manage tournaments, games, and leaderboards</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "tournaments" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("tournaments");
            setShowForm(false);
            setSearchTerm("");
          }}
        >
          🏆 Tournaments
        </button>
        <button
          className={`tab-btn ${activeTab === "games" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("games");
            setShowForm(false);
            setSearchTerm("");
          }}
        >
          🎮 Games
        </button>
        <button
          className={`tab-btn ${activeTab === "leaderboard" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("leaderboard");
            setShowForm(false);
            setSearchTerm("");
          }}
        >
          📊 Leaderboard
        </button>
      </div>

      <div className="admin-content">
        <div className="admin-actions">
          <div className="search-bar">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {!showForm && (
            <button className="btn-add" onClick={() => setShowForm(true)}>
              + Add New
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-modal">
            <div className="form-container">
              <h3>
                {editingItem ? "Edit" : "Add New"} {activeTab.slice(0, -1)}
              </h3>

              {activeTab === "tournaments" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    editingItem ? updateTournament() : addTournament();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Tournament Name"
                    value={tournamentForm.name}
                    onChange={(e) =>
                      setTournamentForm({
                        ...tournamentForm,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Date (e.g., Dec 15–20, 2025)"
                    value={tournamentForm.date}
                    onChange={(e) =>
                      setTournamentForm({
                        ...tournamentForm,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Region"
                    value={tournamentForm.region}
                    onChange={(e) =>
                      setTournamentForm({
                        ...tournamentForm,
                        region: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Teams (e.g., 128 Teams)"
                    value={tournamentForm.teams}
                    onChange={(e) =>
                      setTournamentForm({
                        ...tournamentForm,
                        teams: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Prize Pool (e.g., $500,000)"
                    value={tournamentForm.prize}
                    onChange={(e) =>
                      setTournamentForm({
                        ...tournamentForm,
                        prize: e.target.value,
                      })
                    }
                    required
                  />
                  <select
                    value={tournamentForm.status}
                    onChange={(e) =>
                      setTournamentForm({
                        ...tournamentForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="live">Live</option>
                    <option value="soon">Soon</option>
                    <option value="open">Open</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={tournamentForm.image}
                    onChange={(e) =>
                      setTournamentForm({
                        ...tournamentForm,
                        image: e.target.value,
                      })
                    }
                  />
                  <textarea
                    placeholder="Gallery Images (comma-separated URLs)"
                    value={tournamentForm.gallery}
                    onChange={(e) =>
                      setTournamentForm({
                        ...tournamentForm,
                        gallery: e.target.value,
                      })
                    }
                    rows="3"
                  />
                  <div className="form-actions">
                    <button type="submit" className="btn-save">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setShowForm(false);
                        setEditingItem(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "games" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    editingItem ? updateGame() : addGame();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Game Name"
                    value={gameForm.name}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g., FPS, MOBA, Battle Royale)"
                    value={gameForm.category}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, category: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Active Players (e.g., 4.2M)"
                    value={gameForm.players}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, players: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={gameForm.image}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, image: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Description"
                    value={gameForm.description}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, description: e.target.value })
                    }
                    rows="3"
                  />
                  <div className="form-actions">
                    <button type="submit" className="btn-save">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setShowForm(false);
                        setEditingItem(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "leaderboard" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    editingItem
                      ? updateLeaderboardEntry()
                      : addLeaderboardEntry();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Player Name"
                    value={leaderboardForm.playerName}
                    onChange={(e) =>
                      setLeaderboardForm({
                        ...leaderboardForm,
                        playerName: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Country (e.g., 🇰🇷 South Korea)"
                    value={leaderboardForm.country}
                    onChange={(e) =>
                      setLeaderboardForm({
                        ...leaderboardForm,
                        country: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Score (e.g., 98,420)"
                    value={leaderboardForm.score}
                    onChange={(e) =>
                      setLeaderboardForm({
                        ...leaderboardForm,
                        score: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="K/D Ratio (e.g., 4.8)"
                    value={leaderboardForm.kd}
                    onChange={(e) =>
                      setLeaderboardForm({
                        ...leaderboardForm,
                        kd: e.target.value,
                      })
                    }
                    required
                  />
                  <select
                    value={leaderboardForm.game}
                    onChange={(e) =>
                      setLeaderboardForm({
                        ...leaderboardForm,
                        game: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Game</option>
                    {games.map((game) => (
                      <option key={game.id} value={game.name}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                  <div className="form-actions">
                    <button type="submit" className="btn-save">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setShowForm(false);
                        setEditingItem(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === "tournaments" && (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tournament Name</th>
                  <th>Date</th>
                  <th>Region</th>
                  <th>Prize</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTournaments.map((tournament) => (
                  <tr key={tournament.id}>
                    <td>{tournament.rank}</td>
                    <td>{tournament.name}</td>
                    <td>{tournament.date}</td>
                    <td>{tournament.region}</td>
                    <td>{tournament.prize}</td>
                    <td>
                      <span
                        className={`status-badge status-${tournament.status}`}
                      >
                        {tournament.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(tournament, "tournaments")}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => deleteTournament(tournament.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "games" && (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Game Name</th>
                  <th>Category</th>
                  <th>Active Players</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((game) => (
                  <tr key={game.id}>
                    <td>{game.name}</td>
                    <td>{game.category}</td>
                    <td>{game.players}</td>
                    <td>{game.description}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(game, "games")}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => deleteGame(game.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player Name</th>
                  <th>Country</th>
                  <th>Score</th>
                  <th>K/D</th>
                  <th>Game</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaderboard.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.rank}</td>
                    <td>{entry.playerName}</td>
                    <td>{entry.country}</td>
                    <td>{entry.score}</td>
                    <td>{entry.kd}</td>
                    <td>{entry.game}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(entry, "leaderboard")}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => deleteLeaderboardEntry(entry.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Tournaments</h3>
          <p className="stat-number">{tournaments.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Games</h3>
          <p className="stat-number">{games.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Players</h3>
          <p className="stat-number">{leaderboard.length}</p>
        </div>
      </div>
    </div>
  );
}
