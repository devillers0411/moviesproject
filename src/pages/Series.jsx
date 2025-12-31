import React, { useState, useEffect } from 'react';
import { getTitles } from '../services/api';
import MovieGrid from '../components/MovieGrid';
import FilterBar from '../components/FilterBar';
import '../styles/Series.css';

const Series = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    types: ['TV_SERIES', 'TV_MINI_SERIES'],
    genres: [],
    sortBy: 'SORT_BY_POPULARITY',
    sortOrder: 'DESC',
    minRating: 0,
    minYear: 1900,
    maxYear: new Date().getFullYear(),
  });
  const [pageToken, setPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchSeries = async (isLoadMore = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getTitles({
        types: filters.types,
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
          setSeries(prev => [...prev, ...response.data.titles]);
        } else {
          setSeries(response.data.titles);
        }
        setPageToken(response.data.nextPageToken || null);
        setHasMore(!!response.data.nextPageToken);
      } else {
        setError(response.error || 'Failed to fetch series');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    // Keep TV_SERIES types selected
    setFilters({ ...newFilters, types: ['TV_SERIES', 'TV_MINI_SERIES'] });
    setPageToken(null);
  };

  const handleReset = () => {
    setFilters({
      types: ['TV_SERIES', 'TV_MINI_SERIES'],
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
    fetchSeries(true);
  };

  return (
    <div className="series-page">
      <div className="page-header">
        <h1>TV Series</h1>
        <p>Browse our collection of TV series</p>
      </div>

      <div className="series-container">
        <FilterBar onFilterChange={handleFilterChange} onReset={handleReset} />
        <MovieGrid
          movies={series}
          loading={loading}
          error={error}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
};

export default Series;
