import React, { useState } from 'react';
import { TITLE_TYPES, SORT_OPTIONS, SORT_ORDERS, COMMON_GENRES } from '../services/api';
import '../styles/FilterBar.css';

const FilterBar = ({ onFilterChange, onReset }) => {
  const [filters, setFilters] = useState({
    types: [],
    genres: [],
    sortBy: 'SORT_BY_POPULARITY',
    sortOrder: 'DESC',
    minRating: 0,
    minYear: 1900,
    maxYear: new Date().getFullYear(),
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleTypeChange = (type) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    const updatedFilters = { ...filters, types: newTypes };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleGenreChange = (genre) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    const updatedFilters = { ...filters, genres: newGenres };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSortChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleRatingChange = (value) => {
    const updatedFilters = { ...filters, minRating: parseFloat(value) };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleYearChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: parseInt(value) };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      types: [],
      genres: [],
      sortBy: 'SORT_BY_POPULARITY',
      sortOrder: 'DESC',
      minRating: 0,
      minYear: 1900,
      maxYear: new Date().getFullYear(),
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    onReset();
  };

  const activeFilterCount = 
    filters.types.length + 
    filters.genres.length + 
    (filters.minRating > 0 ? 1 : 0) +
    (filters.minYear > 1900 || filters.maxYear < new Date().getFullYear() ? 1 : 0);

  return (
    <div className={`filter-bar ${isExpanded ? 'expanded' : ''}`}>
      <div className="filter-header">
        <button
          className="filter-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
          Filters
          {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
        </button>

        {activeFilterCount > 0 && (
          <button className="reset-btn" onClick={handleReset}>
            Clear All
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="filter-content">
          {/* Types Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Type</h4>
            <div className="filter-options">
              {TITLE_TYPES.map(type => (
                <label key={type} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type)}
                    onChange={() => handleTypeChange(type)}
                  />
                  <span className="checkbox-label">{type.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Genres Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Genre</h4>
            <div className="filter-options genres">
              {COMMON_GENRES.map(genre => (
                <label key={genre} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.genres.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                  />
                  <span className="checkbox-label">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Minimum Rating</h4>
            <div className="filter-slider">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => handleRatingChange(e.target.value)}
                className="rating-slider"
              />
              <span className="rating-value">⭐ {filters.minRating}</span>
            </div>
          </div>

          {/* Year Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Year Range</h4>
            <div className="filter-year-range">
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={filters.minYear}
                onChange={(e) => handleYearChange('minYear', e.target.value)}
                className="year-input"
                placeholder="From"
              />
              <span className="year-separator">-</span>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={filters.maxYear}
                onChange={(e) => handleYearChange('maxYear', e.target.value)}
                className="year-input"
                placeholder="To"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <h4 className="filter-title">Sort By</h4>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange('sortBy', e.target.value)}
              className="sort-select"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="filter-group">
            <h4 className="filter-title">Sort Order</h4>
            <div className="sort-order">
              {SORT_ORDERS.map(order => (
                <label key={order.value} className="sort-radio">
                  <input
                    type="radio"
                    name="sortOrder"
                    value={order.value}
                    checked={filters.sortOrder === order.value}
                    onChange={(e) => handleSortChange('sortOrder', e.target.value)}
                  />
                  <span>{order.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
