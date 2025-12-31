import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import '../styles/Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-text">🎬 MovieFlix</span>
        </Link>

        <nav className="nav-menu">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/movies"
            className={`nav-link ${location.pathname === '/movies' ? 'active' : ''}`}
          >
            Movies
          </Link>
          <Link
            to="/series"
            className={`nav-link ${location.pathname === '/series' ? 'active' : ''}`}
          >
            TV Series
          </Link>
          <Link
            to="/mylist"
            className={`nav-link ${location.pathname === '/mylist' ? 'active' : ''}`}
          >
            My List
          </Link>
        </nav>

        <div className="header-search">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
