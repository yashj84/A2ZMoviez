import './css/App.css';
import Home from './components/pages/Home';
import Favorites from './components/pages/Favorites';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/navbar';
import genre from './components/pages/genre';
import { useState } from "react";
import { MovieProvider } from './context/MovieContext';
import MovieDetails from "./components/pages/MovieDetails";
import TVDetails from './components/pages/TVDetails';
import Random from './components/pages/random';

function App() {
  const [selectedGenre, setSelectedGenre] = useState("");
  const [resetHome, setResetHome] = useState(0);
  const [selectedType, setSelectedType] = useState("movie");
  return (
    <MovieProvider>
      <NavBar
      onTypeChange={setSelectedType}
    selectedType={selectedType}
    onGenreChange={setSelectedGenre}
    resetHome={() => {
        setSelectedGenre(genres);
        setResetHome(prev => prev + 1);
    }}
/>
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home
    selectedGenre={selectedGenre}
    selectedType={selectedType}
    resetHome={resetHome}
/>} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<TVDetails />} />
        <Route path="/tv/:id" element={<TVDetails />} />
        <Route path='/random' element={<Random/>} />
      </Routes>
    </main>
          </MovieProvider>
    
  );
}

export default App;