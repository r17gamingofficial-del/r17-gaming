import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
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

  useEffect(() => {
    if (!user?.uid) {
      setFirestoreProfile(null);
      setProfileLoading(false);
      return;
    }
    let cancelled = false;
    setProfileLoading(true);
    getDoc(doc(db, "users", user.uid))
      .then((snap) => {
        if (!cancelled && snap.exists()) setFirestoreProfile(snap.data());
        else if (!cancelled) setFirestoreProfile(null);
      })
      .catch(() => {
        if (!cancelled) setFirestoreProfile(null);
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });
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
    firestoreProfile?.name?.trim() ||
    user.displayName?.trim() ||
    "Player";
  const initial = (
    displayName[0] ||
    user.email?.[0] ||
    "?"
  ).toUpperCase();

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
            <dd>
              {profileLoading ? "…" : displayName}
            </dd>
          </div>
          <div className="profile-row">
            <dt>Email</dt>
            <dd>{user.email || "—"}</dd>
          </div>
          <div className="profile-row">
            <dt>Member since</dt>
            <dd>
              {profileLoading
                ? "…"
                : formatJoined(firestoreProfile?.createdAt)}
            </dd>
          </div>
        </dl>

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
