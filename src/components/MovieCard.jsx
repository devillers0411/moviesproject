import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/MovieCard.css';

const MovieCard = ({ title, onHover, isHovered }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, isInWatchlist, toggleWatchlist } = useApp();
  const [showActions, setShowActions] = useState(false);

  const handleCardClick = () => {
    navigate(`/movie/${title.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(title);
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    toggleWatchlist(title);
  };

  const imageUrl = title.primaryImage?.url || '/placeholder.svg';
  const rating = title.rating?.aggregateRating ? title.rating.aggregateRating.toFixed(1) : 'N/A';

  return (
    <div
      className={`movie-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => {
        onHover(title.id);
        setShowActions(true);
      }}
      onMouseLeave={() => {
        onHover(null);
        setShowActions(false);
      }}
      onClick={handleCardClick}
    >
      <div className="movie-card-image">
        <img src={imageUrl} alt={title.primaryTitle} loading="lazy" />
        <div className="movie-card-overlay"></div>
      </div>

      {isHovered && (
        <div className="movie-card-details">
          <h3 className="movie-title">{title.primaryTitle}</h3>
          <p className="movie-year">{title.startYear}</p>
          <p className="movie-genres">
            {title.genres && title.genres.slice(0, 2).join(' • ')}
          </p>
          <div className="movie-rating">
            <span className="rating-value">⭐ {rating}</span>
            <span className="rating-votes">({title.rating?.voteCount?.toLocaleString() || '0'})</span>
          </div>
          {title.plot && (
            <p className="movie-plot">{title.plot.substring(0, 100)}...</p>
          )}

          <div className="movie-actions">
            <button
              className={`action-btn play-btn`}
              onClick={handleCardClick}
              title="More Info"
            >
              ▶ More Info
            </button>
            <button
              className={`action-btn favorite-btn ${isFavorite(title.id) ? 'active' : ''}`}
              onClick={handleFavoriteClick}
              title="Add to Favorites"
            >
              ♡
            </button>
            <button
              className={`action-btn watchlist-btn ${isInWatchlist(title.id) ? 'active' : ''}`}
              onClick={handleWatchlistClick}
              title="Add to Watchlist"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
