import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import "./AuthModal.css";

const AuthModal = ({ isOpen, onClose, mode, onModeChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const modalRef = useRef(null);
  const { login, register, loading, googleLogin } = useAuth();

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Show full-screen loader
  const showFullScreenLoader = () => {
    setIsAuthLoading(true);
  };

  // Hide full-screen loader
  const hideFullScreenLoader = () => {
    setIsAuthLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (name.length < 2) {
        setError("Name must be at least 2 characters");
        return;
      }

      showFullScreenLoader();
      try {
        await register(email, password, name);
        hideFullScreenLoader();
        setSuccess("Registration successful!");
        setTimeout(() => onClose(), 1500);
      } catch (err) {
        hideFullScreenLoader();
        setError("Registration failed. Email may already be in use.");
      }
    } else {
      showFullScreenLoader();
      try {
        await login(email, password);
        hideFullScreenLoader();
        setSuccess("Login successful!");
        setTimeout(() => onClose(), 1500);
      } catch (err) {
        hideFullScreenLoader();
        setError("Invalid email or password");
      }
    }
  };

  const handleGoogle = async () => {
    setError("");
    setSuccess("");

    showFullScreenLoader();
    try {
      await googleLogin();
      hideFullScreenLoader();
      setSuccess("Login successful!");
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      hideFullScreenLoader();
      setError("Google sign-in failed");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Full-screen Loader Overlay */}
      {isAuthLoading && (
        <div className="auth-loader-overlay">
          <div className="auth-loader">
            <div className="auth-loader-spinner"></div>
            <div className="auth-loader-rings">
              <div className="ring"></div>
              <div className="ring"></div>
              <div className="ring"></div>
              <div className="ring"></div>
              <div className="ring"></div>
            </div>
            <div className="auth-loader-text">
              {mode === "login" ? "AUTHENTICATING" : "CREATING ACCOUNT"}
            </div>
            <div className="auth-loader-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="auth-loader-subtext">
              Please wait while we secure your access...
            </div>
          </div>
        </div>
      )}

      <div className="auth-modal-overlay" onClick={onClose}>
        <div
          ref={modalRef}
          className={`auth-modal ${isAuthLoading ? "loading" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Background Elements */}
          <div className="modal-bg-gradient" />
          <div className="modal-particles" />

          {/* Close Button */}
          <button
            className="modal-close"
            onClick={onClose}
            disabled={isAuthLoading}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M18 6L6 18M6 6l12 12"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Top decorative plus */}
          <div className="auth-plus" aria-hidden="true">
            <span>+</span>
          </div>

          {/* Header with Gaming Style */}
          <div className="modal-header">
            <div className="header-glow" />
            {mode === "login" ? (
              <>
                <h2 className="modal-title">
                  WELCOME
                  <br />
                  BACK
                </h2>
                <p className="modal-subtitle">
                  Enter the arena and continue your legacy
                </p>
              </>
            ) : (
              <>
                <h2 className="modal-title">
                  JOIN
                  <br />
                  THE ARENA
                </h2>
                <p className="modal-subtitle">
                  Create your account and start your journey
                </p>
              </>
            )}
          </div>

          {/* Status Messages - Compact */}
          {error && (
            <div className="message error">
              <svg
                className="message-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path
                  d="M12 8v4M12 16h.01"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="message success">
              <svg
                className="message-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Form - Compact Layout */}
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "register" && (
              <div className="form-group">
                <label htmlFor="name">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  NAME
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="form-input"
                  disabled={isAuthLoading}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M22 6l-10 7L2 6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="form-input"
                disabled={isAuthLoading}
              />
            </div>

            {/* Password Field with Eye Button */}
            <div className="form-group">
              <label htmlFor="password">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M7 11V7a5 5 0 0110 0v4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                PASSWORD
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="form-input password-input"
                  disabled={isAuthLoading}
                />
                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M1 1l22 22"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="12" r="3" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field with Eye Button (Register Mode Only) */}
            {mode === "register" && (
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M7 11V7a5 5 0 0110 0v4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  CONFIRM PASSWORD
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="form-input password-input"
                    disabled={isAuthLoading}
                  />
                  <button
                    type="button"
                    className="password-eye-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M1 1l22 22"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle cx="12" cy="12" r="3" strokeWidth="2" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="forgot-password">
                <button
                  type="button"
                  className="forgot-link"
                  disabled={isAuthLoading}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className={`submit-btn ${loading || isAuthLoading ? "loading" : ""}`}
              disabled={loading || isAuthLoading}
            >
              {loading || isAuthLoading ? (
                <div className="btn-loader">
                  <div className="loader-dot"></div>
                  <div className="loader-dot"></div>
                  <div className="loader-dot"></div>
                </div>
              ) : (
                <>
                  <span className="btn-text">
                    {mode === "login" ? "ENTER ARENA" : "CREATE ACCOUNT"}
                  </span>
                  <svg
                    className="btn-arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Social buttons */}
          <div className="social-row" style={{ marginTop: 12, zIndex: 2 }}>
            <button
              type="button"
              className="social-btn google"
              onClick={handleGoogle}
              disabled={loading || isAuthLoading}
              aria-label="Sign in with Google"
            >
              <FcGoogle className="social-icon" />
              <span className="sr-only">Sign in with Google</span>
            </button>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <p>
              {mode === "login"
                ? "New to R17 Gaming? "
                : "Already have an account? "}
              <button
                className="switch-btn"
                type="button"
                onClick={() =>
                  onModeChange(mode === "login" ? "register" : "login")
                }
                disabled={isAuthLoading}
              >
                {mode === "login" ? "Create Account" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="modal-corner top-left"></div>
          <div className="modal-corner top-right"></div>
          <div className="modal-corner bottom-left"></div>
          <div className="modal-corner bottom-right"></div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
