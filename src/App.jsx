import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Search from './pages/Search';
import MovieDetail from './pages/MovieDetail';
import MyList from './pages/MyList';
import './App.css';

function App() {
  return (
    <Router>
      <AppProvider>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/series" element={<Series />} />
              <Route path="/search" element={<Search />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/mylist" element={<MyList />} />
            </Routes>
          </main>
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;
