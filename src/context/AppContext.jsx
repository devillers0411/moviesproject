import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('netflix-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('netflix-watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('netflix-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('netflix-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleFavorite = (title) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === title.id);
      if (exists) {
        return prev.filter(fav => fav.id !== title.id);
      } else {
        return [...prev, title];
      }
    });
  };

  const isFavorite = (titleId) => {
    return favorites.some(fav => fav.id === titleId);
  };

  const toggleWatchlist = (title) => {
    setWatchlist(prev => {
      const exists = prev.find(item => item.id === title.id);
      if (exists) {
        return prev.filter(item => item.id !== title.id);
      } else {
        return [...prev, title];
      }
    });
  };

  const isInWatchlist = (titleId) => {
    return watchlist.some(item => item.id === titleId);
  };

  const value = {
    favorites,
    watchlist,
    toggleFavorite,
    isFavorite,
    toggleWatchlist,
    isInWatchlist,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
