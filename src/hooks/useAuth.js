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
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../Firebase/config";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
