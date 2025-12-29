import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import MovieGrid from '../components/MovieGrid';
import '../styles/MyList.css';

const MyList = () => {
  const { favorites, watchlist } = useApp();
  const [activeTab, setActiveTab] = useState('favorites');

  const currentList = activeTab === 'favorites' ? favorites : watchlist;

  return (
    <div className="mylist-page">
      <div className="page-header">
        <h1>My List</h1>
        <p>Your personal collection</p>
      </div>

      <div className="mylist-container">
        <div className="list-tabs">
          <button
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites ({favorites.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >
            Watchlist ({watchlist.length})
          </button>
        </div>

        {currentList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>No items yet</h2>
            <p>
              {activeTab === 'favorites'
                ? "Add movies to your favorites by clicking the heart icon."
                : "Add movies to your watchlist by clicking the plus icon."}
            </p>
          </div>
        ) : (
          <MovieGrid
            movies={currentList}
            loading={false}
            error={null}
          />
        )}
      </div>
    </div>
  );
};

export default MyList;
