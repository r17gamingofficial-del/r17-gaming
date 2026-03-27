import React, { createContext, useState, useContext, useEffect } from "react";
import {
  addGame as addGameInDb,
  addLeaderboardEntry as addLeaderboardEntryInDb,
  addTournament as addTournamentInDb,
  deleteGame as deleteGameInDb,
  deleteLeaderboardEntry as deleteLeaderboardEntryInDb,
  deleteTournament as deleteTournamentInDb,
  getGames,
  getLeaderboard,
  getTournaments,
  updateGame as updateGameInDb,
  updateLeaderboardEntry as updateLeaderboardEntryInDb,
  updateTournament as updateTournamentInDb,
} from "../Firebase/fireStoreService.js";

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

  const loadData = async () => {
    try {
      setLoading(true);

      // Default tournaments data with gallery arrays
      const defaultTournaments = [
        {
          rank: "01",
          name: "World Championship Series — Shadow Realm",
          date: "🗓 Dec 15–20, 2025",
          region: "🌍 Global",
          teams: "128 Teams",
          status: "live",
          statusLabel: "● Live Now",
          prize: "$500,000",
          thumbnail:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
          videoUrl:
            "https://www.youtube.com/embed/Pte7C8wjp1w?autoplay=1&mute=1&loop=1&playlist=Pte7C8wjp1w&controls=0&modestbranding=1&rel=0",
          gallery: [
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&h=400&fit=crop",
          ],
        },
        {
          rank: "02",
          name: "Neon Strike Pro League — Season 6 Playoffs",
          date: "🗓 Jan 5–12, 2026",
          region: "🌍 Asia–Pacific",
          teams: "64 Teams",
          status: "soon",
          statusLabel: "Soon",
          prize: "$250,000",
          thumbnail:
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
          videoUrl:
            "https://www.youtube.com/embed/Pte7C8wjp1w?autoplay=1&mute=1&loop=1&playlist=Pte7C8wjp1w&controls=0&modestbranding=1&rel=0",
          gallery: [
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop",
          ],
        },
        {
          rank: "03",
          name: "Cyber Siege Invitational Cup — EU Finals",
          date: "🗓 Jan 18–19, 2026",
          region: "🌍 Europe",
          teams: "32 Teams",
          status: "open",
          statusLabel: "Open",
          prize: "$120,000",
          thumbnail:
            "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop",
          videoUrl:
            "https://www.youtube.com/embed/Pte7C8wjp1w?autoplay=1&mute=1&loop=1&playlist=Pte7C8wjp1w&controls=0&modestbranding=1&rel=0",
          gallery: [
            "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
          ],
        },
      ];

      const defaultGames = [
        {
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
          rank: "01",
          playerName: "ZephyrX",
          country: "🇰🇷 South Korea",
          score: "98,420",
          kd: "4.8",
          game: "Shadow Realm",
        },
        {
          rank: "02",
          playerName: "NovaBurst",
          country: "🇸🇪 Sweden",
          score: "94,105",
          kd: "4.3",
          game: "Cyber Siege",
        },
        {
          rank: "03",
          playerName: "R17_Ghost",
          country: "🇧🇷 Brazil",
          score: "91,882",
          kd: "4.1",
          game: "Neon Strike",
        },
      ];

      const [dbTournaments, dbGames, dbLeaderboard] = await Promise.all([
        getTournaments(),
        getGames(),
        getLeaderboard(),
      ]);

      if (!dbTournaments?.length) {
        for (const t of defaultTournaments) {
          // Firestore service will compute rank/statusLabel/createdAt
          // Keep gallery as array
          await addTournamentInDb(t);
        }
      }

      if (!dbGames?.length) {
        for (const g of defaultGames) {
          await addGameInDb(g);
        }
      }

      if (!dbLeaderboard?.length) {
        for (const l of defaultLeaderboard) {
          await addLeaderboardEntryInDb(l);
        }
      }

      const [finalTournaments, finalGames, finalLeaderboard] =
        await Promise.all([getTournaments(), getGames(), getLeaderboard()]);

      setTournaments(finalTournaments);
      setGames(finalGames);
      setLeaderboard(finalLeaderboard);

      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  // Tournament CRUD Operations
  const addTournament = async (tournament) => {
    try {
      const created = await addTournamentInDb(tournament);
      setTournaments((prev) => [...prev, created].sort((a, b) => a.rank.localeCompare(b.rank)));
      return created;
    } catch (error) {
      console.error("Error adding tournament:", error);
      return null;
    }
  };

  const updateTournament = async (id, updatedData) => {
    try {
      await updateTournamentInDb(id, updatedData);
      setTournaments((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t)),
      );
      return true;
    } catch (error) {
      console.error("Error updating tournament:", error);
      return false;
    }
  };

  const deleteTournament = async (id) => {
    try {
      await deleteTournamentInDb(id);
      const refreshed = await getTournaments();
      setTournaments(refreshed);
      return true;
    } catch (error) {
      console.error("Error deleting tournament:", error);
      return false;
    }
  };

  // Game CRUD Operations
  const addGame = async (game) => {
    try {
      const created = await addGameInDb(game);
      setGames((prev) => [...prev, created]);
      return created;
    } catch (error) {
      console.error("Error adding game:", error);
      return null;
    }
  };

  const updateGame = async (id, updatedData) => {
    try {
      await updateGameInDb(id, updatedData);
      setGames((prev) => prev.map((g) => (g.id === id ? { ...g, ...updatedData } : g)));
      return true;
    } catch (error) {
      console.error("Error updating game:", error);
      return false;
    }
  };

  const deleteGame = async (id) => {
    try {
      await deleteGameInDb(id);
      setGames((prev) => prev.filter((g) => g.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting game:", error);
      return false;
    }
  };

  // Leaderboard CRUD Operations
  const addLeaderboardEntry = async (entry) => {
    try {
      const created = await addLeaderboardEntryInDb(entry);
      setLeaderboard((prev) => [...prev, created].sort((a, b) => a.rank.localeCompare(b.rank)));
      return created;
    } catch (error) {
      console.error("Error adding leaderboard entry:", error);
      return null;
    }
  };

  const updateLeaderboardEntry = async (id, updatedData) => {
    try {
      await updateLeaderboardEntryInDb(id, updatedData);
      setLeaderboard((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updatedData } : l)),
      );
      return true;
    } catch (error) {
      console.error("Error updating leaderboard entry:", error);
      return false;
    }
  };

  const deleteLeaderboardEntry = async (id) => {
    try {
      await deleteLeaderboardEntryInDb(id);
      const refreshed = await getLeaderboard();
      setLeaderboard(refreshed);
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
