import { db } from "./config.js";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  setDoc,
  Timestamp,
} from "firebase/firestore";

// Collection references
const tournamentsCollection = collection(db, "tournaments");
const gamesCollection = collection(db, "games");
const leaderboardCollection = collection(db, "leaderboard");
const teamsCollection = collection(db, "teams");
const usersCollection = collection(db, "users");
const communityPostsCollection = collection(db, "communityPosts");
const adminCommentsCollection = collection(db, "adminComments");

// ============ TOURNAMENTS ============

// Get all tournaments
export const getTournaments = async () => {
  try {
    const q = query(tournamentsCollection, orderBy("rank", "asc"));
    const querySnapshot = await getDocs(q);
    const tournaments = [];
    querySnapshot.forEach((doc) => {
      tournaments.push({ id: doc.id, ...doc.data() });
    });
    return tournaments;
  } catch (error) {
    console.error("Error getting tournaments:", error);
    throw error;
  }
};

// Get a single tournament
export const getTournament = async (id) => {
  try {
    const docRef = doc(db, "tournaments", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting tournament:", error);
    throw error;
  }
};

// Add a tournament
export const addTournament = async (tournamentData) => {
  try {
    // Get all tournaments to determine new rank
    const allTournaments = await getTournaments();
    const newRank = String(allTournaments.length + 1).padStart(2, "0");

    const tournament = {
      ...tournamentData,
      rank: newRank,
      statusLabel:
        tournamentData.status === "live"
          ? "● Live Now"
          : tournamentData.status === "soon"
            ? "Soon"
            : "Open",
      isByAdmin: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(tournamentsCollection, tournament);
    return { id: docRef.id, ...tournament };
  } catch (error) {
    console.error("Error adding tournament:", error);
    throw error;
  }
};

// Update a tournament
export const updateTournament = async (id, tournamentData) => {
  try {
    const docRef = doc(db, "tournaments", id);
    await updateDoc(docRef, {
      ...tournamentData,
      updatedAt: Timestamp.now(),
    });
    return { id, ...tournamentData };
  } catch (error) {
    console.error("Error updating tournament:", error);
    throw error;
  }
};

// Delete a tournament
export const deleteTournament = async (id) => {
  try {
    const docRef = doc(db, "tournaments", id);
    await deleteDoc(docRef);

    // Re-rank remaining tournaments
    const remainingTournaments = await getTournaments();
    for (let i = 0; i < remainingTournaments.length; i++) {
      const newRank = String(i + 1).padStart(2, "0");
      await updateDoc(doc(db, "tournaments", remainingTournaments[i].id), {
        rank: newRank,
      });
    }

    return true;
  } catch (error) {
    console.error("Error deleting tournament:", error);
    throw error;
  }
};

export const getGames = async () => {
  try {
    const q = query(gamesCollection, orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    const games = [];
    querySnapshot.forEach((doc) => {
      games.push({ id: doc.id, ...doc.data() });
    });
    return games;
  } catch (error) {
    console.error("Error getting games:", error);
    throw error;
  }
};

// ============ TEAMS ============

export const getTeams = async () => {
  try {
    const q = query(teamsCollection, orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    const teams = [];
    querySnapshot.forEach((doc) => {
      teams.push({ id: doc.id, ...doc.data() });
    });
    return teams;
  } catch (error) {
    console.error("Error getting teams:", error);
    throw error;
  }
};

export const getTeam = async (id) => {
  try {
    const docRef = doc(db, "teams", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    return null;
  } catch (error) {
    console.error("Error getting team:", error);
    throw error;
  }
};

export const addTeam = async (teamData) => {
  try {
    const team = {
      ...teamData,
      isByAdmin: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(teamsCollection, team);
    return { id: docRef.id, ...team };
  } catch (error) {
    console.error("Error adding team:", error);
    throw error;
  }
};

export const updateTeam = async (id, teamData) => {
  try {
    const docRef = doc(db, "teams", id);
    await updateDoc(docRef, { ...teamData, updatedAt: Timestamp.now() });
    return { id, ...teamData };
  } catch (error) {
    console.error("Error updating team:", error);
    throw error;
  }
};

export const deleteTeam = async (id) => {
  try {
    const docRef = doc(db, "teams", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting team:", error);
    throw error;
  }
};

export const getGame = async (id) => {
  try {
    const docRef = doc(db, "games", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting game:", error);
    throw error;
  }
};

export const addGame = async (gameData) => {
  try {
    const game = {
      ...gameData,
      isByAdmin: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(gamesCollection, game);
    return { id: docRef.id, ...game };
  } catch (error) {
    console.error("Error adding game:", error);
    throw error;
  }
};

// Update a game
export const updateGame = async (id, gameData) => {
  try {
    const docRef = doc(db, "games", id);
    await updateDoc(docRef, {
      ...gameData,
      updatedAt: Timestamp.now(),
    });
    return { id, ...gameData };
  } catch (error) {
    console.error("Error updating game:", error);
    throw error;
  }
};

// Delete a game
export const deleteGame = async (id) => {
  try {
    const docRef = doc(db, "games", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting game:", error);
    throw error;
  }
};

// ============ LEADERBOARD ============

// Get all leaderboard entries
export const getLeaderboard = async () => {
  try {
    const q = query(leaderboardCollection, orderBy("rank", "asc"));
    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      leaderboard.push({ id: doc.id, ...doc.data() });
    });
    return leaderboard;
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    throw error;
  }
};

// Add a leaderboard entry
export const addLeaderboardEntry = async (entryData) => {
  try {
    const allEntries = await getLeaderboard();
    const newRank = String(allEntries.length + 1).padStart(2, "0");

    const entry = {
      ...entryData,
      rank: newRank,
      isByAdmin: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(leaderboardCollection, entry);
    return { id: docRef.id, ...entry };
  } catch (error) {
    console.error("Error adding leaderboard entry:", error);
    throw error;
  }
};

// Update a leaderboard entry
export const updateLeaderboardEntry = async (id, entryData) => {
  try {
    const docRef = doc(db, "leaderboard", id);
    await updateDoc(docRef, {
      ...entryData,
      updatedAt: Timestamp.now(),
    });
    return { id, ...entryData };
  } catch (error) {
    console.error("Error updating leaderboard entry:", error);
    throw error;
  }
};

// Delete a leaderboard entry
export const deleteLeaderboardEntry = async (id) => {
  try {
    const docRef = doc(db, "leaderboard", id);
    await deleteDoc(docRef);

    // Re-rank remaining entries
    const remainingEntries = await getLeaderboard();
    for (let i = 0; i < remainingEntries.length; i++) {
      const newRank = String(i + 1).padStart(2, "0");
      await updateDoc(doc(db, "leaderboard", remainingEntries[i].id), {
        rank: newRank,
      });
    }

    return true;
  } catch (error) {
    console.error("Error deleting leaderboard entry:", error);
    throw error;
  }
};

// ============ USERS ============

// Get all users
export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(usersCollection);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

// Add a user
export const addUser = async (userData) => {
  try {
    const user = {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(usersCollection, user);
    return { id: docRef.id, ...user };
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// Update a user
export const updateUser = async (id, userData) => {
  try {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      ...userData,
      updatedAt: Timestamp.now(),
    });
    return { id, ...userData };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id) => {
  try {
    const docRef = doc(db, "users", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Block a user
export const blockUser = async (id) => {
  try {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      isBlocked: true,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
};

// Unblock a user
export const unblockUser = async (id) => {
  try {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      isBlocked: false,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error("Error unblocking user:", error);
    throw error;
  }
};

// ============ HERO (single doc: siteSettings/hero) ============

const heroDocRef = doc(db, "siteSettings", "hero");

export const getHero = async () => {
  try {
    const snap = await getDoc(heroDocRef);
    if (!snap.exists()) return null;
    return snap.data();
  } catch (error) {
    console.error("Error getting hero:", error);
    throw error;
  }
};

export const setHero = async (data) => {
  try {
    await setDoc(
      heroDocRef,
      { ...data, updatedAt: Timestamp.now() },
      { merge: true },
    );
    const snap = await getDoc(heroDocRef);
    return snap.exists() ? snap.data() : data;
  } catch (error) {
    console.error("Error saving hero:", error);
    throw error;
  }
};

// ============ MARQUEE (single doc: siteSettings/marquee) ============

const marqueeDocRef = doc(db, "siteSettings", "marquee");

export const getMarquee = async () => {
  try {
    const snap = await getDoc(marqueeDocRef);
    if (!snap.exists()) return null;
    return snap.data();
  } catch (error) {
    console.error("Error getting marquee:", error);
    throw error;
  }
};

export const setMarquee = async (data) => {
  try {
    await setDoc(
      marqueeDocRef,
      { ...data, updatedAt: Timestamp.now() },
      { merge: true },
    );
    const snap = await getDoc(marqueeDocRef);
    return snap.exists() ? snap.data() : data;
  } catch (error) {
    console.error("Error saving marquee:", error);
    throw error;
  }
};

// ============ COMMUNITY POSTS (reviews / testimonials) ============

export const getCommunityPosts = async () => {
  try {
    const q = query(communityPostsCollection, orderBy("sortOrder", "asc"));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((d) => {
      posts.push({ id: d.id, ...d.data() });
    });
    return posts;
  } catch (error) {
    console.error("Error getting community posts:", error);
    throw error;
  }
};

export const addCommunityPost = async (postData) => {
  try {
    const snap = await getDocs(communityPostsCollection);
    let maxSort = -1;
    snap.forEach((d) => {
      const s = d.data().sortOrder;
      if (typeof s === "number" && s > maxSort) maxSort = s;
    });
    const sortOrder = maxSort + 1;

    const post = {
      stars: postData.stars || "★★★★★",
      av: postData.av || "ra1",
      letter: postData.letter || "?",
      name: postData.name || "",
      handle: postData.handle || "",
      text: postData.text || "",
      sortOrder,
      isByAdmin: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(communityPostsCollection, post);
    return { id: docRef.id, ...post };
  } catch (error) {
    console.error("Error adding community post:", error);
    throw error;
  }
};

export const updateCommunityPost = async (id, postData) => {
  try {
    const docRef = doc(db, "communityPosts", id);
    await updateDoc(docRef, {
      ...postData,
      updatedAt: Timestamp.now(),
    });
    return { id, ...postData };
  } catch (error) {
    console.error("Error updating community post:", error);
    throw error;
  }
};

export const deleteCommunityPost = async (id) => {
  try {
    const docRef = doc(db, "communityPosts", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting community post:", error);
    throw error;
  }
};

// ============ ADMIN COMMENTS ============

export const getAdminComments = async () => {
  try {
    const q = query(adminCommentsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const comments = [];
    querySnapshot.forEach((d) => {
      comments.push({ id: d.id, ...d.data() });
    });
    return comments;
  } catch (error) {
    console.error("Error getting admin comments:", error);
    throw error;
  }
};

export const addAdminComment = async (commentData) => {
  try {
    const comment = {
      author: commentData.author || "Admin",
      text: commentData.text || "",
      isByAdmin: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(adminCommentsCollection, comment);
    return { id: docRef.id, ...comment };
  } catch (error) {
    console.error("Error adding admin comment:", error);
    throw error;
  }
};

export const updateAdminComment = async (id, commentData) => {
  try {
    const docRef = doc(db, "adminComments", id);
    await updateDoc(docRef, {
      ...commentData,
      updatedAt: Timestamp.now(),
    });
    return { id, ...commentData };
  } catch (error) {
    console.error("Error updating admin comment:", error);
    throw error;
  }
};

export const deleteAdminComment = async (id) => {
  try {
    const docRef = doc(db, "adminComments", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting admin comment:", error);
    throw error;
  }
};
