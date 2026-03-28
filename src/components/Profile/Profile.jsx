import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../Firebase/config";
import "./Profile.css";

function formatJoined(ts) {
  if (!ts) return "—";
  try {
    const d = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function Profile() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [firestoreProfile, setFirestoreProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [registeredTournaments, setRegisteredTournaments] = useState([]);
  const [wonTournaments, setWonTournaments] = useState([]);
  const [tournamentsLoading, setTournamentsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("registered");

  useEffect(() => {
    if (!user?.uid) {
      setFirestoreProfile(null);
      setProfileLoading(false);
      setTournamentsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setProfileLoading(true);
      setTournamentsLoading(true);

      try {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!cancelled && userDoc.exists()) {
          setFirestoreProfile(userDoc.data());
        } else if (!cancelled) {
          setFirestoreProfile(null);
        }

        // Fetch registered tournaments
        const registrationsQuery = query(
          collection(db, "tournamentRegistrations"),
          where("userId", "==", user.uid),
          where("status", "in", ["registered", "confirmed"]),
        );
        const registrationsSnapshot = await getDocs(registrationsQuery);

        const registered = [];
        for (const regDoc of registrationsSnapshot.docs) {
          const regData = regDoc.data();
          const tournamentDoc = await getDoc(
            doc(db, "tournaments", regData.tournamentId),
          );
          if (tournamentDoc.exists()) {
            registered.push({
              id: tournamentDoc.id,
              registrationId: regDoc.id,
              ...tournamentDoc.data(),
              registeredAt: regData.registeredAt,
              status: regData.status,
            });
          }
        }

        if (!cancelled) setRegisteredTournaments(registered);

        // Fetch won tournaments
        const winsQuery = query(
          collection(db, "tournamentRegistrations"),
          where("userId", "==", user.uid),
          where("status", "==", "won"),
        );
        const winsSnapshot = await getDocs(winsQuery);

        const won = [];
        for (const winDoc of winsSnapshot.docs) {
          const winData = winDoc.data();
          const tournamentDoc = await getDoc(
            doc(db, "tournaments", winData.tournamentId),
          );
          if (tournamentDoc.exists()) {
            won.push({
              id: tournamentDoc.id,
              registrationId: winDoc.id,
              ...tournamentDoc.data(),
              wonAt: winData.wonAt,
              placement: winData.placement || "1st",
            });
          }
        }

        if (!cancelled) setWonTournaments(won);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
          setTournamentsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  if (loading) {
    return (
      <div className="profile-page profile-page--loading">
        <p className="profile-loading-text">Loading profile…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const displayName =
    firestoreProfile?.name?.trim() || user.displayName?.trim() || "Player";
  const initial = (displayName[0] || user.email?.[0] || "?").toUpperCase();

  return (
    <div className="profile-page">
      <div className="profile-card reveal visible">
        <div className="profile-card-header">
          <div className="profile-avatar-large">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" />
            ) : (
              <span>{initial}</span>
            )}
          </div>
          <h1 className="profile-title">Your profile</h1>
          <p className="profile-sub">Account details and session</p>
        </div>

        <dl className="profile-details">
          <div className="profile-row">
            <dt>Name</dt>
            <dd>{profileLoading ? "…" : displayName}</dd>
          </div>
          <div className="profile-row">
            <dt>Email</dt>
            <dd>{user.email || "—"}</dd>
          </div>
          <div className="profile-row">
            <dt>Member since</dt>
            <dd>
              {profileLoading ? "…" : formatJoined(firestoreProfile?.createdAt)}
            </dd>
          </div>
          <div className="profile-row">
            <dt>Tournaments entered</dt>
            <dd>{registeredTournaments.length + wonTournaments.length}</dd>
          </div>
          <div className="profile-row">
            <dt>Tournaments won</dt>
            <dd className="profile-wins-count">{wonTournaments.length}</dd>
          </div>
        </dl>

        {/* Tournaments Section */}
        <div className="profile-tournaments-section">
          <div className="profile-tournaments-header">
            <h3>Your Tournaments</h3>
            <div className="profile-tournaments-tabs">
              <button
                className={`tab-btn ${activeTab === "registered" ? "active" : ""}`}
                onClick={() => setActiveTab("registered")}
              >
                Registered ({registeredTournaments.length})
              </button>
              <button
                className={`tab-btn ${activeTab === "won" ? "active" : ""}`}
                onClick={() => setActiveTab("won")}
              >
                Won ({wonTournaments.length})
              </button>
            </div>
          </div>

          {tournamentsLoading ? (
            <div className="tournaments-loading">
              <div className="loader"></div>
              <p>Loading your tournaments...</p>
            </div>
          ) : activeTab === "registered" ? (
            registeredTournaments.length > 0 ? (
              <div className="tournaments-grid">
                {registeredTournaments.map((tournament) => (
                  <div key={tournament.id} className="tournament-card-mini">
                    <div className="tournament-card-mini-image">
                      <img
                        src={tournament.thumbnail || tournament.image}
                        alt={tournament.name}
                      />
                      <div
                        className={`tournament-status status-${tournament.status}`}
                      >
                        {tournament.statusLabel || tournament.status}
                      </div>
                    </div>
                    <div className="tournament-card-mini-content">
                      <h4>{tournament.name}</h4>
                      <div className="tournament-meta">
                        <span>📅 {tournament.date}</span>
                        <span>🌍 {tournament.region}</span>
                        <span>🏆 {tournament.prize}</span>
                      </div>
                      <div className="registration-info">
                        <span className="registered-badge">✓ Registered</span>
                        <span className="registered-date">
                          Joined: {formatJoined(tournament.registeredAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-tournaments">
                <p>You haven't registered for any tournaments yet.</p>
                <button
                  className="browse-tournaments-btn"
                  onClick={() => navigate("/#tournaments")}
                >
                  Browse Tournaments →
                </button>
              </div>
            )
          ) : wonTournaments.length > 0 ? (
            <div className="tournaments-grid">
              {wonTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="tournament-card-mini winner-card"
                >
                  <div className="winner-badge">🏆 WINNER</div>
                  <div className="tournament-card-mini-image">
                    <img
                      src={tournament.thumbnail || tournament.image}
                      alt={tournament.name}
                    />
                    <div className="placement-badge">
                      {tournament.placement} Place
                    </div>
                  </div>
                  <div className="tournament-card-mini-content">
                    <h4>{tournament.name}</h4>
                    <div className="tournament-meta">
                      <span>📅 {tournament.date}</span>
                      <span>🌍 {tournament.region}</span>
                      <span>🏆 {tournament.prize}</span>
                    </div>
                    <div className="win-info">
                      <span className="win-badge">🎉 VICTORY!</span>
                      <span className="win-date">
                        Won: {formatJoined(tournament.wonAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-tournaments">
              <p>You haven't won any tournaments yet. Keep practicing!</p>
              <button
                className="browse-tournaments-btn"
                onClick={() => navigate("/#tournaments")}
              >
                Compete Now →
              </button>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button
            type="button"
            className="profile-logout-btn"
            onClick={handleLogout}
            disabled={loading}
          >
            Log out
          </button>
          <button
            type="button"
            className="profile-back-btn"
            onClick={() => navigate("/")}
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
