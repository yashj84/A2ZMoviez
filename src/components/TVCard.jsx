import "../css/MovieCard.css";
import { Form, Link } from "react-router-dom";
import { useMovieContex } from "../context/MovieContext";

function TVCard({ tv }) {
    const { isFavorites, addToFavorites, removeFavorites } = useMovieContex()
    const favorite = isFavorites(tv.id)
    function onFavoriteClick(e) {
    e.preventDefault();

    if (favorite) {
        removeFavorites(tv.id);
    } else {
        addToFavorites({
            ...tv,
            media_type: "tv",
        });
    }
}

    return (
        <>
            <div className="Movie-card">
                <Link to={`/tv/${tv.id}`}>
                    <div className="movie-poster">



                        <img
                            src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                            alt={tv.name}
                        />



                        <div className="movie-overlay"></div>

                        <button
                            className={`favorite-btn ${favorite ? "active" : ""}`}
                            onClick={onFavoriteClick}
                        >
                            {favorite ? "❤️" : "🤍"}
                        </button>

                    </div>

                    <div className="movie-info">

                        <h3>{tv.name}</h3>

                        <p>
                            {tv.first_air_date?.split("-")[0]}
                        </p>

                        <p>
                            ⭐ {tv.vote_average.toFixed(1)}
                        </p>

                    </div></Link>

            </div></>
    );
}

export default TVCard;