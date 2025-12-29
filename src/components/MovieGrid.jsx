import React, { useState } from 'react';
import MovieCard from './MovieCard';
import '../styles/MovieGrid.css';

const MovieGrid = ({ movies, loading, error, onLoadMore, hasMore }) => {
  const [hoveredId, setHoveredId] = useState(null);

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (loading && movies.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="empty-container">
        <p>No movies found. Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid-wrapper">
      <div className="movie-grid">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            title={movie}
            onHover={setHoveredId}
            isHovered={hoveredId === movie.id}
          />
        ))}
      </div>

      {hasMore && (
        <div className="load-more-container">
          <button
            className="load-more-btn"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {loading && movies.length > 0 && (
        <div className="loading-indicator">
          <div className="spinner-small"></div>
          <p>Loading more movies...</p>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
