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
  runTransaction,
} from "firebase/firestore";

// Collection references
const tournamentsCollection = collection(db, "tournaments");
const gamesCollection = collection(db, "games");
const leaderboardCollection = collection(db, "leaderboard");
const teamsCollection = collection(db, "teams");
const usersCollection = collection(db, "users");
const communityPostsCollection = collection(db, "communityPosts");
const adminCommentsCollection = collection(db, "adminComments");
const carouselAnnouncementsCollection = collection(db, "carouselAnnouncements");
const storeProductsCollection = collection(db, "storeProducts");
const storeOrdersCollection = collection(db, "storeOrders");

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const getTime = (value) => {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const createOrderNumber = () =>
  `R17-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;


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

// ============ STORE ============

export const getStoreProducts = async () => {
  try {
    const querySnapshot = await getDocs(storeProductsCollection);
    const products = [];
    querySnapshot.forEach((d) => {
      products.push({ id: d.id, ...d.data() });
    });
    return products.sort(
      (a, b) =>
        toNumber(a.sortOrder) - toNumber(b.sortOrder) ||
        (a.name || "").localeCompare(b.name || ""),
    );
  } catch (error) {
    console.error("Error getting store products:", error);
    throw error;
  }
};

export const addStoreProduct = async (productData) => {
  try {
    const product = {
      name: productData.name || "",
      category: productData.category || "Jerseys",
      price: toNumber(productData.price),
      stock: toNumber(productData.stock),
      badge: productData.badge || "",
      featured: Boolean(productData.featured),
      isActive: productData.isActive !== false,
      image: productData.image || "",
      desc: productData.desc || "",
      sortOrder: toNumber(productData.sortOrder),
      isByAdmin: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(storeProductsCollection, product);
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error("Error adding store product:", error);
    throw error;
  }
};

export const updateStoreProduct = async (id, productData) => {
  try {
    const docRef = doc(db, "storeProducts", id);
    const update = {
      ...productData,
      price: toNumber(productData.price),
      stock: toNumber(productData.stock),
      sortOrder: toNumber(productData.sortOrder),
      updatedAt: Timestamp.now(),
    };
    await updateDoc(docRef, update);
    return { id, ...update };
  } catch (error) {
    console.error("Error updating store product:", error);
    throw error;
  }
};

export const deleteStoreProduct = async (id) => {
  try {
    await deleteDoc(doc(db, "storeProducts", id));
    return true;
  } catch (error) {
    console.error("Error deleting store product:", error);
    throw error;
  }
};

export const getStoreOrders = async () => {
  try {
    const querySnapshot = await getDocs(storeOrdersCollection);
    const orders = [];
    querySnapshot.forEach((d) => {
      orders.push({ id: d.id, ...d.data() });
    });
    return orders.sort((a, b) => getTime(b.createdAt) - getTime(a.createdAt));
  } catch (error) {
    console.error("Error getting store orders:", error);
    throw error;
  }
};

export const createStoreOrder = async (orderData) => {
  try {
    const requestedItems = Array.isArray(orderData.items)
      ? orderData.items.filter((item) => toNumber(item.quantity) > 0)
      : [];

    if (!requestedItems.length) {
      throw new Error("Order must contain at least one product.");
    }

    const orderRef = doc(storeOrdersCollection);
    const now = Timestamp.now();

    return await runTransaction(db, async (transaction) => {
      const enrichedItems = [];
      const productIds = [
        ...new Set(requestedItems.map((item) => item.productId || item.id)),
      ].filter(Boolean);
      const productRefs = new Map(
        productIds.map((productId) => [productId, doc(db, "storeProducts", productId)]),
      );
      const productSnaps = new Map();
      const quantityByProduct = new Map();
      let subtotal = 0;

      for (const [productId, productRef] of productRefs) {
        productSnaps.set(productId, await transaction.get(productRef));
      }

      for (const item of requestedItems) {
        const productId = item.productId || item.id;
        if (!productId) {
          throw new Error("Order item is missing a product id.");
        }

        const quantity = toNumber(item.quantity, 1);
        const productSnap = productSnaps.get(productId);

        if (!productSnap?.exists()) {
          throw new Error("One of the products is no longer available.");
        }

        const product = productSnap.data();
        if (product.isActive === false) {
          throw new Error(`${product.name || "Product"} is not active.`);
        }

        const currentStock = toNumber(product.stock);
        const nextQuantity = (quantityByProduct.get(productId) || 0) + quantity;
        if (currentStock < nextQuantity) {
          throw new Error(`${product.name || "Product"} does not have enough stock.`);
        }
        quantityByProduct.set(productId, nextQuantity);

        const price = toNumber(product.price);
        const lineTotal = price * quantity;
        subtotal += lineTotal;

        enrichedItems.push({
          productId,
          name: product.name || "Product",
          category: product.category || "",
          image: product.image || "",
          price,
          quantity,
          selectedSize: item.selectedSize || "",
          lineTotal,
        });
      }

      for (const [productId, quantity] of quantityByProduct) {
        const productSnap = productSnaps.get(productId);
        transaction.update(productRefs.get(productId), {
          stock: toNumber(productSnap.data().stock) - quantity,
          updatedAt: now,
        });
      }

      const shippingFee = toNumber(orderData.shippingFee);
      const paymentMethod = orderData.paymentMethod || "cod";
      const order = {
        orderNumber: orderData.orderNumber || createOrderNumber(),
        items: enrichedItems,
        customer: orderData.customer || {},
        subtotal,
        shippingFee,
        total: subtotal + shippingFee,
        currency: orderData.currency || "INR",
        paymentMethod,
        paymentStatus:
          orderData.paymentStatus || (paymentMethod === "online" ? "paid" : "cod_pending"),
        fulfillmentStatus: orderData.fulfillmentStatus || "processing",
        userId: orderData.userId || null,
        userEmail: orderData.userEmail || "",
        payment: orderData.payment || null,
        createdAt: now,
        updatedAt: now,
      };

      transaction.set(orderRef, order);
      return { id: orderRef.id, ...order };
    });
  } catch (error) {
    console.error("Error creating store order:", error);
    throw error;
  }
};

export const updateStoreOrder = async (id, orderData) => {
  try {
    const docRef = doc(db, "storeOrders", id);
    const update = {
      ...orderData,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(docRef, update);
    return { id, ...update };
  } catch (error) {
    console.error("Error updating store order:", error);
    throw error;
  }
};

export const deleteStoreOrder = async (id) => {
  try {
    await deleteDoc(doc(db, "storeOrders", id));
    return true;
  } catch (error) {
    console.error("Error deleting store order:", error);
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

// ============ CAROUSEL ANNOUNCEMENTS ============

export const getCarouselAnnouncements = async () => {
  try {
    const q = query(carouselAnnouncementsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const announcements = [];
    querySnapshot.forEach((d) => {
      announcements.push({ id: d.id, ...d.data() });
    });
    return announcements;
  } catch (error) {
    console.error("Error getting carousel announcements:", error);
    throw error;
  }
};

export const addCarouselAnnouncement = async (data) => {
  try {
    const announcement = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(carouselAnnouncementsCollection, announcement);
    return { id: docRef.id, ...announcement };
  } catch (error) {
    console.error("Error adding carousel announcement:", error);
    throw error;
  }
};

export const updateCarouselAnnouncement = async (id, data) => {
  try {
    const docRef = doc(db, "carouselAnnouncements", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    return { id, ...data };
  } catch (error) {
    console.error("Error updating carousel announcement:", error);
    throw error;
  }
};

export const deleteCarouselAnnouncement = async (id) => {
  try {
    const docRef = doc(db, "carouselAnnouncements", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting carousel announcement:", error);
    throw error;
  }
};

