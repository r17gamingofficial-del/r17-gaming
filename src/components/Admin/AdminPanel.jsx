import { useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import "./AdminPanel.css";

export default function AdminPanel() {
  const {
    tournaments,
    games,
    leaderboard,
    addTournament,
    updateTournament,
    deleteTournament,
    addGame,
    updateGame,
    deleteGame,
    addLeaderboardEntry,
    updateLeaderboardEntry,
    deleteLeaderboardEntry,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState("tournaments");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  // Form states
  const [tournamentForm, setTournamentForm] = useState({
    name: "",
    date: "",
    region: "",
    teams: "",
    prize: "",
    status: "open",
    thumbnail: "",
    videoUrl: "",
    gallery: "",
  });

  // Enhanced Game Form with all featured fields
  const [gameForm, setGameForm] = useState({
    name: "",
    category: "",
    players: "",
    image: "",
    thumbnail: "",
    description: "",
    // Featured section fields
    art: "",
    tag: "NEW",
    tagClass: "",
    platforms: "",
    genre: "",
    stars: "★★★★☆",
    rating: "4.5 / 5 · 10K reviews",
    featuredTitle: "",
    featuredScore: "9.5",
    featuredMeta: "",
    featuredTags: "",
    featuredDesc: "",
    featuredButtonText: "Play Now — Free",
    videoUrl: "",
  });

  const [leaderboardForm, setLeaderboardForm] = useState({
    playerName: "",
    country: "",
    score: "",
    kd: "",
    game: "",
  });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const extractYouTubeId = (url) => {
    if (!url || typeof url !== "string") return null;
    const trimmed = url.trim();
    if (!trimmed) return null;

    // Already an embed link
    const embedMatch = trimmed.match(/youtube\.com\/embed\/([^?&/]+)/i);
    if (embedMatch?.[1]) return embedMatch[1];

    // youtu.be/<id>
    const shortMatch = trimmed.match(/youtu\.be\/([^?&/]+)/i);
    if (shortMatch?.[1]) return shortMatch[1];

    // youtube.com/watch?v=<id> (including m.youtube.com)
    const watchMatch = trimmed.match(/[?&]v=([^?&/]+)/i);
    if (watchMatch?.[1]) return watchMatch[1];

    // youtube.com/shorts/<id>
    const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([^?&/]+)/i);
    if (shortsMatch?.[1]) return shortsMatch[1];

    return null;
  };

  const normalizeTournamentPayload = (form) => {
    const gallery =
      typeof form.gallery === "string"
        ? form.gallery
            .split(",")
            .map((u) => u.trim())
            .filter(Boolean)
        : Array.isArray(form.gallery)
          ? form.gallery
          : [];

    const videoId = extractYouTubeId(form.videoUrl);
    const videoUrl = videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`
      : (form.videoUrl || "").trim();

    return {
      ...form,
      gallery,
      videoUrl,
      thumbnail: (form.thumbnail || "").trim(),
    };
  };

  const handleAddTournament = async () => {
    if (!tournamentForm.name) {
      showMessage("Please fill in tournament name", "error");
      return;
    }

    const created = await addTournament(normalizeTournamentPayload(tournamentForm));
    if (created) {
      showMessage("Tournament added successfully!");
      setTournamentForm({
        name: "",
        date: "",
        region: "",
        teams: "",
        prize: "",
        status: "open",
        thumbnail: "",
        videoUrl: "",
        gallery: "",
      });
      setShowForm(false);
    } else {
      showMessage("Error adding tournament", "error");
    }
  };

  const handleUpdateTournament = async () => {
    const success = await updateTournament(
      editingItem.id,
      normalizeTournamentPayload(tournamentForm),
    );
    if (success) {
      showMessage("Tournament updated successfully!");
      setEditingItem(null);
      setTournamentForm({
        name: "",
        date: "",
        region: "",
        teams: "",
        prize: "",
        status: "open",
        thumbnail: "",
        videoUrl: "",
        gallery: "",
      });
      setShowForm(false);
    } else {
      showMessage("Error updating tournament", "error");
    }
  };

  const handleAddGame = async () => {
    if (!gameForm.name) {
      showMessage("Please fill in game name", "error");
      return;
    }

    // Process arrays from comma-separated strings
    const platforms = gameForm.platforms?.trim()
      ? gameForm.platforms.split(",").map((p) => p.trim())
      : null;
    const featuredMeta = gameForm.featuredMeta?.trim()
      ? gameForm.featuredMeta.split(",").map((m) => m.trim())
      : null;
    const featuredTags = gameForm.featuredTags?.trim()
      ? gameForm.featuredTags.split(",").map((t) => t.trim())
      : null;

    const processedGame = {
      ...gameForm,
      platforms,
      featuredMeta,
      featuredTags,
    };

    const created = await addGame(processedGame);
    if (created) {
      showMessage("Game added successfully!");
      setGameForm({
        name: "",
        category: "",
        players: "",
        image: "",
        thumbnail: "",
        description: "",
        art: "",
        tag: "NEW",
        tagClass: "",
        platforms: "",
        genre: "",
        stars: "★★★★☆",
        rating: "4.5 / 5 · 10K reviews",
        featuredTitle: "",
        featuredScore: "9.5",
        featuredMeta: "",
        featuredTags: "",
        featuredDesc: "",
        featuredButtonText: "Play Now — Free",
        videoUrl: "",
      });
      setShowForm(false);
    } else {
      showMessage("Error adding game", "error");
    }
  };

  const handleUpdateGame = async () => {
    // Process arrays from comma-separated strings
    const platforms = gameForm.platforms?.trim()
      ? gameForm.platforms.split(",").map((p) => p.trim())
      : null;
    const featuredMeta = gameForm.featuredMeta?.trim()
      ? gameForm.featuredMeta.split(",").map((m) => m.trim())
      : null;
    const featuredTags = gameForm.featuredTags?.trim()
      ? gameForm.featuredTags.split(",").map((t) => t.trim())
      : null;

    const processedGame = {
      ...gameForm,
      platforms,
      featuredMeta,
      featuredTags,
    };

    const success = await updateGame(editingItem.id, processedGame);
    if (success) {
      showMessage("Game updated successfully!");
      setEditingItem(null);
      setGameForm({
        name: "",
        category: "",
        players: "",
        image: "",
        thumbnail: "",
        description: "",
        art: "",
        tag: "NEW",
        tagClass: "",
        platforms: "",
        genre: "",
        stars: "★★★★☆",
        rating: "4.5 / 5 · 10K reviews",
        featuredTitle: "",
        featuredScore: "9.5",
        featuredMeta: "",
        featuredTags: "",
        featuredDesc: "",
        featuredButtonText: "Play Now — Free",
        videoUrl: "",
      });
      setShowForm(false);
    } else {
      showMessage("Error updating game", "error");
    }
  };

  const handleAddLeaderboardEntry = async () => {
    if (!leaderboardForm.playerName) {
      showMessage("Please fill in player name", "error");
      return;
    }

    const created = await addLeaderboardEntry(leaderboardForm);
    if (created) {
      showMessage("Leaderboard entry added successfully!");
      setLeaderboardForm({
        playerName: "",
        country: "",
        score: "",
        kd: "",
        game: "",
      });
      setShowForm(false);
    } else {
      showMessage("Error adding leaderboard entry", "error");
    }
  };

  const handleUpdateLeaderboardEntry = async () => {
    const success = await updateLeaderboardEntry(editingItem.id, leaderboardForm);
    if (success) {
      showMessage("Leaderboard entry updated successfully!");
      setEditingItem(null);
      setLeaderboardForm({
        playerName: "",
        country: "",
        score: "",
        kd: "",
        game: "",
      });
      setShowForm(false);
    } else {
      showMessage("Error updating leaderboard entry", "error");
    }
  };

  const handleDelete = async (id, type, deleteFunction) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      const success = await deleteFunction(id);
      if (success) {
        showMessage(`${type} deleted successfully!`);
      } else {
        showMessage(`Error deleting ${type}`, "error");
      }
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
        thumbnail: item.thumbnail || item.image || "",
        videoUrl: item.videoUrl || "",
        gallery: item.gallery
          ? Array.isArray(item.gallery)
            ? item.gallery.join(", ")
            : item.gallery
          : "",
      });
    } else if (type === "games") {
      setGameForm({
        name: item.name || "",
        category: item.category || "",
        players: item.players || "",
        image: item.image || "",
        thumbnail: item.thumbnail || "",
        description: item.description || "",
        art: item.art || "",
        tag: item.tag || "NEW",
        tagClass: item.tagClass || "",
        platforms: item.platforms
          ? Array.isArray(item.platforms)
            ? item.platforms.join(", ")
            : item.platforms
          : "",
        genre: item.genre || "",
        stars: item.stars || "★★★★☆",
        rating: item.rating || "4.5 / 5 · 10K reviews",
        featuredTitle: item.featuredTitle || "",
        featuredScore: item.featuredScore || "9.5",
        featuredMeta: item.featuredMeta
          ? Array.isArray(item.featuredMeta)
            ? item.featuredMeta.join(", ")
            : item.featuredMeta
          : "",
        featuredTags: item.featuredTags
          ? Array.isArray(item.featuredTags)
            ? item.featuredTags.join(", ")
            : item.featuredTags
          : "",
        featuredDesc: item.featuredDesc || "",
        featuredButtonText: item.featuredButtonText || "Play Now — Free",
        videoUrl: item.videoUrl || "",
      });
    } else if (type === "leaderboard") {
      setLeaderboardForm({
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
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
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
          🏆 Tournaments ({tournaments.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "games" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("games");
            setShowForm(false);
            setSearchTerm("");
          }}
        >
          🎮 Games ({games.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "leaderboard" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("leaderboard");
            setShowForm(false);
            setSearchTerm("");
          }}
        >
          📊 Leaderboard ({leaderboard.length})
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
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (editingItem) {
                      await handleUpdateTournament();
                      return;
                    }
                    await handleAddTournament();
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
                    placeholder="Region (e.g., 🌍 Global)"
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
                  <h4 style={{ color: "#ff6b6b", margin: "1rem 0 0.5rem" }}>
                    Media
                  </h4>
                  <input
                    type="text"
                    placeholder="Card Image URL (used in main tournament card)"
                    value={tournamentForm.thumbnail}
                    onChange={(e) =>
                      setTournamentForm({
                        ...tournamentForm,
                        thumbnail: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Video URL (YouTube embed link recommended)"
                    value={tournamentForm.videoUrl}
                    onChange={(e) =>
                      setTournamentForm({
                        ...tournamentForm,
                        videoUrl: e.target.value,
                      })
                    }
                  />
                  <textarea
                    placeholder="Tournament Highlights (comma-separated image URLs)"
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
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (editingItem) {
                      await handleUpdateGame();
                      return;
                    }
                    await handleAddGame();
                  }}
                >
                  <h4 style={{ color: "#ff6b6b", marginBottom: "0.5rem" }}>
                    Basic Information
                  </h4>
                  <input
                    type="text"
                    placeholder="Game Name *"
                    value={gameForm.name}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, name: e.target.value })
                    }
                    required
                  />
                  {/* <input
                    type="text"
                    placeholder="Game Art (2 letters, e.g., SR)"
                    value={gameForm.art}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, art: e.target.value })
                    }
                  /> */}
                  <input
                    type="text"
                    placeholder="Thumbnail URL (for game cards + featured poster)"
                    value={gameForm.thumbnail}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, thumbnail: e.target.value })
                    }
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
                    placeholder="Genre (e.g., Tactical FPS, Battle Royale)"
                    value={gameForm.genre}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, genre: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Description"
                    value={gameForm.description}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, description: e.target.value })
                    }
                    rows="2"
                    required
                  />

                  <h4 style={{ color: "#ff6b6b", margin: "1rem 0 0.5rem" }}>
                    Game Card Styling
                  </h4>
                  <input
                    type="text"
                    placeholder="Tag (e.g., HOT, NEW, FREE, PRO)"
                    value={gameForm.tag}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, tag: e.target.value })
                    }
                  />
                  <select
                    value={gameForm.tagClass}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, tagClass: e.target.value })
                    }
                  >
                    <option value="">Default Tag Style</option>
                    <option value="gold-tag">Gold Tag (HOT)</option>
                    <option value="blue-tag">Blue Tag (NEW)</option>
                    <option value="green-tag">Green Tag (FREE)</option>
                    <option value="purple-tag">Purple Tag (PRO)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Platforms (comma-separated, e.g., PC, PS5, XSX, Mobile)"
                    value={gameForm.platforms}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, platforms: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Stars (e.g., ★★★★★, ★★★★☆)"
                    value={gameForm.stars}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, stars: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Rating (e.g., 4.9 / 5 · 120K reviews)"
                    value={gameForm.rating}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, rating: e.target.value })
                    }
                  />

                  <h4 style={{ color: "#ff6b6b", margin: "1rem 0 0.5rem" }}>
                    Featured Section (Editor's Pick)
                  </h4>
                  <input
                    type="text"
                    placeholder="Featured Title (e.g., SHADOW REALM X)"
                    value={gameForm.featuredTitle}
                    onChange={(e) =>
                      setGameForm({
                        ...gameForm,
                        featuredTitle: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Featured Score (e.g., 9.8)"
                    value={gameForm.featuredScore}
                    onChange={(e) =>
                      setGameForm({
                        ...gameForm,
                        featuredScore: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Featured Meta (comma-separated, e.g., 🎮 Tactical FPS, 👥 5v5, 🏆 $500K Prize Pool)"
                    value={gameForm.featuredMeta}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, featuredMeta: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Featured Tags (comma-separated, e.g., Season 6 Live, 128-Tick Servers, Anti-Cheat)"
                    value={gameForm.featuredTags}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, featuredTags: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Featured Description"
                    value={gameForm.featuredDesc}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, featuredDesc: e.target.value })
                    }
                    rows="3"
                  />
                  <input
                    type="text"
                    placeholder="Featured Button Text (e.g., Play Now — Free)"
                    value={gameForm.featuredButtonText}
                    onChange={(e) =>
                      setGameForm({
                        ...gameForm,
                        featuredButtonText: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Video URL (YouTube embed, e.g., https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&loop=1)"
                    value={gameForm.videoUrl}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, videoUrl: e.target.value })
                    }
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
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (editingItem) {
                      await handleUpdateLeaderboardEntry();
                      return;
                    }
                    await handleAddLeaderboardEntry();
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
                {filteredTournaments.length > 0 ? (
                  filteredTournaments.map((tournament) => (
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
                          onClick={() =>
                            handleDelete(
                              tournament.id,
                              "tournament",
                              deleteTournament,
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No tournaments found
                    </td>
                  </tr>
                )}
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
                  <th>Genre</th>
                  <th>Active Players</th>
                  <th>Platforms</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.length > 0 ? (
                  filteredGames.map((game) => (
                    <tr key={game.id}>
                      <td>{game.name}</td>
                      <td>{game.category}</td>
                      <td>{game.genre || game.category}</td>
                      <td>{game.players}</td>
                      <td>
                        {game.platforms ? game.platforms.join(", ") : "-"}
                      </td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(game, "games")}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() =>
                            handleDelete(game.id, "game", deleteGame)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No games found
                    </td>
                  </tr>
                )}
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
                {filteredLeaderboard.length > 0 ? (
                  filteredLeaderboard.map((entry) => (
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
                          onClick={() =>
                            handleDelete(
                              entry.id,
                              "player",
                              deleteLeaderboardEntry,
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No leaderboard entries found
                    </td>
                  </tr>
                )}
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
