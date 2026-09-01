import Moviecard from "../MovieCard";
import { useState, useEffect } from "react";
import { searchMedia, getPopular , showGenreMovies} from "../../services/api"
import "../../css/Home.css";


function genre({ selectedGenre }) {
    const [searchQuery, setsearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

useEffect(() => {

    async function loadMovies() {

        setLoading(true);

        try {

            let data;

            if (selectedGenre === "") {
                data = await getPopularMovies();
            } else {
                data = await showGenreMovies(selectedGenre);
            }

            setMovies(data);
            setError(null);

        } catch (err) {
            console.log(err);
            setError("Failed to load movies");
        } finally {
            setLoading(false);
        }

    }

    loadMovies();

}, [selectedGenre]);

   async function handleSearch(e) {
        e.preventDefault()
        if (!searchQuery.trim()) return
        if (loading) return

        setLoading(true)
        try{
            const searchResult = await searchMovies(searchQuery)
            setMovies(searchResult)
            setError(null)
        }
        catch(err){
            console.log(err)
            setError("failed to load Movie")
        }
        finally{
            setLoading(false)
        }
        setsearchQuery()
    }

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input type="text"
                    placeholder="search of movies.."
                    className="search-input" value={searchQuery}
                    onChange={(e) => setsearchQuery(e.target.value)}
                />
                <button className="search-button" type="submit">search</button>
            </form>
            {error && <div className="error-message">{error}</div>}
            {loading ? <div className="loading">loading...</div> : <div className="movies-grid">
                {movies.map((movie) => (
                    <Moviecard movie={movie} key={movie.id} />
                ))}
            </div>}

        </div>
    );
}

export default genre;