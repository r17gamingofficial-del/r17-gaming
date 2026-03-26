import { useAppContext } from "../../Context/AppContext";
import "./Featured.css";

export default function Featured({ selectedGame }) {
  const { games } = useAppContext();

  // Default to first game if no game selected
  const defaultGame = games && games.length > 0 ? games[0] : null;
  const game = selectedGame || defaultGame;

  if (!game) {
    return (
      <div id="featured" className="reveal">
        <div className="featured-content">
          <div className="section-label">Editor's Pick · Season 6</div>
          <h3 className="featured-title">COMING SOON</h3>
          <p className="featured-desc">
            New games are being added. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="featured" className="reveal">
      <div className="featured-content">
        <div className="section-label">Editor's Pick · Season 6</div>
        <h3 className="featured-title">
          {game.featuredTitle || game.name.toUpperCase()}
        </h3>

        {/* Score Section */}
        <div className="featured-score">
          <div className="score-num">{game.featuredScore || "9.5"}</div>
          <div className="score-label">
            CRITIC
            <br />
            SCORE
          </div>
        </div>

        {/* Meta Information */}
        <div className="featured-meta">
          {game.featuredMeta ? (
            game.featuredMeta.map((item, index) => (
              <span key={index}>{item}</span>
            ))
          ) : (
            <>
              <span>🎮 {game.genre || game.category}</span>
              <span>👥 Competitive</span>
              <span>🏆 Prize Pool</span>
              <span>🌍 Global Servers</span>
            </>
          )}
        </div>

        {/* Tags */}
        <div className="featured-tags">
          {game.featuredTags ? (
            game.featuredTags.map((tag, index) => (
              <span key={index} className="f-tag">
                {tag}
              </span>
            ))
          ) : (
            <>
              <span className="f-tag">Featured Game</span>
              <span className="f-tag">Top Rated</span>
              <span className="f-tag">Free to Play</span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="featured-desc">
          {game.featuredDesc ||
            game.description ||
            "Experience the ultimate gaming adventure with this top-rated title. Join millions of players worldwide and compete in intense matches, climb the ranks, and claim your glory!"}
        </p>

        {/* Action Buttons */}
        <div className="featured-actions">
          <a href="#" className="btn-primary">
            {game.featuredButtonText || "Play Now — Free"}
          </a>
          <a href="#" className="btn-ghost">
            Watch Trailer
          </a>
        </div>
      </div>
    </div>
  );
}
