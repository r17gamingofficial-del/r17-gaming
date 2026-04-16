import { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../../Context/AppContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./AnnouncementsCarousel.css";

export default function AnnouncementsCarousel() {
  const { announcementSlides } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (announcementSlides.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === announcementSlides.length - 1 ? 0 : prevIndex + 1
    );
  }, [announcementSlides.length]);

  const prevSlide = () => {
    if (announcementSlides.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? announcementSlides.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (isPaused || announcementSlides.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, announcementSlides.length]);

  if (!announcementSlides || announcementSlides.length === 0) {
    return null;
  }

  return (
    <section 
      id="announcements-carousel"
      className="announcements-carousel-wrapper reveal"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="section-header">
        <h2 className="section-title">Announcements</h2>
      </div>
      <div className="carousel-container">
        <div 
          className="carousel-track" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {announcementSlides.map((slide, index) => (
            <div 
              key={slide.id} 
              className={`carousel-slide ${currentIndex === index ? "active" : ""}`}
            >
              <a 
                href={slide.redirectUrl} 
                target="_blank" 
                rel="noreferrer"
                className="slide-link"
              >
                  <div className="slide-content">
                    <img 
                      src={slide.imageUrl} 
                      alt={`Announcement ${index + 1}`} 
                      className="slide-image"
                      loading="lazy"
                    />
                    <div className="slide-overlay">
                      <div className="slide-indicator">
                        <span className="indicator-dot"></span>
                        <span>Announcement</span>
                      </div>
                      <div className="slide-info">
                        <h3 className="slide-title">{slide.title || "Official Update"}</h3>
                        <p className="slide-desc">{slide.description || "Click to learn more about our latest events and news."}</p>
                      </div>
                    </div>
                  </div>
              </a>
            </div>
          ))}
        </div>

        {announcementSlides.length > 1 && (
          <>
            <button className="carousel-btn prev" onClick={prevSlide}>
              <FaChevronLeft />
            </button>
            <button className="carousel-btn next" onClick={nextSlide}>
              <FaChevronRight />
            </button>

            <div className="carousel-dots">
              {announcementSlides.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${currentIndex === index ? "active" : ""}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
