// IMDB API Service
// Base URL for the IMDB API
const API_BASE_URL = 'https://api.imdbapi.dev';

// Helper function to build query parameters
const buildQueryParams = (params) => {
  const filtered = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .reduce((acc, [key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        acc[key] = value;
      } else if (!Array.isArray(value)) {
        acc[key] = value;
      }
      return acc;
    }, {});
  
  const searchParams = new URLSearchParams();
  Object.entries(filtered).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(key, v));
    } else {
      searchParams.set(key, value);
    }
  });
  
  return searchParams.toString();
};

// Generic fetch wrapper
const fetchData = async (endpoint, params = {}) => {
  try {
    const queryString = buildQueryParams(params);
    const url = queryString 
      ? `${API_BASE_URL}${endpoint}?${queryString}`
      : `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
};

// API Methods

/**
 * Get list of titles with optional filters
 */
export const getTitles = (options = {}) => {
  const {
    types = [],
    genres = [],
    countryCodes = [],
    languageCodes = [],
    startYear,
    endYear,
    minVoteCount = 0,
    maxVoteCount,
    minAggregateRating = 0,
    maxAggregateRating,
    sortBy = 'SORT_BY_POPULARITY',
    sortOrder = 'DESC',
    pageToken,
  } = options;

  return fetchData('/titles', {
    types,
    genres,
    countryCodes,
    languageCodes,
    startYear,
    endYear,
    minVoteCount,
    maxVoteCount,
    minAggregateRating,
    maxAggregateRating,
    sortBy,
    sortOrder,
    pageToken,
  });
};

/**
 * Get title details by ID
 */
export const getTitleById = (titleId) => {
  return fetchData(`/titles/${titleId}`);
};

/**
 * Get multiple titles by their IDs (batch get, max 5)
 */
export const getTitlesByIds = (titleIds) => {
  if (titleIds.length > 5) {
    console.warn('Maximum 5 title IDs allowed for batch get');
  }
  return fetchData('/titles:batchGet', { titleIds: titleIds.slice(0, 5) });
};

/**
 * Search titles by query string
 */
export const searchTitles = (query, limit = 20) => {
  return fetchData('/search/titles', {
    query,
    limit: Math.min(limit, 50),
  });
};

/**
 * Get credits for a title
 */
export const getTitleCredits = (titleId, options = {}) => {
  const { categories = [], pageSize = 20, pageToken } = options;
  return fetchData(`/titles/${titleId}/credits`, {
    categories,
    pageSize,
    pageToken,
  });
};

/**
 * Get release dates for a title
 */
export const getTitleReleaseDates = (titleId, options = {}) => {
  const { pageSize = 20, pageToken } = options;
  return fetchData(`/titles/${titleId}/releaseDates`, {
    pageSize,
    pageToken,
  });
};

/**
 * Get AKAs (alternative titles) for a title
 */
export const getTitleAkas = (titleId) => {
  return fetchData(`/titles/${titleId}/akas`);
};

/**
 * Get seasons for a TV series
 */
export const getTitleSeasons = (titleId) => {
  return fetchData(`/titles/${titleId}/seasons`);
};

/**
 * Get episodes for a TV series
 */
export const getTitleEpisodes = (titleId, options = {}) => {
  const { season, pageSize = 20, pageToken } = options;
  return fetchData(`/titles/${titleId}/episodes`, {
    season,
    pageSize,
    pageToken,
  });
};

/**
 * Get images for a title
 */
export const getTitleImages = (titleId, options = {}) => {
  const { types = [], pageSize = 20, pageToken } = options;
  return fetchData(`/titles/${titleId}/images`, {
    types,
    pageSize,
    pageToken,
  });
};

/**
 * Get videos for a title
 */
export const getTitleVideos = (titleId, options = {}) => {
  const { types = [], pageSize = 20, pageToken } = options;
  return fetchData(`/titles/${titleId}/videos`, {
    types,
    pageSize,
    pageToken,
  });
};

/**
 * Get award nominations for a title
 */
export const getTitleAwardNominations = (titleId, options = {}) => {
  const { pageSize = 20, pageToken } = options;
  return fetchData(`/titles/${titleId}/awardNominations`, {
    pageSize,
    pageToken,
  });
};

/**
 * Get parents guide for a title
 */
export const getTitleParentsGuide = (titleId) => {
  return fetchData(`/titles/${titleId}/parentsGuide`);
};

/**
 * Get certificates for a title
 */
export const getTitleCertificates = (titleId) => {
  return fetchData(`/titles/${titleId}/certificates`);
};

/**
 * Get company credits for a title
 */
export const getTitleCompanyCredits = (titleId, options = {}) => {
  const { categories = [], pageSize = 20, pageToken } = options;
  return fetchData(`/titles/${titleId}/companyCredits`, {
    categories,
    pageSize,
    pageToken,
  });
};

/**
 * Get box office information for a title
 */
export const getTitleBoxOffice = (titleId) => {
  return fetchData(`/titles/${titleId}/boxOffice`);
};

// Common filter options
export const TITLE_TYPES = ['MOVIE', 'TV_SERIES', 'TV_MINI_SERIES', 'TV_SPECIAL', 'TV_MOVIE', 'SHORT', 'VIDEO', 'VIDEO_GAME'];

export const SORT_OPTIONS = [
  { value: 'SORT_BY_POPULARITY', label: 'Popularity' },
  { value: 'SORT_BY_RELEASE_DATE', label: 'Release Date' },
  { value: 'SORT_BY_USER_RATING', label: 'User Rating' },
  { value: 'SORT_BY_USER_RATING_COUNT', label: 'Rating Count' },
  { value: 'SORT_BY_YEAR', label: 'Year' },
];

export const SORT_ORDERS = [
  { value: 'ASC', label: 'Ascending' },
  { value: 'DESC', label: 'Descending' },
];

export const COMMON_GENRES = [
  'Action', 'Adventure', 'Comedy', 'Crime', 'Drama',
  'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi',
  'Thriller', 'Western', 'Animation', 'Documentary', 'Family'
];

export default {
  getTitles,
  getTitleById,
  getTitlesByIds,
  searchTitles,
  getTitleCredits,
  getTitleReleaseDates,
  getTitleAkas,
  getTitleSeasons,
  getTitleEpisodes,
  getTitleImages,
  getTitleVideos,
  getTitleAwardNominations,
  getTitleParentsGuide,
  getTitleCertificates,
  getTitleCompanyCredits,
  getTitleBoxOffice,
  TITLE_TYPES,
  SORT_OPTIONS,
  SORT_ORDERS,
  COMMON_GENRES,
};
