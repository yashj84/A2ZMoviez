import { useEffect, useState } from "react";
import { RandomMedia, getMovieTrailer } from "../../services/api";
import "../../css/random.css"
import { useNavigate, useLocation } from "react-router-dom";
import { useMovieContex } from "../../context/MovieContext";

function Random() {
    const [movie, setMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { isFavorites, addToFavorites, removeFavorites } = useMovieContex();

const favorite = movie
    ? isFavorites(movie.id)
    : false;

    function onFavoriteClick() {

    if (!movie) return;

    if (favorite) {
        removeFavorites(movie.id);
    } else {
        addToFavorites({
            ...movie,
            media_type: "movie",
        });
    }
}

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


    useEffect(() => {

        async function loadMovie() {

            const randomMovie = await RandomMedia();
            setMovie(randomMovie);

            const trailer = await getMovieTrailer(randomMovie.id);
            setTrailer(trailer);
        }

        loadMovie();

    }, [location.search]);

    if (!movie) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <div className="random-card">
    <div className="backdrop">
        <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
        />
    </div>

    <div className="content">

        <div className="poster">
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
            />
        </div>

        <div className="info">
            <div className="movie-meta">

    <span className="rating">
        ⭐ {movie.vote_average.toFixed(1)}
    </span>

    <span className="year">
        📅 {movie.release_date?.split("-")[0]}
    </span>

    <span className="votes">
        👥 {movie.vote_count.toLocaleString()}
    </span>

</div>

<p className="genres">
    {movie.genre_ids?.map(id => genres[id]).join(" • ")}
</p>


            <h2>{movie.title}</h2>

            <p>{movie.overview}</p>


           <div className="buttons">

    <button
        className="play-btn"
        onClick={() => navigate(`/movie/${movie.id}`)}
    >
        ▶ Play Now
    </button>

    {trailer && (
        <button
            className="trailer-btn"
            onClick={() =>
                window.open(
                    `https://www.youtube.com/watch?v=${trailer.key}`,
                    "_blank"
                )
            }
        >
            🎬 Trailer
        </button>
    )}

    <button
        className={`favorite-btn-random ${favorite ? "active" : ""}`}
        onClick={onFavoriteClick}
    >
        {favorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
    </button>

</div>

        </div>

    </div>
</div>
        </>
    );
}

export default Random;