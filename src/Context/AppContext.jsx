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
  getTeams,
  deleteUser as deleteUserInDb,
  blockUser as blockUserInDb,
  unblockUser as unblockUserInDb,
  addTeam as addTeamInDb,
  updateTeam as updateTeamInDb,
  deleteTeam as deleteTeamInDb,
  getAdminComments,
  addAdminComment as addAdminCommentInDb,
  updateAdminComment as updateAdminCommentInDb,
  deleteAdminComment as deleteAdminCommentInDb,
  getMarquee,
  setMarquee as setMarqueeInDb,
  getCarouselAnnouncements,
  addCarouselAnnouncement as addCarouselAnnouncementInDb,
  updateCarouselAnnouncement as updateCarouselAnnouncementInDb,
  deleteCarouselAnnouncement as deleteCarouselAnnouncementInDb,
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

const defaultMarquee = {
  items: [
    "SEASON 6 NOW LIVE",
    "$2.8M PRIZE POOL",
    "WORLD CHAMPIONSHIP · DEC 2025",
    "NEW MAPS DROP TODAY",
    "REGISTER NOW",
  ]
};

function mergeMarquee(loaded) {
  if (!loaded || !Array.isArray(loaded.items)) return { ...defaultMarquee };
  return { items: loaded.items };
}

export const AppProvider = ({ children }) => {
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [hero, setHero] = useState(() => ({ ...defaultHero }));
  const [marquee, setMarquee] = useState(() => ({ ...defaultMarquee }));
  const [communityPosts, setCommunityPosts] = useState([]);
  const [adminComments, setAdminComments] = useState([]);
  const [announcementSlides, setAnnouncementSlides] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [dbTournaments, dbGames, dbLeaderboard, dbTeams] =
        await Promise.all([
          getTournaments(),
          getGames(),
          getLeaderboard(),
          getTeams(),
        ]);

      const [
        heroSnap,
        marqueeSnap,
        dbCommunity,
        rawUsers,
        rawAdminComments,
        dbAnnouncements,
      ] = await Promise.all([
        getHero(),
        getMarquee(),
        getCommunityPosts(),
        getUsers(),
        getAdminComments(),
        getCarouselAnnouncements(),
      ]);


      setTournaments(dbTournaments || []);
      setGames(dbGames || []);
      setLeaderboard(dbLeaderboard || []);
      setCommunityPosts(dbCommunity || []);
      setAdminComments(rawAdminComments || []);
      setAnnouncementSlides(dbAnnouncements || []);
      setUsers(rawUsers || []);
      setTeams(dbTeams || []);

      let heroMerged = mergeHero(heroSnap);
      if (!heroSnap) {
        await setHeroInDb(heroMerged);
        const again = await getHero();
        heroMerged = mergeHero(again);
      }
      setHero(heroMerged);

      let marqueeMerged = mergeMarquee(marqueeSnap);
      if (!marqueeSnap) {
        await setMarqueeInDb(marqueeMerged);
        const again = await getMarquee();
        marqueeMerged = mergeMarquee(again);
      }
      setMarquee(marqueeMerged);

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

  // Teams CRUD
  const addTeam = async (team) => {
    try {
      const created = await addTeamInDb(team);
      setTeams((prev) =>
        [...prev, created].sort((a, b) =>
          (a.name || "").localeCompare(b.name || ""),
        ),
      );
      return created;
    } catch (error) {
      console.error("Error adding team:", error);
      return null;
    }
  };

  const updateTeam = async (id, updatedData) => {
    try {
      await updateTeamInDb(id, updatedData);
      setTeams((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t)),
      );
      return true;
    } catch (error) {
      console.error("Error updating team:", error);
      return false;
    }
  };

  const deleteTeam = async (id) => {
    try {
      await deleteTeamInDb(id);
      setTeams((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting team:", error);
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

  const updateMarquee = async (partial) => {
    try {
      const snap = await getMarquee();
      const current = mergeMarquee(snap);
      const next = mergeMarquee({ ...current, ...partial });
      await setMarqueeInDb(next);
      const fresh = await getMarquee();
      setMarquee(mergeMarquee(fresh));
      return true;
    } catch (error) {
      console.error("Error updating marquee:", error);
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

  const addAdminComment = async (comment) => {
    try {
      const created = await addAdminCommentInDb(comment);
      // add to top since we sort by desc
      setAdminComments((prev) => [created, ...prev]);
      return created;
    } catch (error) {
      console.error("Error adding admin comment:", error);
      return null;
    }
  };

  const updateAdminComment = async (id, data) => {
    try {
      await updateAdminCommentInDb(id, data);
      setAdminComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data } : c)),
      );
      return true;
    } catch (error) {
      console.error("Error updating admin comment:", error);
      return false;
    }
  };

  const deleteAdminComment = async (id) => {
    try {
      await deleteAdminCommentInDb(id);
      setAdminComments((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting admin comment:", error);
      return false;
    }
  };

  // Carousel Announcement Slide Operations
  const addAnnouncementSlide = async (slide) => {
    try {
      const created = await addCarouselAnnouncementInDb(slide);
      setAnnouncementSlides((prev) => [created, ...prev]);
      return created;
    } catch (error) {
      console.error("Error adding announcement slide:", error);
      return null;
    }
  };

  const updateAnnouncementSlide = async (id, data) => {
    try {
      await updateCarouselAnnouncementInDb(id, data);
      setAnnouncementSlides((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s)),
      );
      return true;
    } catch (error) {
      console.error("Error updating announcement slide:", error);
      return false;
    }
  };

  const deleteAnnouncementSlide = async (id) => {
    try {
      await deleteCarouselAnnouncementInDb(id);
      setAnnouncementSlides((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting announcement slide:", error);
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
    teams,
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
    marquee,
    updateMarquee,
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
    addTeam,
    updateTeam,
    deleteTeam,
    announcementSlides,
    addAnnouncementSlide,
    updateAnnouncementSlide,
    deleteAnnouncementSlide,
  };


  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
