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
  getHero,
  setHero as setHeroInDb,
  getCommunityPosts,
  addCommunityPost as addCommunityPostInDb,
  updateCommunityPost as updateCommunityPostInDb,
  deleteCommunityPost as deleteCommunityPostInDb,
  getUsers,
  deleteUser as deleteUserInDb,
  blockUser as blockUserInDb,
  unblockUser as unblockUserInDb,
} from "../Firebase/fireStoreService.js";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

const defaultHero = {
  backgroundMode: "youtube",
  backgroundImageUrl: "",
  youtubeVideoId: "EZMYvAWbyLo",
  titleGlitch: "DOMINATE",
  titlePrefix: "THE ",
  titleAccent: "ARENA",
  subtitle:
    "Elite competitive gaming. Forge your legacy. Rise through the ranks and claim glory in the world's most intense tournaments.",
  stats: [
    { main: "4.2", inner: "M", label: "Active Players" },
    { main: "$", inner: "2.8M", label: "Prize Pool" },
    { main: "340", inner: "+", label: "Tournaments" },
    { main: "18", inner: "+", label: "Game Titles" },
  ],
};

function mergeHero(loaded) {
  if (!loaded || typeof loaded !== "object") return { ...defaultHero };
  const stats =
    Array.isArray(loaded.stats) && loaded.stats.length
      ? loaded.stats.map((s, i) => ({
          main: s?.main ?? defaultHero.stats[i]?.main ?? "",
          inner: s?.inner ?? defaultHero.stats[i]?.inner ?? "",
          label: s?.label ?? defaultHero.stats[i]?.label ?? "",
        }))
      : defaultHero.stats;
  return {
    ...defaultHero,
    ...loaded,
    stats,
  };
}

export const AppProvider = ({ children }) => {
  const [tournaments, setTournaments] = useState([]);
  const [games, setGames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [hero, setHero] = useState(() => ({ ...defaultHero }));
  const [communityPosts, setCommunityPosts] = useState([]);
  const [users, setUsers] = useState([]);
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

      const defaultCommunityPosts = [
        {
          stars: "★★★★★",
          av: "ra1",
          letter: "Z",
          name: "ZephyrX",
          handle: "@zephyrx_pro · Shadow Realm",
          text: "R17 completely changed how I approach competitive gaming. The tournament system is flawless and prize payouts are always on time. Addicted since day one.",
        },
        {
          stars: "★★★★★",
          av: "ra2",
          letter: "N",
          name: "NovaBurst",
          handle: "@novaburst_eu · Cyber Siege",
          text: "Nothing comes close to the competition here. I've been in esports for 8 years and R17 has the best infrastructure I've ever played on. Period.",
        },
        {
          stars: "★★★★★",
          av: "ra3",
          letter: "K",
          name: "KryptonPeak",
          handle: "@kryptonpeak · Iron Legion",
          text: "I went from casual to winning my first $10K tournament in three months. The ranked system genuinely pushes you to improve every single match.",
        },
        {
          stars: "★★★★☆",
          av: "ra4",
          letter: "S",
          name: "SolarWarden",
          handle: "@solarwarden · Neon Strike",
          text: "The matchmaking is incredibly fair. Never felt thrown into impossible games. Steady climb up the leaderboard since joining six months ago.",
        },
        {
          stars: "★★★★★",
          av: "ra5",
          letter: "V",
          name: "VoidHunter",
          handle: "@voidhunter_de · Void Protocol",
          text: "Community events, weekly tournaments, daily challenges — there's always something happening. This platform has everything a competitive player needs.",
        },
        {
          stars: "★★★★★",
          av: "ra6",
          letter: "P",
          name: "PhantomAce",
          handle: "@phantomace_jp · Phantom Arena",
          text: "As a streamer, the spectator mode is unreal. My viewers see live stats in real-time. Completely game-changing feature I haven't seen built this well anywhere else.",
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

      const [
        finalTournaments,
        finalGames,
        finalLeaderboard,
        heroSnap,
        rawCommunity,
        rawUsers,
      ] = await Promise.all([
        getTournaments(),
        getGames(),
        getLeaderboard(),
        getHero(),
        getCommunityPosts(),
        getUsers(),
      ]);

      let communityFinal = rawCommunity;
      if (!communityFinal?.length) {
        for (const p of defaultCommunityPosts) {
          await addCommunityPostInDb(p);
        }
        communityFinal = await getCommunityPosts();
      }
      setCommunityPosts(communityFinal);
      setUsers(rawUsers || []);

      let heroMerged = mergeHero(heroSnap);
      if (!heroSnap) {
        await setHeroInDb(heroMerged);
        const again = await getHero();
        heroMerged = mergeHero(again);
      }
      setHero(heroMerged);

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
      setTournaments((prev) =>
        [...prev, created].sort((a, b) => a.rank.localeCompare(b.rank)),
      );
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
      setGames((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...updatedData } : g)),
      );
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
      setLeaderboard((prev) =>
        [...prev, created].sort((a, b) => a.rank.localeCompare(b.rank)),
      );
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

  const updateHero = async (partial) => {
    try {
      const snap = await getHero();
      const current = mergeHero(snap);
      const next = mergeHero({ ...current, ...partial });
      await setHeroInDb(next);
      const fresh = await getHero();
      setHero(mergeHero(fresh));
      return true;
    } catch (error) {
      console.error("Error updating hero:", error);
      return false;
    }
  };

  const addCommunityPost = async (post) => {
    try {
      const created = await addCommunityPostInDb(post);
      setCommunityPosts((prev) =>
        [...prev, created].sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
        ),
      );
      return created;
    } catch (error) {
      console.error("Error adding community post:", error);
      return null;
    }
  };

  const updateCommunityPost = async (id, data) => {
    try {
      await updateCommunityPostInDb(id, data);
      setCommunityPosts((prev) =>
        prev
          .map((p) => (p.id === id ? { ...p, ...data } : p))
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
      );
      return true;
    } catch (error) {
      console.error("Error updating community post:", error);
      return false;
    }
  };

  const deleteCommunityPost = async (id) => {
    try {
      await deleteCommunityPostInDb(id);
      const refreshed = await getCommunityPosts();
      setCommunityPosts(refreshed);
      return true;
    } catch (error) {
      console.error("Error deleting community post:", error);
      return false;
    }
  };

  // User Management Operations
  const blockUser = async (id) => {
    try {
      await blockUserInDb(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isBlocked: true } : u)),
      );
      return true;
    } catch (error) {
      console.error("Error blocking user:", error);
      return false;
    }
  };

  const unblockUser = async (id) => {
    try {
      await unblockUserInDb(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isBlocked: false } : u)),
      );
      return true;
    } catch (error) {
      console.error("Error unblocking user:", error);
      return false;
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteUserInDb(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  };

  const value = {
    tournaments,
    games,
    leaderboard,
    hero,
    communityPosts,
    users,
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
    updateHero,
    addCommunityPost,
    updateCommunityPost,
    deleteCommunityPost,
    blockUser,
    unblockUser,
    deleteUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
