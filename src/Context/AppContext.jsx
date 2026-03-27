import React, { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [tournaments, setTournaments] = useState([]);
  const [games, setGames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      // Load from localStorage
      const savedTournaments = localStorage.getItem("app_tournaments");
      const savedGames = localStorage.getItem("app_games");
      const savedLeaderboard = localStorage.getItem("app_leaderboard");

      // Default tournaments data with gallery arrays
      const defaultTournaments = [
        {
          id: 1,
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
          ],
        },
        {
          id: 2,
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
          ],
        },
        {
          id: 3,
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
          ],
        },
      ];

      const defaultGames = [
        {
          id: 1,
          name: "Shadow Realm",
          category: "FPS",
          genre: "FPS",
          players: "4.2M",
          description:
            "Intense tactical shooter with realistic graphics and competitive multiplayer",
          thumbnail:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop",
          videoUrl: "https://www.youtube.com/watch?v=Hj8WL4DQb18", // This will be converted to embed
          platforms: ["PC", "PS5", "XSX"],
          tag: "HOT",
          tagClass: "gold-tag",
          stars: "★★★★★",
          rating: "4.8 / 5 · 15K reviews",
        },
        {
          id: 2,
          name: "Cyber Siege",
          category: "MOBA",
          genre: "MOBA",
          players: "2.8M",
          thumbnail:
            "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=1200&h=600&fit=crop",
          videoUrl: "https://www.youtube.com/watch?v=Hj8WL4DQb18",
          description:
            "Strategy-based combat with unique heroes and intense team battles",
          platforms: ["PC", "Switch", "Mobile"],
          tag: "NEW",
          tagClass: "green-tag",
          stars: "★★★★☆",
          rating: "4.5 / 5 · 8.2K reviews",
        },
        {
          id: 3,
          name: "Neon Strike",
          category: "Battle Royale",
          genre: "Battle Royale",
          players: "3.1M",
          thumbnail:
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop",
          videoUrl: "https://www.youtube.com/watch?v=example3",
          description: "Fast-paced action in a futuristic neon-drenched arena",
          platforms: ["PC", "PS5", "XSX", "Mobile"],
          tag: "TRENDING",
          tagClass: "blue-tag",
          stars: "★★★★☆",
          rating: "4.3 / 5 · 12K reviews",
        },
      ];

      const defaultLeaderboard = [
        {
          id: 1,
          rank: "01",
          playerName: "ZephyrX",
          country: "🇰🇷 South Korea",
          score: "98,420",
          kd: "4.8",
          game: "Shadow Realm",
        },
        {
          id: 2,
          rank: "02",
          playerName: "NovaBurst",
          country: "🇸🇪 Sweden",
          score: "94,105",
          kd: "4.3",
          game: "Cyber Siege",
        },
        {
          id: 3,
          rank: "03",
          playerName: "R17_Ghost",
          country: "🇧🇷 Brazil",
          score: "91,882",
          kd: "4.1",
          game: "Neon Strike",
        },
      ];

      // Set tournaments from localStorage or default
      if (savedTournaments) {
        const parsedTournaments = JSON.parse(savedTournaments);
        setTournaments(parsedTournaments);
        console.log(
          "Loaded tournaments from localStorage:",
          parsedTournaments.length,
        );
      } else {
        setTournaments(defaultTournaments);
        localStorage.setItem(
          "app_tournaments",
          JSON.stringify(defaultTournaments),
        );
        console.log("Loaded default tournaments:", defaultTournaments.length);
      }

      // Set games from localStorage or default
      if (savedGames) {
        const parsedGames = JSON.parse(savedGames);
        setGames(parsedGames);
        console.log("Loaded games from localStorage:", parsedGames.length);
      } else {
        setGames(defaultGames);
        localStorage.setItem("app_games", JSON.stringify(defaultGames));
      }

      // Set leaderboard from localStorage or default
      if (savedLeaderboard) {
        const parsedLeaderboard = JSON.parse(savedLeaderboard);
        setLeaderboard(parsedLeaderboard);
        console.log(
          "Loaded leaderboard from localStorage:",
          parsedLeaderboard.length,
        );
      } else {
        setLeaderboard(defaultLeaderboard);
        localStorage.setItem(
          "app_leaderboard",
          JSON.stringify(defaultLeaderboard),
        );
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  // Tournament CRUD Operations
  const addTournament = (tournament) => {
    try {
      // Get current tournaments from state
      const currentTournaments = [...tournaments];

      const newTournament = {
        id: Date.now(),
        rank: String(currentTournaments.length + 1).padStart(2, "0"),
        statusLabel:
          tournament.status === "live"
            ? "● Live Now"
            : tournament.status === "soon"
              ? "Soon"
              : "Open",
        gallery: tournament.gallery
          ? typeof tournament.gallery === "string"
            ? tournament.gallery
                .split(",")
                .map((url) => url.trim())
                .filter((url) => url)
            : tournament.gallery
          : [],
        ...tournament,
      };

      // Add to existing tournaments
      const updatedTournaments = [...currentTournaments, newTournament];

      // Update state
      setTournaments(updatedTournaments);

      // Save to localStorage
      localStorage.setItem(
        "app_tournaments",
        JSON.stringify(updatedTournaments),
      );

      console.log("Tournament added successfully!");
      console.log("Previous count:", currentTournaments.length);
      console.log("New count:", updatedTournaments.length);
      console.log("All tournaments:", updatedTournaments);

      return true;
    } catch (error) {
      console.error("Error adding tournament:", error);
      return false;
    }
  };

  const updateTournament = (id, updatedData) => {
    try {
      const updatedTournaments = tournaments.map((t) =>
        t.id === id ? { ...t, ...updatedData } : t,
      );
      setTournaments(updatedTournaments);
      localStorage.setItem(
        "app_tournaments",
        JSON.stringify(updatedTournaments),
      );
      console.log("Tournament updated:", id);
      return true;
    } catch (error) {
      console.error("Error updating tournament:", error);
      return false;
    }
  };

  const deleteTournament = (id) => {
    try {
      const updatedTournaments = tournaments.filter((t) => t.id !== id);
      // Re-rank the tournaments
      const rerankedTournaments = updatedTournaments.map((t, index) => ({
        ...t,
        rank: String(index + 1).padStart(2, "0"),
      }));
      setTournaments(rerankedTournaments);
      localStorage.setItem(
        "app_tournaments",
        JSON.stringify(rerankedTournaments),
      );
      console.log("Tournament deleted:", id);
      return true;
    } catch (error) {
      console.error("Error deleting tournament:", error);
      return false;
    }
  };

  // Game CRUD Operations
  const addGame = (game) => {
    try {
      const currentGames = [...games];
      const newGame = { id: Date.now(), ...game };
      const updatedGames = [...currentGames, newGame];
      setGames(updatedGames);
      localStorage.setItem("app_games", JSON.stringify(updatedGames));
      console.log("Game added successfully!");
      return true;
    } catch (error) {
      console.error("Error adding game:", error);
      return false;
    }
  };

  const updateGame = (id, updatedData) => {
    try {
      const updatedGames = games.map((g) =>
        g.id === id ? { ...g, ...updatedData } : g,
      );
      setGames(updatedGames);
      localStorage.setItem("app_games", JSON.stringify(updatedGames));
      return true;
    } catch (error) {
      console.error("Error updating game:", error);
      return false;
    }
  };

  const deleteGame = (id) => {
    try {
      const updatedGames = games.filter((g) => g.id !== id);
      setGames(updatedGames);
      localStorage.setItem("app_games", JSON.stringify(updatedGames));
      return true;
    } catch (error) {
      console.error("Error deleting game:", error);
      return false;
    }
  };

  // Leaderboard CRUD Operations
  const addLeaderboardEntry = (entry) => {
    try {
      const currentLeaderboard = [...leaderboard];
      const newEntry = {
        id: Date.now(),
        rank: String(currentLeaderboard.length + 1).padStart(2, "0"),
        ...entry,
      };
      const updatedLeaderboard = [...currentLeaderboard, newEntry];
      setLeaderboard(updatedLeaderboard);
      localStorage.setItem(
        "app_leaderboard",
        JSON.stringify(updatedLeaderboard),
      );
      console.log("Leaderboard entry added successfully!");
      return true;
    } catch (error) {
      console.error("Error adding leaderboard entry:", error);
      return false;
    }
  };

  const updateLeaderboardEntry = (id, updatedData) => {
    try {
      const updatedLeaderboard = leaderboard.map((l) =>
        l.id === id ? { ...l, ...updatedData } : l,
      );
      setLeaderboard(updatedLeaderboard);
      localStorage.setItem(
        "app_leaderboard",
        JSON.stringify(updatedLeaderboard),
      );
      return true;
    } catch (error) {
      console.error("Error updating leaderboard entry:", error);
      return false;
    }
  };

  const deleteLeaderboardEntry = (id) => {
    try {
      const updatedLeaderboard = leaderboard.filter((l) => l.id !== id);
      // Re-rank the leaderboard
      const rerankedLeaderboard = updatedLeaderboard.map((l, index) => ({
        ...l,
        rank: String(index + 1).padStart(2, "0"),
      }));
      setLeaderboard(rerankedLeaderboard);
      localStorage.setItem(
        "app_leaderboard",
        JSON.stringify(rerankedLeaderboard),
      );
      return true;
    } catch (error) {
      console.error("Error deleting leaderboard entry:", error);
      return false;
    }
  };

  const value = {
    tournaments,
    games,
    leaderboard,
    loading,
    addTournament,
    updateTournament,
    deleteTournament,
    addGame,
    updateGame,
    deleteGame,
    addLeaderboardEntry,
    updateLeaderboardEntry,
    deleteLeaderboardEntry,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
