import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTitleById, getTitleImages, getTitleCredits } from '../services/api';
import { useApp } from '../context/AppContext';
import '../styles/MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, isInWatchlist, toggleWatchlist } = useApp();

  const [movie, setMovie] = useState(null);
  const [images, setImages] = useState([]);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const movieResponse = await getTitleById(id);
        
        if (movieResponse.success) {
          setMovie(movieResponse.data);

          // Fetch images
          const imagesResponse = await getTitleImages(id, { pageSize: 20 });
          if (imagesResponse.success) {
            setImages(imagesResponse.data.images || []);
          }

          // Fetch credits
          const creditsResponse = await getTitleCredits(id, { pageSize: 10 });
          if (creditsResponse.success) {
            setCredits(creditsResponse.data.credits || []);
          }
        } else {
          setError(movieResponse.error || 'Failed to fetch movie details');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="movie-detail-loading">
        <div className="spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-error">
        <h2>Error Loading Movie</h2>
        <p>{error || 'Movie not found'}</p>
        <button onClick={() => navigate('/')} className="back-btn">
          Go Back
        </button>
      </div>
    );
  }

  const rating = movie.rating?.aggregateRating ? movie.rating.aggregateRating.toFixed(1) : 'N/A';
  const backgroundImage = movie.primaryImage?.url || '/placeholder.svg';

  return (
    <div className="movie-detail">
      {/* Hero Section */}
      <div className="movie-hero" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Back
          </button>
          <div className="hero-info">
            <h1 className="movie-title">{movie.primaryTitle}</h1>
            {movie.originalTitle && movie.originalTitle !== movie.primaryTitle && (
              <p className="original-title">({movie.originalTitle})</p>
            )}
            <div className="movie-meta">
              <span className="year">{movie.startYear}</span>
              {movie.runtimeSeconds && (
                <span className="runtime">
                  {Math.floor(movie.runtimeSeconds / 60)} min
                </span>
              )}
              <span className="type">{movie.type?.replace(/_/g, ' ')}</span>
            </div>
            <div className="rating-section">
              <div className="rating">
                <span className="rating-value">⭐ {rating}</span>
                <span className="rating-votes">
                  {movie.rating?.voteCount?.toLocaleString()} votes
                </span>
              </div>
            </div>
            <div className="action-buttons">
              <button className="primary-btn">▶ Play</button>
              <button
                className={`secondary-btn ${isFavorite(movie.id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(movie)}
              >
                {isFavorite(movie.id) ? '♥' : '♡'} Favorite
              </button>
              <button
                className={`secondary-btn ${isInWatchlist(movie.id) ? 'active' : ''}`}
                onClick={() => toggleWatchlist(movie)}
              >
                {isInWatchlist(movie.id) ? '✓' : '+'} Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="movie-content">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          {images.length > 0 && (
            <button
              className={`tab ${activeTab === 'images' ? 'active' : ''}`}
              onClick={() => setActiveTab('images')}
            >
              Images ({images.length})
            </button>
          )}
          {credits.length > 0 && (
            <button
              className={`tab ${activeTab === 'cast' ? 'active' : ''}`}
              onClick={() => setActiveTab('cast')}
            >
              Cast & Crew
            </button>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content overview">
            {movie.plot && (
              <div className="plot-section">
                <h2>Plot</h2>
                <p>{movie.plot}</p>
              </div>
            )}

            {movie.genres && movie.genres.length > 0 && (
              <div className="info-section">
                <h3>Genres</h3>
                <div className="genres-list">
                  {movie.genres.map(genre => (
                    <span key={genre} className="genre-tag">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.directors && movie.directors.length > 0 && (
              <div className="info-section">
                <h3>Directors</h3>
                <div className="people-list">
                  {movie.directors.map(director => (
                    <div key={director.id} className="person">
                      {director.primaryImage && (
                        <img src={director.primaryImage.url} alt={director.displayName} />
                      )}
                      <span>{director.displayName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movie.stars && movie.stars.length > 0 && (
              <div className="info-section">
                <h3>Cast</h3>
                <div className="people-list">
                  {movie.stars.slice(0, 6).map(star => (
                    <div key={star.id} className="person">
                      {star.primaryImage && (
                        <img src={star.primaryImage.url} alt={star.displayName} />
                      )}
                      <span>{star.displayName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movie.originCountries && movie.originCountries.length > 0 && (
              <div className="info-section">
                <h3>Countries</h3>
                <p>{movie.originCountries.map(c => c.name).join(', ')}</p>
              </div>
            )}

            {movie.spokenLanguages && movie.spokenLanguages.length > 0 && (
              <div className="info-section">
                <h3>Languages</h3>
                <p>{movie.spokenLanguages.map(l => l.name).join(', ')}</p>
              </div>
            )}
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="tab-content images">
            <div className="images-grid">
              {images.map((img, idx) => (
                <div key={idx} className="image-item">
                  <img src={img.url} alt={`Gallery ${idx + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cast Tab */}
        {activeTab === 'cast' && (
          <div className="tab-content cast">
            <div className="cast-grid">
              {credits.map(credit => (
                <div key={credit.name?.id} className="cast-item">
                  {credit.name?.primaryImage && (
                    <img src={credit.name.primaryImage.url} alt={credit.name.displayName} />
                  )}
                  <h4>{credit.name?.displayName}</h4>
                  <p className="role">{credit.category}</p>
                  {credit.characters && credit.characters.length > 0 && (
                    <p className="character">as {credit.characters[0]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
