import { useState } from "react";
import "./Newsletter.css";
import emailjs from "@emailjs/browser";

export default function Newsletter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const nameValue = name.trim();
    const emailValue = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameValue || !emailValue || !emailRegex.test(emailValue)) return;

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    try {
      setLoading(true);

      await emailjs.send(
        serviceId,
        templateId,
        {
          subscriber_name: nameValue,
          subscriber_email: emailValue,
          time: new Date().toLocaleString(),
        },
        publicKey,
      );

      setSubmitted(true);
      setName("");
      setEmail("");
    } catch (error) {
      console.error("EmailJS Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="newsletter" className="reveal">
      <div className="newsletter-text">
        <div className="section-label">Stay in the Loop</div>
        <h3 className="newsletter-heading">DON'T MISS A MATCH</h3>
        <p className="newsletter-sub">
          Tournament alerts, patch notes, and exclusive drops — straight to your
          inbox.
        </p>
      </div>

      <div className="newsletter-form-wrap">
        {submitted ? (
          <p
            style={{
              fontFamily: "Orbitron",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              color: "var(--red)",
            }}
          >
            ✓ YOU'RE IN. SEE YOU IN THE ARENA.
          </p>
        ) : (
          <>
            <div className="newsletter-form">
              {/* Name Input */}
              <input
                type="text"
                className="newsletter-input"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                disabled={loading}
              />

              {/* Email Input */}
              <input
                type="email"
                className="newsletter-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                disabled={loading}
              />

              {/* Button */}
              <button
                className="newsletter-btn"
                onClick={handleSubmit}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    <span style={{ marginLeft: 8 }}>Sending...</span>
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>

            <p className="newsletter-disclaimer">
              No spam. Unsubscribe anytime. 240K+ subscribers.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
