import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../Firebase/config";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Watch current user's Firestore profile for deletion or block flag
  useEffect(() => {
    if (!user?.uid) return;
    const userDocRef = doc(db, "users", user.uid);
    const unsubDoc = onSnapshot(
      userDocRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setProfile(data);

          // If profile marked blocked, sign the user out immediately
          if (data.isBlocked) {
            console.warn("User profile is blocked — signing out");
            signOut(auth).catch((e) => console.error("Sign-out error:", e));
          }
        } else {
          setProfile(null);
        }
      },
      (err) => {
        console.error("User doc listener error:", err);
      },
    );

    return () => unsubDoc();
  }, [user]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Check Firestore profile for block flag
      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (snap.exists() && snap.data()?.isBlocked) {
        await signOut(auth);
        throw new Error("User is blocked by admin");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, name = "") => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        email: cred.user.email || email,
        name: name || "",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Firebase Error:", error); // 👈 ADD THIS

      // Throw readable error
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const providerLogin = useCallback(async (provider) => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;
      const info = getAdditionalUserInfo(cred);

      // If existing user, check block flag and sign out immediately
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && snap.data()?.isBlocked) {
        await signOut(auth);
        throw new Error("User is blocked by admin");
      }

      if (info && info.isNewUser) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email || "",
          name: user.displayName || "",
          photoURL: user.photoURL || "",
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Social login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const googleLogin = useCallback(
    () => providerLogin(new GoogleAuthProvider()),
    [providerLogin],
  );
  const facebookLogin = useCallback(
    () => providerLogin(new FacebookAuthProvider()),
    [providerLogin],
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(
    () => ({
      user,
      profile,
      loading,
      login,
      register,
      googleLogin,
      facebookLogin,
      logout,
      resetPassword,
    }),
    [
      user,
      profile,
      loading,
      login,
      register,
      logout,
      googleLogin,
      facebookLogin,
      resetPassword,
    ],
  );
}
