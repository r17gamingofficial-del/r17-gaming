import { useState, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import Marquee from "../Marquee/Marquee";
import "./AdminPanel.css";
import LogoR17 from "../../../public/assets/LogoR17.png";
import { uploadImage } from "../../Firebase/storageService";


export default function AdminPanel() {
  const {
    tournaments,
    teams,
    games,
    leaderboard,
    hero,
    users,
    addTeam,
    updateTeam,
    deleteTeam,
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
    marquee,
    updateMarquee,
    communityPosts,
    addCommunityPost,
    updateCommunityPost,
    deleteCommunityPost,
    adminComments,
    addAdminComment,
    updateAdminComment,
    deleteAdminComment,
    blockUser,
    unblockUser,
    deleteUser,
    announcementSlides,
    addAnnouncementSlide,
    updateAnnouncementSlide,
    deleteAnnouncementSlide,
  } = useAppContext();


  const [activeTab, setActiveTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Form states
  const [tournamentForm, setTournamentForm] = useState({
    name: "",
    date: "",
    startDate: "",
    endDate: "",
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

  const [announcementForm, setAnnouncementForm] = useState({
    author: "Admin",
    text: "",
  });

  const [carouselForm, setCarouselForm] = useState({
    imageUrl: "",
    redirectUrl: "",
    title: "",
    description: "",
  });

  const [isUploading, setIsUploading] = useState(false);


  const [teamForm, setTeamForm] = useState({
    name: "",
    logo: "",
    country: "",
    players: [], // array of { name, ign, avatar, role, bio }
  });

  const [heroForm, setHeroForm] = useState(null);
  const [marqueeForm, setMarqueeForm] = useState(null);

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

    // Create persistent notification log
    setNotifications((prev) => [
      { id: Date.now(), text, type, time: new Date() },
      ...prev,
    ]);
  };

  const extractYouTubeId = (url) => {
    if (!url || typeof url !== "string") return null;
    const trimmed = url.trim();
    if (!trimmed) return null;

    const embedMatch = trimmed.match(/youtube\.com\/embed\/([^?&/]+)/i);
    if (embedMatch?.[1]) return embedMatch[1];

    const shortMatch = trimmed.match(/youtu\.be\/([^?&/]+)/i);
    if (shortMatch?.[1]) return shortMatch[1];

    const watchMatch = trimmed.match(/[?&]v=([^?&/]+)/i);
    if (watchMatch?.[1]) return watchMatch[1];

    const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([^?&/]+)/i);
    if (shortsMatch?.[1]) return shortsMatch[1];

    return null;
  };

  const formatTournamentDates = (start, end) => {
    if (!start && !end) return "";
    const opts = { month: "short", day: "numeric", year: "numeric" };
    if (start && end) {
      return `${new Date(start).toLocaleDateString("en-US", opts)} - ${new Date(end).toLocaleDateString("en-US", opts)}`;
    }
    const d = new Date(start || end);
    return d.toLocaleDateString("en-US", opts);
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
      date:
        form.startDate || form.endDate
          ? formatTournamentDates(form.startDate, form.endDate)
          : (form.date || "").trim(),
      thumbnail: (form.thumbnail || "").trim(),
      registerUrl: (form.registerUrl || "").trim(),
    };
  };

  const handleAddTournament = async () => {
    if (!tournamentForm.name) {
      showMessage("Please fill in tournament name", "error");
      return;
    }

    const created = await addTournament(
      normalizeTournamentPayload(tournamentForm),
    );
    if (created) {
      showMessage("Tournament added successfully!");
      setTournamentForm({
        name: "",
        date: "",
        startDate: "",
        endDate: "",
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
        startDate: "",
        endDate: "",
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
    const success = await updateLeaderboardEntry(
      editingItem.id,
      leaderboardForm,
    );
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

  const handleBlockUser = async (user) => {
    if (
      window.confirm(
        `Block ${user.displayName || user.email}? They will not be able to log in.`,
      )
    ) {
      const success = await blockUser(user.id);
      if (success) {
        showMessage(`${user.displayName || user.email} has been blocked.`);
      } else {
        showMessage("Error blocking user", "error");
      }
    }
  };

  const handleUnblockUser = async (user) => {
    if (window.confirm(`Unblock ${user.displayName || user.email}?`)) {
      const success = await unblockUser(user.id);
      if (success) {
        showMessage(`${user.displayName || user.email} has been unblocked.`);
      } else {
        showMessage("Error unblocking user", "error");
      }
    }
  };

  const handleDeleteUser = async (user) => {
    if (
      window.confirm(
        `⚠️ WARNING: This will permanently delete ${user.displayName || user.email} and all their data. This action cannot be undone. Are you sure?`,
      )
    ) {
      const success = await deleteUser(user.id);
      if (success) {
        showMessage(`${user.displayName || user.email} has been deleted.`);
      } else {
        showMessage("Error deleting user", "error");
      }
    }
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setShowForm(true);

    if (type === "tournaments") {
      setTournamentForm({
        name: item.name,
        date: item.date,
        startDate: item.startDate || "",
        endDate: item.endDate || "",
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
    } else if (type === "teams") {
      setTeamForm({
        name: item.name || "",
        logo: item.logo || "",
        country: item.country || "",
        players: item.players || [],
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
    } else if (type === "announcements") {
      setAnnouncementForm({
        author: item.author || "Admin",
        text: item.text || "",
      });
    } else if (type === "carousel") {
      setCarouselForm({
        imageUrl: item.imageUrl || "",
        redirectUrl: item.redirectUrl || "",
        title: item.title || "",
        description: item.description || "",
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

  const filteredAnnouncements = (adminComments || []).filter((a) =>
    (a.text || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredUsers = (users || []).filter(
    (u) =>
      (u.displayName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredAnnouncementsCarousel = (announcementSlides || []).filter((a) =>
    (a.redirectUrl || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredTeams = (teams || []).filter((t) =>
    (t.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
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

  const handleAddAnnouncement = async () => {
    if (!announcementForm.text?.trim()) {
      showMessage("Please fill in announcement text", "error");
      return;
    }
    const created = await addAdminComment({
      author: announcementForm.author.trim() || "Admin",
      text: announcementForm.text.trim(),
    });
    if (created) {
      showMessage("Announcement added!");
      setAnnouncementForm({ author: "Admin", text: "" });
      setShowForm(false);
    } else {
      showMessage("Error adding announcement", "error");
    }
  };

  const handleUpdateAnnouncement = async () => {
    const success = await updateAdminComment(editingItem.id, {
      author: announcementForm.author.trim() || "Admin",
      text: announcementForm.text.trim(),
    });
    if (success) {
      showMessage("Announcement updated!");
      setEditingItem(null);
      setAnnouncementForm({ author: "Admin", text: "" });
      setShowForm(false);
    } else {
      showMessage("Error updating announcement", "error");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadImage(file);
      setCarouselForm((prev) => ({ ...prev, imageUrl: url }));
      showMessage("Image uploaded successfully!");
    } catch (error) {
      showMessage("Error uploading image", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCarouselSlide = async () => {
    if (!carouselForm.imageUrl) {
      showMessage("Please provide an image URL", "error");
      return;
    }
    const created = await addAnnouncementSlide(carouselForm);
    if (created) {
      showMessage("Carousel slide added!");
      setCarouselForm({ imageUrl: "", redirectUrl: "" });
      setShowForm(false);
    } else {
      showMessage("Error adding slide", "error");
    }
  };

  const handleUpdateCarouselSlide = async () => {
    const success = await updateAnnouncementSlide(editingItem.id, carouselForm);
    if (success) {
      showMessage("Carousel slide updated!");
      setEditingItem(null);
      setCarouselForm({ imageUrl: "", redirectUrl: "" });
      setShowForm(false);
    } else {
      showMessage("Error updating slide", "error");
    }
  };


  const handleSaveHero = async () => {
    if (!heroForm) return;
    const vid = extractYouTubeId(heroForm.youtubeVideoUrl);
    const youtubeVideoId = vid || hero?.youtubeVideoId || "EZMYvAWbyLo";
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

  const [marqueeTextForm, setMarqueeTextForm] = useState("");

  const handleAddMarqueeText = async () => {
    if (!marqueeTextForm.trim()) return;
    const items = [...(marquee?.items || []), marqueeTextForm.trim()];
    const ok = await updateMarquee({ items });
    if (ok) {
      showMessage("Marquee saved!");
      setMarqueeTextForm("");
      setShowForm(false);
    } else showMessage("Error saving marquee", "error");
  };

  const handleUpdateMarqueeText = async () => {
    if (!marqueeTextForm.trim() || !editingItem) return;
    const items = [...(marquee?.items || [])];
    items[editingItem.id] = marqueeTextForm.trim();
    const ok = await updateMarquee({ items });
    if (ok) {
      showMessage("Marquee updated!");
      setMarqueeTextForm("");
      setEditingItem(null);
      setShowForm(false);
    } else showMessage("Error updating marquee", "error");
  };

  const handleDeleteMarqueeText = async (idx) => {
    if (window.confirm("Delete this marquee item?")) {
      const items = (marquee?.items || []).filter((_, i) => i !== idx);
      const ok = await updateMarquee({ items });
      if (ok) showMessage("Marquee item deleted!");
      else showMessage("Error deleting marquee item", "error");
    }
  };

  return (
    <div className="admin-dashboard-layout">
      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {/* Left Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src={LogoR17} alt="R17 Logo" />
          <h2>Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-title">MAIN</div>
          <button
            className={`nav-link ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("dashboard");
              setShowForm(false);
              setSearchTerm("");
            }}
          >
            <span className="nav-icon">📊</span> Dashboard
          </button>
          <button
            className={`nav-link ${activeTab === "tournaments" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("tournaments");
              setShowForm(false);
              setSearchTerm("");
            }}
          >
            <span className="nav-icon">🏆</span> Tournaments
            <span className="nav-badge">{tournaments.length}</span>
          </button>
          <button
            className={`nav-link ${activeTab === "teams" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("teams");
              setShowForm(false);
              setSearchTerm("");
            }}
          >
            <span className="nav-icon">🛡️</span> Teams
            <span className="nav-badge">{teams?.length ?? 0}</span>
          </button>
          <button
            className={`nav-link ${activeTab === "games" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("games");
              setShowForm(false);
              setSearchTerm("");
            }}
          >
            <span className="nav-icon">🎮</span> Games
            <span className="nav-badge">{games.length}</span>
          </button>
          <button
            className={`nav-link ${activeTab === "leaderboard" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("leaderboard");
              setShowForm(false);
              setSearchTerm("");
            }}
          >
            <span className="nav-icon">📈</span> Leaderboard
            <span className="nav-badge">{leaderboard.length}</span>
          </button>

          <div className="nav-section-title">APPS & CONTENT</div>
          <button
            className={`nav-link ${activeTab === "community" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("community");
              setShowForm(false);
              setSearchTerm("");
            }}
          >
            <span className="nav-icon">💬</span> Community
            <span className="nav-badge">{communityPosts?.length ?? 0}</span>
          </button>
          <button
            className={`nav-link ${activeTab === "announcements" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("announcements");
              setShowForm(false);
              setSearchTerm("");
            }}
          >
            <span className="nav-icon">📢</span> Comments
            <span className="nav-badge">{adminComments?.length ?? 0}</span>
          </button>
          <button
            className={`nav-link ${activeTab === "carousel" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("carousel");
              setShowForm(false);
              setSearchTerm("");
            }}
          >
            <span className="nav-icon">🎠</span> Carousel
            <span className="nav-badge">{announcementSlides?.length ?? 0}</span>
          </button>

          <button
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("users");
              setShowForm(false);
              setSearchTerm("");
            }}
          >
            <span className="nav-icon">👥</span> Users
            <span className="nav-badge">{users?.length ?? 0}</span>
          </button>
          <button
            className={`nav-link ${activeTab === "hero" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("hero");
              setShowForm(false);
              setSearchTerm("");
            }}
          >
            <span className="nav-icon">🎯</span> Hero Section
          </button>
          <button
            className={`nav-link ${activeTab === "marquee" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("marquee");
              setShowForm(false);
              setSearchTerm("");
            }}
          >
            <span className="nav-icon">✨</span> Marquee
          </button>
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div className="topbar-left">
            <h2
              className="topbar-logo"
              style={{
                margin: 0,
                color: "#ff2a2a",
                letterSpacing: "2px",
                fontSize: "1.5rem",
                fontWeight: 800,
              }}
            >
              R 17
            </h2>
          </div>
          <div className="topbar-right">
            <div
              className="topbar-notifications-wrapper"
              style={{ position: "relative" }}
            >
              <div
                className="topbar-icons"
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ cursor: "pointer" }}
              >
                <span className="has-badge">
                  🔔
                  {notifications.length > 0 && (
                    <span className="topbar-badge">
                      {notifications.length > 9 ? "9+" : notifications.length}
                    </span>
                  )}
                </span>
              </div>

              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h4>Notifications</h4>
                    {notifications.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotifications([]);
                          setShowNotifications(false);
                        }}
                        className="clear-notifs"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="no-notifications">No recent updates</div>
                  ) : (
                    <div className="notification-list">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`notification-item ${n.type}`}
                        >
                          <p>{n.text}</p>
                          <small>{n.time.toLocaleTimeString()}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="admin-content-area">
          {activeTab === "dashboard" ? (
            <div className="dashboard-overview animate-fade-up">
            

              <div className="dashboard-charts">
                {/* Main Overview Card */}
                <div className="chart-card overview-chart">
                  <div className="chart-header">
                    <h4>
                      Overview <span className="text-muted">(Current Year)</span>
                    </h4>
                
                  </div>

                  <div className="overview-main">
                    {/* Left metrics column */}
                    <div className="metrics-grid">
                      <div className="metric-item">
                        <span className="metric-label">Revenue (Prize Pool)</span>
                        <div className="metric-value-row">
                          <span className="value">${hero?.stats?.[1]?.inner || "2.8M"}</span>
                        </div>
                      </div>
                    
                      <div className="metric-item">
                        <span className="metric-label">Total Users</span>
                        <div className="metric-value-row">
                          <span className="value">{(users?.length || 452).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Active Teams</span>
                        <div className="metric-value-row">
                          <span className="value">{teams?.length || 128}</span>
                        </div>
                      </div>
                </div>

                    {/* Right dual-bar + line chart - Now based on Sections */}
                    <div className="chart-container-multi">
                      {[
                        { label: "Users", count: (users?.length || 0), color: "#2ed573" },
                        { label: "Tournaments", count: tournaments.length, color: "#ff2a2a" },
                        { label: "Teams", count: (teams?.length || 0), color: "#ff9f43" },
                        { label: "Games", count: games.length, color: "#00d2ff" },
                        { label: "Community", count: (communityPosts?.length || 0), color: "#8e44ad" },
                        { label: "Leaderboard", count: (leaderboard?.length || 0), color: "#ff0080" }
                      ].map((item, i, arr) => {
                        const maxVal = Math.max(...arr.map(a => a.count), 1);
                        const h1 = Math.max((item.count / maxVal) * 100, 5);
                        // Secondary bar can represent "Active" items or a subset
                        const h2 = h1 * 0.6; 
                        return (
                          <div className="chart-bar-group" key={item.label}>
                            <div className="bar-dual primary animate-bar-up" style={{ height: `${h1}%`, background: item.color, animationDelay: `${i * 0.1}s` }}></div>
                            <div className="bar-dual secondary animate-bar-up" style={{ height: `${h2}%`, background: item.color, opacity: 0.3, animationDelay: `${0.2 + i * 0.1}s` }}></div>
                            <span className="month-label">{item.label}</span>
                          </div>
                        );
                      })}
                      
                      {/* SVG Trend Line Overlay (Dynamic) */}
                      <svg className="chart-overlay-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path 
                          className="trend-path"
                          d="M 5 80 Q 25 40 50 20 T 95 10" 
                          fill="none" 
                          stroke="rgba(255,255,255,0.2)" 
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Lead Source Card -> Content Distribution */}
                <div className="chart-card source-chart">
                  <div className="chart-header">
                    <h4>Content Distribution</h4>
                  </div>

                  <div className="mock-donut-chart animate-donut" style={{ margin: "10px 0" }}>
                    <div className="donut-circle" style={{ 
                      width: "140px", 
                      height: "140px",
                      background: `conic-gradient(
                        #ff2a2a 0% ${(tournaments.length / Math.max(tournaments.length + (teams?.length || 0) + games.length, 1)) * 100}%, 
                        #ff9f43 ${(tournaments.length / Math.max(tournaments.length + (teams?.length || 0) + games.length, 1)) * 100}% ${((tournaments.length + (teams?.length || 0)) / Math.max(tournaments.length + (teams?.length || 0) + games.length, 1)) * 100}%,
                        #00d2ff ${((tournaments.length + (teams?.length || 0)) / Math.max(tournaments.length + (teams?.length || 0) + games.length, 1)) * 100}% 100%
                      )`
                    }}>
                      <div className="donut-hole" style={{ background: "#0a0a0a" }}>
                        <span className="donut-total">Entries</span>
                        <span className="donut-number">{(tournaments.length + (teams?.length || 0) + games.length).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="source-legend-grid">
                    {[
                      { name: "Tournaments", count: tournaments.length, color: "#ff2a2a" },
                      { name: "Teams", count: (teams?.length || 0), color: "#ff9f43" },
                      { name: "Games", count: games.length, color: "#00d2ff" }
                    ].map((item) => {
                      const total = tournaments.length + (teams?.length || 0) + games.length;
                      const perc = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0";
                      return (
                        <div className="legend-card" key={item.name}>
                          <div className="legend-header">
                            <span className="dot-indicator" style={{ backgroundColor: item.color }}></span>
                            {item.name}
                          </div>
                          <div className="legend-info">
                            <span className="percentage">{perc}%</span>
                            <span className="trend-badge positive" style={{ padding: "1px 4px", fontSize: "0.6rem" }}>
                                {item.count} items
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="admin-content">
              {activeTab === "hero" && heroForm && (
                <div className="hero-admin-card">
                  <h3 className="hero-admin-title">Hero section (homepage)</h3>
                  <p className="hero-admin-hint">
                    Background: YouTube uses an embed-friendly URL (watch /
                    youtu.be links are converted). Image mode uses a full-bleed
                    cover URL.
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
                          setHeroForm({
                            ...heroForm,
                            titleGlitch: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="hero-admin-label">
                      Title prefix (e.g. &quot;THE &quot;)
                      <input
                        type="text"
                        value={heroForm.titlePrefix}
                        onChange={(e) =>
                          setHeroForm({
                            ...heroForm,
                            titlePrefix: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="hero-admin-label">
                      Title accent (e.g. ARENA)
                      <input
                        type="text"
                        value={heroForm.titleAccent}
                        onChange={(e) =>
                          setHeroForm({
                            ...heroForm,
                            titleAccent: e.target.value,
                          })
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
                  <h4 className="hero-admin-stats-heading">
                    Hero stats (4 columns)
                  </h4>
                  <div className="hero-admin-stats">
                    {heroForm.stats.map((row, i) => (
                      <div className="hero-admin-stat-row" key={i}>
                        <span className="hero-admin-stat-num">#{i + 1}</span>
                        <input
                          placeholder="Main (e.g. 4.2)"
                          value={row.main}
                          onChange={(e) =>
                            updateHeroStat(i, "main", e.target.value)
                          }
                        />
                        <input
                          placeholder="Highlight (e.g. M)"
                          value={row.inner}
                          onChange={(e) =>
                            updateHeroStat(i, "inner", e.target.value)
                          }
                        />
                        <input
                          placeholder="Label"
                          value={row.label}
                          onChange={(e) =>
                            updateHeroStat(i, "label", e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn-save hero-admin-save"
                    onClick={handleSaveHero}
                  >
                    Save hero
                  </button>
                </div>
              )}

              {activeTab === "hero" && !heroForm ? (
                <p className="no-data">Loading hero settings…</p>
              ) : null}

               {activeTab !== "hero" &&
              activeTab !== "users" &&
              activeTab !== "announcements" ? (

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
                      <button
                        className="btn-add"
                        onClick={() => setShowForm(true)}
                      >
                        + Add New
                      </button>
                    )}
                  </div>

                  {showForm && (
                    <div className="form-modal">
                      <div className="form-container">
                        <h3>
                          {editingItem ? "Edit" : "Add New"}{" "}
                          {activeTab.slice(0, -1)}
                        </h3>

                        {activeTab === "marquee" && (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              if (editingItem) {
                                await handleUpdateMarqueeText();
                              } else {
                                await handleAddMarqueeText();
                              }
                            }}
                          >
                            <input
                              type="text"
                              placeholder="e.g. SEASON 6 NOW LIVE"
                              value={marqueeTextForm}
                              onChange={(e) =>
                                setMarqueeTextForm(e.target.value)
                              }
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
                                  setMarqueeTextForm("");
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}

                        {activeTab === "carousel" && (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              if (editingItem) {
                                await handleUpdateCarouselSlide();
                              } else {
                                await handleAddCarouselSlide();
                              }
                            }}
                          >
                            <div className="form-group">
                              <label>Image Source</label>
                              <div
                                className="upload-input-group"
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                <input
                                  type="text"
                                  placeholder="Image URL"
                                  value={carouselForm.imageUrl}
                                  onChange={(e) =>
                                    setCarouselForm({
                                      ...carouselForm,
                                      imageUrl: e.target.value,
                                    })
                                  }
                                  required
                                  style={{ flex: 1 }}
                                />
                                <div className="file-upload-wrapper">
                                  <label className="btn-upload">
                                    {isUploading ? "Uploading..." : "Upload File"}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleFileUpload}
                                      disabled={isUploading}
                                      style={{ display: "none" }}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <label>Slide Title</label>
                              <input
                                type="text"
                                placeholder="eg: R17 CHAMPIONSHIP 2026"
                                value={carouselForm.title}
                                onChange={(e) =>
                                  setCarouselForm({
                                    ...carouselForm,
                                    title: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Slide Description</label>
                              <textarea
                                placeholder="Short description for the slide..."
                                value={carouselForm.description}
                                onChange={(e) =>
                                  setCarouselForm({
                                    ...carouselForm,
                                    description: e.target.value,
                                  })
                                }
                                rows={3}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Redirect URL</label>
                              <input
                                type="text"
                                placeholder="eg: https://r17gaming.com/tournaments"
                                value={carouselForm.redirectUrl}
                                onChange={(e) =>
                                  setCarouselForm({
                                    ...carouselForm,
                                    redirectUrl: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="form-actions">
                              <button
                                type="submit"
                                className="btn-save"
                                disabled={isUploading}
                              >
                                {editingItem ? "Update" : "Add Slide"}
                              </button>
                              <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => {
                                  setShowForm(false);
                                  setEditingItem(null);
                                  setCarouselForm({
                                    imageUrl: "",
                                    redirectUrl: "",
                                    title: "",
                                    description: "",
                                  });
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}


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
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginBottom: "1rem",
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <label
                                  style={{
                                    display: "block",
                                    fontSize: "0.8rem",
                                    color: "#8b8d93",
                                    marginBottom: "0.25rem",
                                    textAlign: "left",
                                  }}
                                >
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  value={tournamentForm.startDate || ""}
                                  onChange={(e) =>
                                    setTournamentForm({
                                      ...tournamentForm,
                                      startDate: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label
                                  style={{
                                    display: "block",
                                    fontSize: "0.8rem",
                                    color: "#8b8d93",
                                    marginBottom: "0.25rem",
                                    textAlign: "left",
                                  }}
                                >
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  value={tournamentForm.endDate || ""}
                                  onChange={(e) =>
                                    setTournamentForm({
                                      ...tournamentForm,
                                      endDate: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                            </div>
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
                            <h4
                              style={{
                                color: "#ff6b6b",
                                margin: "1rem 0 0.5rem",
                              }}
                            >
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

                        {activeTab === "teams" && (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              // Use the players array directly
                              const payload = {
                                name: teamForm.name || "",
                                logo: teamForm.logo?.trim()
                                  ? teamForm.logo.trim()
                                  : null,
                                country: teamForm.country || "",
                                players: (teamForm.players || [])
                                  .map((p) => ({
                                    name: (p.name || "").trim(),
                                    ign: (p.ign || "").trim(),
                                    avatar: (p.avatar || "").trim(),
                                    role: (p.role || "").trim(),
                                    bio: (p.bio || "").trim(),
                                  }))
                                  .filter((p) => p.name),
                              };

                              if (editingItem) {
                                const ok = await updateTeam(
                                  editingItem.id,
                                  payload,
                                );
                                if (ok) {
                                  showMessage("Team updated");
                                } else
                                  showMessage("Error updating team", "error");
                                setShowForm(false);
                                setEditingItem(null);
                                return;
                              }

                              const created = await addTeam(payload);
                              if (created) {
                                showMessage("Team added");
                                setTeamForm({
                                  name: "",
                                  logo: "",
                                  country: "",
                                  players: [],
                                });
                                setShowForm(false);
                              } else showMessage("Error adding team", "error");
                            }}
                          >
                            <input
                              type="text"
                              placeholder="Team Name"
                              value={teamForm.name}
                              onChange={(e) =>
                                setTeamForm({
                                  ...teamForm,
                                  name: e.target.value,
                                })
                              }
                              required
                            />
                            <input
                              type="text"
                              placeholder="Team Logo URL"
                              value={teamForm.logo || ""}
                              onChange={(e) =>
                                setTeamForm({
                                  ...teamForm,
                                  logo: e.target.value,
                                })
                              }
                            />
                            <input
                              type="text"
                              placeholder="Country / Region"
                              value={teamForm.country}
                              onChange={(e) =>
                                setTeamForm({
                                  ...teamForm,
                                  country: e.target.value,
                                })
                              }
                            />

                            <div className="players-edit-list">
                              {(teamForm.players || []).map((p, idx) => (
                                <div className="player-edit-row" key={idx}>
                                  <input
                                    type="text"
                                    placeholder="Player name"
                                    value={p.name || ""}
                                    onChange={(e) => {
                                      const next = [...teamForm.players];
                                      next[idx] = {
                                        ...next[idx],
                                        name: e.target.value,
                                      };
                                      setTeamForm({
                                        ...teamForm,
                                        players: next,
                                      });
                                    }}
                                    required
                                  />
                                  <input
                                    type="text"
                                    placeholder="Avatar URL"
                                    value={p.avatar || ""}
                                    onChange={(e) => {
                                      const next = [...teamForm.players];
                                      next[idx] = {
                                        ...next[idx],
                                        avatar: e.target.value,
                                      };
                                      setTeamForm({
                                        ...teamForm,
                                        players: next,
                                      });
                                    }}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Role (e.g., Captain)"
                                    value={p.role || ""}
                                    onChange={(e) => {
                                      const next = [...teamForm.players];
                                      next[idx] = {
                                        ...next[idx],
                                        role: e.target.value,
                                      };
                                      setTeamForm({
                                        ...teamForm,
                                        players: next,
                                      });
                                    }}
                                  />
                                  <input
                                    type="text"
                                    placeholder="IGN (In-Game Name)"
                                    value={p.ign || ""}
                                    onChange={(e) => {
                                      const next = [...teamForm.players];
                                      next[idx] = {
                                        ...next[idx],
                                        ign: e.target.value,
                                      };
                                      setTeamForm({
                                        ...teamForm,
                                        players: next,
                                      });
                                    }}
                                  />
                                  <textarea
                                    placeholder="Player Bio / Details"
                                    value={p.bio || ""}
                                    rows={2}
                                    onChange={(e) => {
                                      const next = [...teamForm.players];
                                      next[idx] = {
                                        ...next[idx],
                                        bio: e.target.value,
                                      };
                                      setTeamForm({
                                        ...teamForm,
                                        players: next,
                                      });
                                    }}
                                  ></textarea>
                                  <button
                                    type="button"
                                    className="btn-remove"
                                    onClick={() => {
                                      const next = [...teamForm.players];
                                      next.splice(idx, 1);
                                      setTeamForm({
                                        ...teamForm,
                                        players: next,
                                      });
                                    }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}

                              <button
                                type="button"
                                className="btn-add-player"
                                onClick={() =>
                                  setTeamForm({
                                    ...teamForm,
                                    players: [
                                      ...(teamForm.players || []),
                                      {
                                        name: "",
                                        ign: "",
                                        avatar: "",
                                        role: "",
                                        bio: "",
                                      },
                                    ],
                                  })
                                }
                              >
                                + Add Player
                              </button>
                            </div>

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
                            <h4
                              style={{
                                color: "#ff6b6b",
                                marginBottom: "0.5rem",
                              }}
                            >
                              Basic Information
                            </h4>
                            <input
                              type="text"
                              placeholder="Game Name *"
                              value={gameForm.name}
                              onChange={(e) =>
                                setGameForm({
                                  ...gameForm,
                                  name: e.target.value,
                                })
                              }
                              required
                            />
                            <input
                              type="text"
                              placeholder="Thumbnail URL (for game cards + featured poster)"
                              value={gameForm.thumbnail}
                              onChange={(e) =>
                                setGameForm({
                                  ...gameForm,
                                  thumbnail: e.target.value,
                                })
                              }
                            />
                            <input
                              type="text"
                              placeholder="Category (e.g., FPS, MOBA, Battle Royale)"
                              value={gameForm.category}
                              onChange={(e) =>
                                setGameForm({
                                  ...gameForm,
                                  category: e.target.value,
                                })
                              }
                              required
                            />
                            <input
                              type="text"
                              placeholder="Active Players (e.g., 4.2M)"
                              value={gameForm.players}
                              onChange={(e) =>
                                setGameForm({
                                  ...gameForm,
                                  players: e.target.value,
                                })
                              }
                              required
                            />
                            <input
                              type="text"
                              placeholder="Genre (e.g., Tactical FPS, Battle Royale)"
                              value={gameForm.genre}
                              onChange={(e) =>
                                setGameForm({
                                  ...gameForm,
                                  genre: e.target.value,
                                })
                              }
                            />
                            <textarea
                              placeholder="Description"
                              value={gameForm.description}
                              onChange={(e) =>
                                setGameForm({
                                  ...gameForm,
                                  description: e.target.value,
                                })
                              }
                              rows="2"
                              required
                            />

                            <h4
                              style={{
                                color: "#ff6b6b",
                                margin: "1rem 0 0.5rem",
                              }}
                            >
                              Game Card Styling
                            </h4>
                            <input
                              type="text"
                              placeholder="Tag (e.g., HOT, NEW, FREE, PRO)"
                              value={gameForm.tag}
                              onChange={(e) =>
                                setGameForm({
                                  ...gameForm,
                                  tag: e.target.value,
                                })
                              }
                            />
                            <select
                              value={gameForm.tagClass}
                              onChange={(e) =>
                                setGameForm({
                                  ...gameForm,
                                  tagClass: e.target.value,
                                })
                              }
                            >
                              <option value="">Default Tag Style</option>
                              <option value="gold-tag">Gold Tag (HOT)</option>
                              <option value="blue-tag">Blue Tag (NEW)</option>
                              <option value="green-tag">
                                Green Tag (FREE)
                              </option>
                              <option value="purple-tag">
                                Purple Tag (PRO)
                              </option>
                            </select>
                            <input
                              type="text"
                              placeholder="Platforms (comma-separated, e.g., PC, PS5, XSX, Mobile)"
                              value={gameForm.platforms}
                              onChange={(e) =>
                                setGameForm({
                                  ...gameForm,
                                  platforms: e.target.value,
                                })
                              }
                            />
                            <input
                              type="text"
                              placeholder="Stars (e.g., ★★★★★, ★★★★☆)"
                              value={gameForm.stars}
                              onChange={(e) =>
                                setGameForm({
                                  ...gameForm,
                                  stars: e.target.value,
                                })
                              }
                            />
                            <input
                              type="text"
                              placeholder="Rating (e.g., 4.9 / 5 · 120K reviews)"
                              value={gameForm.rating}
                              onChange={(e) =>
                                setGameForm({
                                  ...gameForm,
                                  rating: e.target.value,
                                })
                              }
                            />

                            <h4
                              style={{
                                color: "#ff6b6b",
                                margin: "1rem 0 0.5rem",
                              }}
                            >
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
                                setGameForm({
                                  ...gameForm,
                                  featuredMeta: e.target.value,
                                })
                              }
                            />
                            <input
                              type="text"
                              placeholder="Featured Tags (comma-separated, e.g., Season 6 Live, 128-Tick Servers, Anti-Cheat)"
                              value={gameForm.featuredTags}
                              onChange={(e) =>
                                setGameForm({
                                  ...gameForm,
                                  featuredTags: e.target.value,
                                })
                              }
                            />
                            <textarea
                              placeholder="Featured Description"
                              value={gameForm.featuredDesc}
                              onChange={(e) =>
                                setGameForm({
                                  ...gameForm,
                                  featuredDesc: e.target.value,
                                })
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
                                setGameForm({
                                  ...gameForm,
                                  videoUrl: e.target.value,
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
                            <input
                              list="games-list"
                              placeholder="Game (e.g. Valorant)"
                              value={leaderboardForm.game}
                              onChange={(e) =>
                                setLeaderboardForm({
                                  ...leaderboardForm,
                                  game: e.target.value,
                                })
                              }
                              required
                              style={{ marginBottom: "1rem" }}
                            />
                            <datalist id="games-list">
                              {games.map((game) => (
                                <option key={game.id} value={game.name} />
                              ))}
                            </datalist>
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
                            <h4
                              style={{
                                color: "#ff6b6b",
                                marginBottom: "0.5rem",
                              }}
                            >
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
                                    <span
                                      className="tournament-has-link"
                                      title={tournament.registerUrl}
                                    >
                                      ✓ Set
                                    </span>
                                  ) : (
                                    <span className="tournament-no-link">
                                      —
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <button
                                    className="btn-edit"
                                    onClick={() =>
                                      handleEdit(tournament, "tournaments")
                                    }
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

                  {activeTab === "marquee" && (
                    <div className="data-table">
                      <div
                        style={{
                          marginBottom: "1.5rem",
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                        }}
                      >
                        <Marquee
                          overrideItems={
                            marquee?.items?.length
                              ? marquee.items
                              : ["PREVIEW TEXT"]
                          }
                        />
                      </div>
                      <table>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Marquee Text</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(marquee?.items || []).length > 0 ? (
                            (marquee?.items || []).map((item, idx) => (
                              <tr key={idx}>
                                <td style={{ width: "5%" }}>{idx + 1}</td>
                                <td>{item}</td>
                                <td style={{ width: "15%" }}>
                                  <button
                                    className="btn-edit"
                                    onClick={() => {
                                      setEditingItem({ id: idx, text: item });
                                      setMarqueeTextForm(item);
                                      setShowForm(true);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn-delete"
                                    onClick={() => handleDeleteMarqueeText(idx)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="no-data">
                                No marquee items found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === "teams" && (
                    <div className="data-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Team Name</th>
                            <th>Country</th>
                            <th>Players</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTeams.length > 0 ? (
                            filteredTeams.map((team) => (
                              <tr key={team.id}>
                                <td>
                                  <div className="team-cell">
                                    <img
                                      src={team.logo || LogoR17}
                                      alt={team.name}
                                      className="admin-list-logo"
                                      onError={(e) => (e.target.src = LogoR17)}
                                    />
                                    <span>{team.name}</span>
                                  </div>
                                </td>
                                <td>{team.country}</td>
                                <td>{team.players?.length || 0} players</td>
                                <td>
                                  <button
                                    className="btn-edit"
                                    onClick={() => handleEdit(team, "teams")}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn-delete"
                                    onClick={() =>
                                      handleDelete(
                                        team.id,
                                        "team",
                                        deleteTeam,
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
                              <td colSpan="4" className="no-data">
                                No teams found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === "carousel" && (
                    <div className="data-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Image Preview</th>
                            <th>Title</th>
                            <th>Redirect URL</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAnnouncementsCarousel.length > 0 ? (
                            filteredAnnouncementsCarousel.map((slide) => (
                              <tr key={slide.id}>
                                <td>
                                  <img
                                    src={slide.imageUrl}
                                    alt="Carousel Slide"
                                    style={{
                                      width: "120px",
                                      height: "60px",
                                      objectFit: "cover",
                                      borderRadius: "4px",
                                    }}
                                  />
                                </td>
                                <td>
                                  <div style={{ fontWeight: "600", color: "#fff" }}>
                                    {slide.title || "No Title"}
                                  </div>
                                </td>
                                <td>
                                  <a
                                    href={slide.redirectUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "#2ed573" }}
                                  >
                                    {slide.redirectUrl}
                                  </a>
                                </td>
                                <td>
                                  <button
                                    className="btn-edit"
                                    onClick={() => handleEdit(slide, "carousel")}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn-delete"
                                    onClick={() =>
                                      handleDelete(
                                        slide.id,
                                        "slide",
                                        deleteAnnouncementSlide,
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
                              <td colSpan="3" className="no-data">
                                No carousel slides found
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
                                  {game.platforms
                                    ? game.platforms.join(", ")
                                    : "-"}
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
                                    onClick={() =>
                                      handleEdit(entry, "leaderboard")
                                    }
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
                                    onClick={() =>
                                      handleEdit(post, "community")
                                    }
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

              {activeTab === "users" && (
                <div className="users-management">
                  <div className="admin-actions">
                    <div className="search-bar">
                      <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="user-stats">
                      <span>Total: {users?.length || 0}</span>
                      <span>
                        Active: {users?.filter((u) => !u.isBlocked).length || 0}
                      </span>
                      <span>
                        Blocked: {users?.filter((u) => u.isBlocked).length || 0}
                      </span>
                    </div>
                  </div>

                  <div className="data-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Avatar</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Member Since</th>
                          <th>Status</th>
                          <th>Tournaments</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <tr
                              key={user.id}
                              className={user.isBlocked ? "user-blocked" : ""}
                            >
                              <td className="user-avatar-cell">
                                {user.photoURL ? (
                                  <img
                                    src={user.photoURL}
                                    alt=""
                                    className="user-avatar"
                                  />
                                ) : (
                                  <div className="user-avatar-placeholder">
                                    {(
                                      user.displayName?.[0] ||
                                      user.email?.[0] ||
                                      "?"
                                    ).toUpperCase()}
                                  </div>
                                )}
                              </td>
                              <td>
                                <strong>{user.displayName || "—"}</strong>
                                {user.uid && (
                                  <div className="user-uid">
                                    {user.uid.slice(0, 8)}...
                                  </div>
                                )}
                              </td>
                              <td>{user.email || "—"}</td>
                              <td>
                                {user.createdAt
                                  ? new Date(
                                      user.createdAt,
                                    ).toLocaleDateString()
                                  : "—"}
                              </td>
                              <td>
                                <span
                                  className={`user-status-badge ${user.isBlocked ? "status-blocked" : "status-active"}`}
                                >
                                  {user.isBlocked ? "Blocked" : "Active"}
                                </span>
                              </td>
                              <td className="user-tournaments-count">
                                {user.tournamentCount || 0}
                              </td>
                              <td className="user-actions">
                                <button
                                  className="btn-view"
                                  onClick={() => handleViewUserDetails(user)}
                                  title="View Details"
                                >
                                  👁️
                                </button>
                                {user.isBlocked ? (
                                  <button
                                    className="btn-unblock"
                                    onClick={() => handleUnblockUser(user)}
                                    title="Unblock User"
                                  >
                                    🔓
                                  </button>
                                ) : (
                                  <button
                                    className="btn-block"
                                    onClick={() => handleBlockUser(user)}
                                    title="Block User"
                                  >
                                    🔒
                                  </button>
                                )}
                                <button
                                  className="btn-delete-user"
                                  onClick={() => handleDeleteUser(user)}
                                  title="Delete User"
                                >
                                  🗑️
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="no-data">
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* User Details Modal */}
              {showUserModal && selectedUser && (
                <div
                  className="modal-overlay"
                  onClick={() => setShowUserModal(false)}
                >
                  <div
                    className="user-modal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="modal-close"
                      onClick={() => setShowUserModal(false)}
                    >
                      ×
                    </button>
                    <div className="modal-header">
                      <div className="modal-avatar-large">
                        {selectedUser.photoURL ? (
                          <img src={selectedUser.photoURL} alt="" />
                        ) : (
                          <span>
                            {(
                              selectedUser.displayName?.[0] ||
                              selectedUser.email?.[0] ||
                              "?"
                            ).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="modal-user-info">
                        <h3>{selectedUser.displayName || "No name set"}</h3>
                        <p>{selectedUser.email}</p>
                        <span
                          className={`user-status-badge ${selectedUser.isBlocked ? "status-blocked" : "status-active"}`}
                        >
                          {selectedUser.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </div>
                    </div>
                    <div className="modal-details">
                      <div className="detail-row">
                        <span className="detail-label">User ID:</span>
                        <span className="detail-value">
                          {selectedUser.uid || selectedUser.id}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Member since:</span>
                        <span className="detail-value">
                          {selectedUser.createdAt
                            ? new Date(selectedUser.createdAt).toLocaleString()
                            : "—"}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last login:</span>
                        <span className="detail-value">
                          {selectedUser.lastLoginAt
                            ? new Date(
                                selectedUser.lastLoginAt,
                              ).toLocaleString()
                            : "—"}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">
                          Tournaments registered:
                        </span>
                        <span className="detail-value">
                          {selectedUser.tournamentCount || 0}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Tournaments won:</span>
                        <span className="detail-value">
                          {selectedUser.tournamentsWon || 0}
                        </span>
                      </div>
                    </div>
                    <div className="modal-actions">
                      {selectedUser.isBlocked ? (
                        <button
                          className="btn-unblock"
                          onClick={() => {
                            handleUnblockUser(selectedUser);
                            setShowUserModal(false);
                          }}
                        >
                          Unblock User
                        </button>
                      ) : (
                        <button
                          className="btn-block"
                          onClick={() => {
                            handleBlockUser(selectedUser);
                            setShowUserModal(false);
                          }}
                        >
                          Block User
                        </button>
                      )}
                      <button
                        className="btn-delete-user"
                        onClick={() => {
                          handleDeleteUser(selectedUser);
                          setShowUserModal(false);
                        }}
                      >
                        Delete User Permanently
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Announcements Tab Content */}
              {activeTab === "announcements" && !showForm && (
                <div className="tab-pane">
                  <div className="pane-header">
                    <h2>📢 Admin Comments</h2>
                    <div className="pane-actions">
                      <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                      <button
                        className="add-btn"
                        onClick={() => setShowForm(true)}
                      >
                        + New Comment
                      </button>
                    </div>
                  </div>
                  <div className="items-grid">
                    {filteredAnnouncements.map((item) => (
                      <div key={item.id} className="admin-card">
                        <div className="card-content">
                          <h3>{item.author}</h3>
                          <p className="card-subtitle line-clamp-2">
                            {item.text}
                          </p>
                          <p
                            className="card-date"
                            style={{
                              marginTop: "8px",
                              color: "var(--muted)",
                              fontSize: "0.8rem",
                            }}
                          >
                            {item.createdAt
                              ? new Date(
                                  item.createdAt.seconds * 1000,
                                ).toLocaleString()
                              : ""}
                          </p>
                        </div>
                        <div className="card-actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(item, "announcements")}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                item.id,
                                "Announcement",
                                deleteAdminComment,
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {filteredAnnouncements.length === 0 && (
                      <div className="empty-state">No announcements found.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Announcements Form */}
              {activeTab === "announcements" && showForm && (
                <div className="form-modal">
                  <div className="form-container">
                    <h3>{editingItem ? "Edit" : "New"} Announcement</h3>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (editingItem) {
                          await handleUpdateAnnouncement();
                        } else {
                          await handleAddAnnouncement();
                        }
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Author Name (e.g. Admin, NightHawk)"
                        value={announcementForm.author}
                        onChange={(e) =>
                          setAnnouncementForm({
                            ...announcementForm,
                            author: e.target.value,
                          })
                        }
                        required
                      />
                      <textarea
                        placeholder="Enter the announcement text..."
                        value={announcementForm.text}
                        onChange={(e) =>
                          setAnnouncementForm({
                            ...announcementForm,
                            text: e.target.value,
                          })
                        }
                        required
                        rows={6}
                      />
                      <div className="form-actions">
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={() => {
                            setShowForm(false);
                            setEditingItem(null);
                            setAnnouncementForm({ author: "Admin", text: "" });
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn-save">
                          {editingItem ? "Update" : "Add"} Announcement
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
