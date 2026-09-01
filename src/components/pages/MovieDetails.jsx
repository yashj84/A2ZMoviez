import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../../css/MovieDetails.css";
import { providers } from "../../services/providers";
import { getMovieDetails, getMovieRecommendations } from "../../services/api";
import { useMovieContex } from "../../context/MovieContext";
import MovieCard from "../../components/MovieCard";

function MovieDetails() {

    const { id } = useParams();

    const [selectedProvider, setSelectedProvider] = useState("vidfast");
    const [movieDetails, setMovieDetails] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    const iframeRef = useRef(null);

    const playerUrl = providers[selectedProvider].movie(id);

    const {
        addToFavorites,
        removeFavorites,
        isFavorites
    } = useMovieContex();

    const favorite = movieDetails
        ? isFavorites(movieDetails.id)
        : false;


    // ==========================================
    // Load Movie Details
    // ==========================================

    useEffect(() => {

        async function loadMovieDetails() {

            try {

                const data = await getMovieDetails(id);

                setMovieDetails(data);

            } catch (err) {

                console.log(err);

            }

        }

        loadMovieDetails();

    }, [id]);


    // ==========================================
    // Save Movie Progress
    // ==========================================

    function saveMovieProgress(progress) {

        if (!movieDetails) return;

        const stored = JSON.parse(
            localStorage.getItem("watchHistory") || "[]"
        );


        const movie = {

            id: movieDetails.id,

            title: movieDetails.title,

            poster_path: movieDetails.poster_path,

            media_type: "movie",

            progress: Number(progress.toFixed(1))

        };


        const filtered = stored.filter(
            item =>
                !(
                    item.id === movie.id &&
                    item.media_type === "movie"
                )
        );


        const updated = [
            movie,
            ...filtered
        ];


        localStorage.setItem(
            "watchHistory",
            JSON.stringify(updated.slice(0, 20))
        );


        console.log(
            "Saved watch history:",
            movie
        );

    }


    // ==========================================
    // Player Communication
    // ==========================================

    useEffect(() => {

        if (!movieDetails) return;

        function handlePlayerMessage(event) {

            const data = event.data;


            // Debug
            console.log(
                "MESSAGE FROM PLAYER:",
                data
            );


            if (
                data?.type === "PLAYER_EVENT" &&
                data?.data?.event === "playerstatus"
            ) {

                const currentTime = Number(
                    data.data.currentTime
                );

                const duration = Number(
                    data.data.duration
                );


                if (
                    Number.isFinite(currentTime) &&
                    Number.isFinite(duration) &&
                    duration > 0
                ) {

                    const progress =
                        (currentTime / duration) * 100;


                    console.log(
                        "CURRENT TIME:",
                        currentTime
                    );

                    console.log(
                        "DURATION:",
                        duration
                    );

                    console.log(
                        "PROGRESS:",
                        progress.toFixed(1) + "%"
                    );


                    // Save progress
                    saveMovieProgress(progress);

                }

            }

        }

        window.addEventListener(
            "message",
            handlePlayerMessage
        );

        return () => {

            window.removeEventListener(
                "message",
                handlePlayerMessage
            );

        };

    }, [movieDetails]);


    // ==========================================
    // Request Player Status Every 5 Seconds
    // ==========================================

    useEffect(() => {

        if (!movieDetails) return;


        const requestStatus = () => {
            if (!iframeRef.current) {
                console.log(
                    "Iframe not ready"
                );
                return;
            }


            console.log(
                "Requesting player status..."
            );


            iframeRef.current.contentWindow.postMessage(
                {
                    command: "getStatus"
                },
                "*"
            );
        };


        const interval = setInterval(
            requestStatus,
            5000
        );


        return () => {
            clearInterval(interval);
        };
    }, [movieDetails, playerUrl]);


    // ==========================================
    // Fetch Movie Recommendations
    // ==========================================

    useEffect(() => {
        if (!movieDetails) return;

        async function loadRecommendations() {
            try {
                const data = await getMovieRecommendations(id);
                setRecommendations(data);
            } catch (err) {
                console.log(err);
            }
        }

        loadRecommendations();
    }, [id, movieDetails]);


    // ==========================================
    // UI
    // ==========================================

    return (
        <>
            <div className="movie-details">
                <div className="details-header">

                    <h2>
                        {movieDetails
                            ? movieDetails.title
                            : "Loading..."}
                    </h2>

                    {movieDetails && (
                        <button
                            className={`details-favorite-btn ${
                                favorite ? "active" : ""
                            }`}
                            onClick={() => {

                                if (favorite) {

                                    removeFavorites(
                                        movieDetails.id
                                    );

                                } else {

                                    addToFavorites({
                                        id: movieDetails.id,
                                        title: movieDetails.title,
                                        poster_path:
                                            movieDetails.poster_path,
                                        media_type: "movie"
                                    });

                                }

                            }}
                        >
                            {favorite ? "♥" : "♡"}
                        </button>
                    )}

                </div>

                <iframe
                    ref={iframeRef}
                    className="movie-player"
                    src={playerUrl}
                    frameBorder="0"
                    allowFullScreen
                    allow="encrypted-media"
                    title="Movie Player"
                />

                <div className="controls">

                    <div className="control">

                        <label>
                            Provider
                        </label>

                        <select
                            value={selectedProvider}
                            onChange={(e) =>
                                setSelectedProvider(
                                    e.target.value
                                )
                            }
                        >

                            {Object.keys(providers).map(
                                (key) => (

                                    <option
                                        key={key}
                                        value={key}
                                    >
                                        {providers[key].name}
                                    </option>

                                )
                            )}
                        </select>

                    </div>

                </div>
            </div>
            {/* ================================
                Recommended for You
            ================================= */}
            <div className="recommendations">
                <h2>Recommended for You</h2>
                <div className="recommendations-list">
                    {recommendations.length > 0 ? (
                        recommendations.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))
                    ) : (
                        <p>Loading recommendations...</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default MovieDetails;