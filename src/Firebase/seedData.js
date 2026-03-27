import { db } from "./config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const initialTournaments = [
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
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
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
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    videoUrl:
      "https://www.youtube.com/embed/Pte7C8wjp1w?autoplay=1&mute=1&loop=1&playlist=Pte7C8wjp1w&controls=0&modestbranding=1&rel=0",
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
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    videoUrl:
      "https://www.youtube.com/embed/Pte7C8wjp1w?autoplay=1&mute=1&loop=1&playlist=Pte7C8wjp1w&controls=0&modestbranding=1&rel=0",
    gallery: [
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    ],
  },
];

const initialGames = [
  {
    name: "Shadow Realm",
    category: "FPS",
    players: "4.2M",
    description: "Intense tactical shooter",
    art: "SR",
    tag: "HOT",
    tagClass: "gold-tag",
    platforms: ["PC", "PS5"],
    genre: "Tactical FPS",
    stars: "★★★★★",
    rating: "4.9 / 5 · 120K reviews",
    featuredTitle: "SHADOW REALM X",
    featuredScore: "9.8",
    featuredMeta: ["🎮 Tactical FPS", "👥 5v5", "🏆 $500K Prize Pool"],
    featuredTags: ["Season 6 Live", "128-Tick Servers", "Anti-Cheat"],
    featuredDesc: "The next evolution of tactical shooters is here.",
    featuredButtonText: "Play Now — Free",
    videoUrl:
      "https://www.youtube.com/embed/Pte7C8wjp1w?autoplay=1&mute=1&loop=1",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Add more games...
];

export const seedDatabase = async () => {
  try {
    // Seed tournaments
    const tournamentsCol = collection(db, "tournaments");
    for (const tournament of initialTournaments) {
      await addDoc(tournamentsCol, tournament);
    }
    console.log("Tournaments seeded successfully");

    // Seed games
    const gamesCol = collection(db, "games");
    for (const game of initialGames) {
      await addDoc(gamesCol, game);
    }
    console.log("Games seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
