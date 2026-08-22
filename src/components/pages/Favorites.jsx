import "../../css/Favorites.css";
import { useMovieContex } from "../../context/MovieContext";
import MovieCard from "../MovieCard";
import TVCard from "../TVCard";

function Favorites() {

    const { favorites } = useMovieContex();

    if (favorites.length === 0) {
        return (
            <div className="favorites">
                <h2>No favorites yet...</h2>
                <p>Start adding movies and TV shows to your favorites.</p>
            </div>
        );
    }

    return (
        <div className="favorites">
            <h2>My Favorites</h2>

            <div className="movies-grid">
                {favorites.map((item) =>
                    item.media_type === "tv" ? (
                        <TVCard key={item.id} tv={item} />
                    ) : (
                        <MovieCard key={item.id} movie={item} />
                    )
                )}
            </div>
        </div>
    );
}

export default Favorites;