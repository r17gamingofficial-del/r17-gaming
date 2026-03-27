import { useAppContext } from "../../Context/AppContext";
import "./Featured.css";

const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;

  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`;
  }

  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`;
  }

  return null;
};

const getFeaturedMedia = (game) => {
  if (!game) return null;

  if (game.videoUrl) {
    const youtubeEmbedUrl = getYoutubeEmbedUrl(game.videoUrl);
    if (youtubeEmbedUrl) {
      return { type: "iframe", url: youtubeEmbedUrl };
    }
    return { type: "video", url: game.videoUrl };
  }

  if (game.thumbnail) return { type: "image", url: game.thumbnail };
  if (game.image) return { type: "image", url: game.image };
  return null;
};

export default function Featured({ selectedGame }) {
  const { games } = useAppContext();

  // Default to first game if no game selected
  const defaultGame = games && games.length > 0 ? games[0] : null;
  const game = selectedGame || defaultGame;
  const media = getFeaturedMedia(game);

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
      {media && (
        <div className="featured-media-layer" aria-hidden="true">
          {media.type === "video" && (
            <video
              className="featured-media"
              autoPlay
              muted
              loop
              playsInline
              poster={game.thumbnail || game.image || ""}
            >
              <source src={media.url} type="video/mp4" />
            </video>
          )}

          {media.type === "iframe" && (
            <iframe
              className="featured-media"
              src={media.url}
              title={`${game.name || "Game"} trailer`}
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          )}

          {media.type === "image" && (
            <div
              className="featured-media featured-media-image"
              style={{ backgroundImage: `url(${media.url})` }}
            />
          )}

          <div className="featured-media-overlay" />
        </div>
      )}

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
          <a
            href={game.videoUrl || "#"}
            className="btn-ghost"
            target={game.videoUrl ? "_blank" : undefined}
            rel={game.videoUrl ? "noreferrer" : undefined}
          >
            Watch Trailer
          </a>
        </div>
      </div>
    </div>
  );
}
