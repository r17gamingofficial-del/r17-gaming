import { useState, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import "./AdminPanel.css";

export default function AdminPanel() {
  const {
    tournaments,
    games,
    leaderboard,
    hero,
    addTournament,
    updateTournament,
    deleteTournament,
    addGame,
    updateGame,
    deleteGame,
    addLeaderboardEntry,
    updateLeaderboardEntry,
    deleteLeaderboardEntry,
    updateHero,
    communityPosts,
    addCommunityPost,
    updateCommunityPost,
    deleteCommunityPost,
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
    registerUrl: "",
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

  const [communityForm, setCommunityForm] = useState({
    stars: "★★★★★",
    av: "ra1",
    letter: "",
    name: "",
    handle: "",
    text: "",
  });

  const [heroForm, setHeroForm] = useState(null);

  useEffect(() => {
    if (!hero) return;
    const statTemplate = [
      { main: "4.2", inner: "M", label: "Active Players" },
      { main: "$", inner: "2.8M", label: "Prize Pool" },
      { main: "340", inner: "+", label: "Tournaments" },
      { main: "18", inner: "+", label: "Game Titles" },
    ];
    const stats = statTemplate.map((t, i) => {
      const s = hero.stats?.[i];
      return {
        main: s?.main ?? t.main,
        inner: s?.inner ?? t.inner,
        label: s?.label ?? t.label,
      };
    });
    setHeroForm({
      backgroundMode: hero.backgroundMode === "image" ? "image" : "youtube",
      backgroundImageUrl: hero.backgroundImageUrl || "",
      youtubeVideoUrl: hero.youtubeVideoId
        ? `https://www.youtube.com/watch?v=${hero.youtubeVideoId}`
        : "",
      titleGlitch: hero.titleGlitch || "",
      titlePrefix: hero.titlePrefix ?? "THE ",
      titleAccent: hero.titleAccent || "",
      subtitle: hero.subtitle || "",
      stats,
    });
  }, [hero]);

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
      registerUrl: (form.registerUrl || "").trim(),
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
        registerUrl: "",
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
        registerUrl: "",
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
        registerUrl: item.registerUrl || "",
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
    } else if (type === "community") {
      setCommunityForm({
        stars: item.stars || "★★★★★",
        av: item.av || "ra1",
        letter: item.letter || "",
        name: item.name || "",
        handle: item.handle || "",
        text: item.text || "",
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

  const filteredCommunity = (communityPosts || []).filter(
    (p) =>
      (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.text || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddCommunityPost = async () => {
    if (!communityForm.name?.trim()) {
      showMessage("Please fill in display name", "error");
      return;
    }
    if (!communityForm.text?.trim()) {
      showMessage("Please fill in review text", "error");
      return;
    }
    const created = await addCommunityPost({
      stars: communityForm.stars,
      av: communityForm.av,
      letter: (communityForm.letter || "?").slice(0, 1),
      name: communityForm.name.trim(),
      handle: communityForm.handle.trim(),
      text: communityForm.text.trim(),
    });
    if (created) {
      showMessage("Community post added!");
      setCommunityForm({
        stars: "★★★★★",
        av: "ra1",
        letter: "",
        name: "",
        handle: "",
        text: "",
      });
      setShowForm(false);
    } else {
      showMessage("Error adding post", "error");
    }
  };

  const handleUpdateCommunityPost = async () => {
    const payload = {
      stars: communityForm.stars,
      av: communityForm.av,
      letter: (communityForm.letter || "?").slice(0, 1),
      name: communityForm.name.trim(),
      handle: communityForm.handle.trim(),
      text: communityForm.text.trim(),
    };
    const success = await updateCommunityPost(editingItem.id, payload);
    if (success) {
      showMessage("Community post updated!");
      setEditingItem(null);
      setCommunityForm({
        stars: "★★★★★",
        av: "ra1",
        letter: "",
        name: "",
        handle: "",
        text: "",
      });
      setShowForm(false);
    } else {
      showMessage("Error updating post", "error");
    }
  };

  const handleSaveHero = async () => {
    if (!heroForm) return;
    const vid = extractYouTubeId(heroForm.youtubeVideoUrl);
    const youtubeVideoId =
      vid || hero?.youtubeVideoId || "EZMYvAWbyLo";
    const ok = await updateHero({
      backgroundMode: heroForm.backgroundMode,
      backgroundImageUrl: heroForm.backgroundImageUrl.trim(),
      youtubeVideoId,
      titleGlitch: heroForm.titleGlitch.trim(),
      titlePrefix: heroForm.titlePrefix,
      titleAccent: heroForm.titleAccent.trim(),
      subtitle: heroForm.subtitle.trim(),
      stats: heroForm.stats.map((s) => ({
        main: (s.main || "").trim(),
        inner: (s.inner || "").trim(),
        label: (s.label || "").trim(),
      })),
    });
    if (ok) showMessage("Hero section saved!");
    else showMessage("Error saving hero", "error");
  };

  const updateHeroStat = (index, field, value) => {
    setHeroForm((prev) => {
      if (!prev) return prev;
      const stats = prev.stats.map((row, i) =>
        i === index ? { ...row, [field]: value } : row,
      );
      return { ...prev, stats };
    });
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🎮 Admin Dashboard</h1>
        <p>Manage tournaments, games, leaderboard, community, and hero</p>
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
        <button
          className={`tab-btn ${activeTab === "community" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("community");
            setShowForm(false);
            setSearchTerm("");
          }}
        >
          💬 Community ({communityPosts?.length ?? 0})
        </button>
        <button
          className={`tab-btn ${activeTab === "hero" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("hero");
            setShowForm(false);
            setSearchTerm("");
          }}
        >
          🎯 Hero
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "hero" && heroForm && (
          <div className="hero-admin-card">
            <h3 className="hero-admin-title">Hero section (homepage)</h3>
            <p className="hero-admin-hint">
              Background: YouTube uses an embed-friendly URL (watch / youtu.be
              links are converted). Image mode uses a full-bleed cover URL.
            </p>
            <div className="hero-admin-grid">
              <label className="hero-admin-label">
                Background type
                <select
                  value={heroForm.backgroundMode}
                  onChange={(e) =>
                    setHeroForm({
                      ...heroForm,
                      backgroundMode: e.target.value,
                    })
                  }
                >
                  <option value="youtube">YouTube video</option>
                  <option value="image">Image URL</option>
                </select>
              </label>
              {heroForm.backgroundMode === "image" ? (
                <label className="hero-admin-label hero-admin-span-2">
                  Hero background image URL
                  <input
                    type="text"
                    value={heroForm.backgroundImageUrl}
                    onChange={(e) =>
                      setHeroForm({
                        ...heroForm,
                        backgroundImageUrl: e.target.value,
                      })
                    }
                    placeholder="https://…"
                  />
                </label>
              ) : (
                <label className="hero-admin-label hero-admin-span-2">
                  YouTube video (any watch / embed / youtu.be URL)
                  <input
                    type="text"
                    value={heroForm.youtubeVideoUrl}
                    onChange={(e) =>
                      setHeroForm({
                        ...heroForm,
                        youtubeVideoUrl: e.target.value,
                      })
                    }
                    placeholder="https://www.youtube.com/watch?v=…"
                  />
                </label>
              )}
              <label className="hero-admin-label">
                Title (glitch line)
                <input
                  type="text"
                  value={heroForm.titleGlitch}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, titleGlitch: e.target.value })
                  }
                />
              </label>
              <label className="hero-admin-label">
                Title prefix (e.g. &quot;THE &quot;)
                <input
                  type="text"
                  value={heroForm.titlePrefix}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, titlePrefix: e.target.value })
                  }
                />
              </label>
              <label className="hero-admin-label">
                Title accent (e.g. ARENA)
                <input
                  type="text"
                  value={heroForm.titleAccent}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, titleAccent: e.target.value })
                  }
                />
              </label>
              <label className="hero-admin-label hero-admin-span-3">
                Subtitle
                <textarea
                  rows={3}
                  value={heroForm.subtitle}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, subtitle: e.target.value })
                  }
                />
              </label>
            </div>
            <h4 className="hero-admin-stats-heading">Hero stats (4 columns)</h4>
            <div className="hero-admin-stats">
              {heroForm.stats.map((row, i) => (
                <div className="hero-admin-stat-row" key={i}>
                  <span className="hero-admin-stat-num">#{i + 1}</span>
                  <input
                    placeholder="Main (e.g. 4.2)"
                    value={row.main}
                    onChange={(e) => updateHeroStat(i, "main", e.target.value)}
                  />
                  <input
                    placeholder="Highlight (e.g. M)"
                    value={row.inner}
                    onChange={(e) => updateHeroStat(i, "inner", e.target.value)}
                  />
                  <input
                    placeholder="Label"
                    value={row.label}
                    onChange={(e) => updateHeroStat(i, "label", e.target.value)}
                  />
                </div>
              ))}
            </div>
            <button type="button" className="btn-save hero-admin-save" onClick={handleSaveHero}>
              Save hero
            </button>
          </div>
        )}

        {activeTab === "hero" && !heroForm ? (
          <p className="no-data">Loading hero settings…</p>
        ) : null}

        {activeTab !== "hero" ? (
          <>
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
                  <input
                    type="url"
                    placeholder="Registration link (opens when users click Register)"
                    value={tournamentForm.registerUrl}
                    onChange={(e) =>
                      setTournamentForm({
                        ...tournamentForm,
                        registerUrl: e.target.value,
                      })
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

              {activeTab === "community" && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (editingItem) {
                      await handleUpdateCommunityPost();
                      return;
                    }
                    await handleAddCommunityPost();
                  }}
                >
                  <h4 style={{ color: "#ff6b6b", marginBottom: "0.5rem" }}>
                    Review card (What Players Say)
                  </h4>
                  <select
                    value={communityForm.stars}
                    onChange={(e) =>
                      setCommunityForm({
                        ...communityForm,
                        stars: e.target.value,
                      })
                    }
                  >
                    <option value="★★★★★">★★★★★ (5)</option>
                    <option value="★★★★☆">★★★★☆ (4)</option>
                    <option value="★★★☆☆">★★★☆☆ (3)</option>
                    <option value="★★☆☆☆">★★☆☆☆ (2)</option>
                    <option value="★☆☆☆☆">★☆☆☆☆ (1)</option>
                  </select>
                  <select
                    value={communityForm.av}
                    onChange={(e) =>
                      setCommunityForm({
                        ...communityForm,
                        av: e.target.value,
                      })
                    }
                  >
                    <option value="ra1">Avatar style 1</option>
                    <option value="ra2">Avatar style 2</option>
                    <option value="ra3">Avatar style 3</option>
                    <option value="ra4">Avatar style 4</option>
                    <option value="ra5">Avatar style 5</option>
                    <option value="ra6">Avatar style 6</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Avatar letter (one character)"
                    maxLength={1}
                    value={communityForm.letter}
                    onChange={(e) =>
                      setCommunityForm({
                        ...communityForm,
                        letter: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Display name"
                    value={communityForm.name}
                    onChange={(e) =>
                      setCommunityForm({
                        ...communityForm,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Handle (e.g. @user · Game)"
                    value={communityForm.handle}
                    onChange={(e) =>
                      setCommunityForm({
                        ...communityForm,
                        handle: e.target.value,
                      })
                    }
                  />
                  <textarea
                    placeholder="Review text"
                    value={communityForm.text}
                    onChange={(e) =>
                      setCommunityForm({
                        ...communityForm,
                        text: e.target.value,
                      })
                    }
                    rows={4}
                    required
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
                  <th>Register link</th>
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
                        {tournament.registerUrl?.trim() ? (
                          <span className="tournament-has-link" title={tournament.registerUrl}>
                            ✓ Set
                          </span>
                        ) : (
                          <span className="tournament-no-link">—</span>
                        )}
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
                    <td colSpan="8" className="no-data">
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

        {activeTab === "community" && (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Stars</th>
                  <th>Name</th>
                  <th>Handle</th>
                  <th>Preview</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommunity.length > 0 ? (
                  filteredCommunity.map((post) => (
                    <tr key={post.id}>
                      <td>{post.stars}</td>
                      <td>{post.name}</td>
                      <td>{post.handle}</td>
                      <td className="community-preview-cell">
                        {(post.text || "").slice(0, 80)}
                        {(post.text || "").length > 80 ? "…" : ""}
                      </td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(post, "community")}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() =>
                            handleDelete(
                              post.id,
                              "post",
                              deleteCommunityPost,
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
                    <td colSpan="5" className="no-data">
                      No community posts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
          </>
        ) : null}
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
