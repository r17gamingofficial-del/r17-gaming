import { useState } from 'react'
import './Newsletter.css'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (email.trim()) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <div id="newsletter" className="reveal">
      <div className="newsletter-text">
        <div className="section-label">Stay in the Loop</div>
        <h3 className="newsletter-heading">DON'T MISS A MATCH</h3>
        <p className="newsletter-sub">Tournament alerts, patch notes, and exclusive drops — straight to your inbox.</p>
      </div>

      <div className="newsletter-form-wrap">
        {submitted ? (
          <p style={{ fontFamily: 'Orbitron', fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--red)' }}>
            ✓ YOU'RE IN. SEE YOU IN THE ARENA.
          </p>
        ) : (
          <>
            <div className="newsletter-form">
              <input
                type="email"
                className="newsletter-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button className="newsletter-btn" onClick={handleSubmit}>Subscribe</button>
            </div>
            <p className="newsletter-disclaimer">No spam. Unsubscribe anytime. 240K+ subscribers.</p>
          </>
        )}
      </div>
    </div>
  )
}
