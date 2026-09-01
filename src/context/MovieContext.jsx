import { createContext,useState,useContext,useEffect } from "react";

const MovieContext = createContext()

export const useMovieContex = () => useContext(MovieContext);
export const MovieProvider = ({children})=>{
    const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
});

    useEffect(() => {
    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
}, [favorites]);

    const addToFavorites = (movie) => {
    console.log("Adding:", movie);

    if (favorites.some(m => m.id === movie.id)) return;

    const updated = [...favorites, movie];

    console.log(updated);

    setFavorites(updated);
};

    const removeFavorites = (movieId) => {
    setFavorites(prev =>
        prev.filter(movie => movie.id !== movieId)
    );
};

    const isFavorites =(movieId) =>{
        return favorites.some(movie => movie.id === movieId)
    }

    const value ={
        favorites,
        addToFavorites,
        removeFavorites,
        isFavorites
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}