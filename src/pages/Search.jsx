import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchTitles } from '../services/api';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import '../styles/Search.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    setLoading(true);
    setError(null);

    try {
      const response = await searchTitles(searchQuery, 50);
      if (response.success) {
        setMovies(response.data.titles || []);
      } else {
        setError(response.error || 'Failed to search movies');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search Results</h1>
        <div className="search-input-section">
          <SearchBar onSearch={handleSearch} placeholder="Search for a movie or TV show..." />
        </div>
      </div>

      <div className="search-container">
        {query && (
          <div className="search-info">
            <p>
              {loading ? 'Searching...' : `Results for "${query}"`}
              {!loading && movies.length > 0 && ` (${movies.length} found)`}
            </p>
          </div>
        )}

        <MovieGrid
          movies={movies}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default Search;
