import React, { useState, useEffect } from 'react';
import { getTitles } from '../services/api';
import MovieGrid from '../components/MovieGrid';
import FilterBar from '../components/FilterBar';
import '../styles/Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    types: [],
    genres: [],
    sortBy: 'SORT_BY_POPULARITY',
    sortOrder: 'DESC',
    minRating: 0,
    minYear: 1900,
    maxYear: new Date().getFullYear(),
  });
  const [pageToken, setPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (isLoadMore = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getTitles({
        types: filters.types.length > 0 ? filters.types : undefined,
        genres: filters.genres.length > 0 ? filters.genres : undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        minAggregateRating: filters.minRating > 0 ? filters.minRating : undefined,
        startYear: filters.minYear > 1900 ? filters.minYear : undefined,
        endYear: filters.maxYear < new Date().getFullYear() ? filters.maxYear : undefined,
        pageToken: isLoadMore ? pageToken : undefined,
      });

      if (response.success) {
        if (isLoadMore) {
          setMovies(prev => [...prev, ...response.data.titles]);
        } else {
          setMovies(response.data.titles);
        }
        setPageToken(response.data.nextPageToken || null);
        setHasMore(!!response.data.nextPageToken);
      } else {
        setError(response.error || 'Failed to fetch movies');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPageToken(null);
  };

  const handleReset = () => {
    setFilters({
      types: [],
      genres: [],
      sortBy: 'SORT_BY_POPULARITY',
      sortOrder: 'DESC',
      minRating: 0,
      minYear: 1900,
      maxYear: new Date().getFullYear(),
    });
    setPageToken(null);
  };

  const handleLoadMore = () => {
    fetchMovies(true);
  };

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1>Discover Amazing Content</h1>
          <p>Explore thousands of movies and TV shows</p>
        </div>
      </div>

      <div className="home-container">
        <FilterBar onFilterChange={handleFilterChange} onReset={handleReset} />
        <MovieGrid
          movies={movies}
          loading={loading}
          error={error}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
};

export default Home;
