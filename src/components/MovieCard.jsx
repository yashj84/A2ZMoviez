import "../css/MovieCard.css"
import { Link } from "react-router-dom";
import { useMovieContex } from "../context/MovieContext";

function MovieCard ({movie}){
    const genres = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};
    
    const { isFavorites, addToFavorites, removeFavorites } = useMovieContex()
        const favorite = isFavorites(movie.id)
        function onFavoriteClick(e) {
    e.preventDefault();

    if (favorite) {
        removeFavorites(movie.id);
    } else {
        addToFavorites({
            ...movie,
            media_type: "movie",
        });
    }
}
    
    
    return (
        <>
    <div className="Movie-card tv-focusable"
    tabIndex={0}>
        <Link to={`/movie/${movie.id}`}>
        <div className="movie-poster">
            
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <button
                            className={`favorite-btn ${favorite ? "active" : ""}`}
                            onClick={onFavoriteClick}
                        >
                            {favorite ? "❤️" : "🤍"}
                        </button>
        </div>
        
        
        
        <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{movie.release_date?.split("-")[0]}</p>
            <p>{movie.genre_ids
    ?.map(id => genres[id])
    .join(", ")}</p>
        </div></Link>
    </div></>
    )
}

export default MovieCard