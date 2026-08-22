import MovieCard from "../MovieCard";
import TVCard from "../TVCard";
import WatchHistory from "../WatchHistory";

import { useState, useEffect } from "react";

import {
    searchMedia,
    getPopular,
    showGenreMovies,
    searchSuggestions
} from "../../services/api";

import "../../css/Home.css";

import { useNavigate } from "react-router-dom";


function Home({
    selectedGenre,
    resetHome
}) {

    const navigate = useNavigate();


    // ==========================================
    // State
    // ==========================================

    const [searchQuery, setSearchQuery] =
        useState("");

    const [movies, setMovies] =
        useState([]);

    // Trending carousel
    const [heroItems, setHeroItems] =
        useState([]);

    const [heroIndex, setHeroIndex] =
        useState(0);

    const [error, setError] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [page, setPage] =
        useState(1);

    const [isSearching, setIsSearching] =
        useState(false);

    const [suggestions, setSuggestions] =
        useState([]);


    // ==========================================
    // Search Suggestions
    // ==========================================

    useEffect(() => {

        const timer = setTimeout(
            async () => {

                if (!searchQuery.trim()) {

                    setSuggestions([]);

                    return;

                }


                try {

                    const data =
                        await searchSuggestions(
                            searchQuery
                        );

                    setSuggestions(
                        data.slice(0, 8)
                    );

                } catch (err) {

                    console.log(err);

                }

            },
            300
        );


        return () =>
            clearTimeout(timer);

    }, [searchQuery]);


    // ==========================================
    // Load Homepage
    // ==========================================

    useEffect(() => {

        async function loadMovies() {

            setLoading(true);

            setIsSearching(false);

            try {

                let data;


                // ==================================
                // Homepage / Trending
                // ==================================

                if (selectedGenre === "") {

    data = await getPopular("multi", page);

    const results = data.results || [];

    const today = new Date()
        .toISOString()
        .split("T")[0];


    // ==========================================
    // Filter content
    // Movies → released only
    // TV → keep everything
    // ==========================================

    const filteredResults = results.filter((item) => {

        // Only movies and TV
        if (
            item.media_type !== "movie" &&
            item.media_type !== "tv"
        ) {
            return false;
        }


        // TV shows:
        // Keep old, current and upcoming shows
        if (item.media_type === "tv") {
            return true;
        }


        // Movies:
        // Only show released movies
        if (item.media_type === "movie") {

            if (!item.release_date) {
                return false;
            }

            return item.release_date <= today;
        }


        return false;

    });


    // ==========================================
    // Trending Hero Carousel
    // ==========================================

    if (page === 1) {

        const carouselItems =
            filteredResults
                .filter(item => item.backdrop_path)
                .slice(0, 5);


        setHeroItems(carouselItems);

        setHeroIndex(0);

    }


    // ==========================================
    // Homepage Grid
    // ==========================================

    setMovies(filteredResults);

}


                // ==================================
                // Genre
                // ==================================

               else {

    data = await showGenreMovies(
        selectedGenre,
        page
    );

    const genreResults =
        data.results || data || [];

    // TMDB discover/movie doesn't return
    // media_type, so add it manually
    const genreMovies = genreResults.map(
        item => ({
            ...item,
            media_type: "movie"
        })
    );

    setMovies(genreMovies);

    // Hide hero while browsing genre
    setHeroItems([]);
    setHeroIndex(0);
}


                setError(null);

            } catch (err) {

                console.log(err);

                setError(
                    "Failed to load movies"
                );

            } finally {

                setLoading(false);

            }

        }


        loadMovies();

    }, [
        selectedGenre,
        resetHome,
        page
    ]);


    // ==========================================
    // Automatic Hero Carousel
    // ==========================================

    useEffect(() => {

        if (heroItems.length <= 1) {
            return;
        }


        const timer = setInterval(() => {

            setHeroIndex(prev =>
                (prev + 1) %
                heroItems.length
            );

        }, 6000);


        return () =>
            clearInterval(timer);

    }, [heroItems]);


    // ==========================================
    // Search
    // ==========================================

    async function handleSearch(e) {

        e.preventDefault();


        if (!searchQuery.trim()) {
            return;
        }


        if (loading) {
            return;
        }


        setLoading(true);


        try {

            const searchResult =
                await searchMedia(
                    searchQuery
                );


            setMovies(
                searchResult.results || []
            );


            // Hide carousel
            setHeroItems([]);

            setHeroIndex(0);

            setIsSearching(true);

            setError(null);

        } catch (err) {

            console.log(err);

            setError(
                "Failed to load search results"
            );

        } finally {

            setLoading(false);

            setSearchQuery("");

            setSuggestions([]);

        }

    }


    // ==========================================
    // Hero Navigation
    // ==========================================

    function nextHero() {

        if (heroItems.length === 0) {
            return;
        }


        setHeroIndex(prev =>
            (prev + 1) %
            heroItems.length
        );

    }


    function previousHero() {

        if (heroItems.length === 0) {
            return;
        }


        setHeroIndex(prev =>
            (
                prev -
                1 +
                heroItems.length
            ) %
            heroItems.length
        );

    }


    // ==========================================
    // Open Hero
    // ==========================================

    function openHero(item) {

        if (!item) {
            return;
        }


        if (item.media_type === "tv") {

            navigate(
                `/tv/${item.id}`
            );

        } else {

            navigate(
                `/movie/${item.id}`
            );

        }

    }


    // ==========================================
    // Current Hero
    // ==========================================

    const currentHero =
        heroItems[heroIndex];


    // ==========================================
    // Render
    // ==========================================

    return (

        <div className="home">


            {/* ==================================
                Search
            ================================== */}

            <div className="search-wrapper">

                <form
                    onSubmit={handleSearch}
                    className="search-form"
                >

                    <input
                        type="text"
                        placeholder="Search movies and TV shows..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) =>
                            setSearchQuery(
                                e.target.value
                            )
                        }
                    />


                    <button
                        className="search-button"
                        type="submit"
                    >
                        Search
                    </button>


                    {/* ==========================
                        Search Suggestions
                    ========================== */}

                    {suggestions.length > 0 && (

                        <div className="suggestions">

                            {suggestions.map(
                                (item) => (

                                    <div
                                        key={`${item.media_type}-${item.id}`}
                                        className="suggestion"

                                        onClick={() => {

                                            navigate(
                                                item.media_type ===
                                                    "movie"
                                                    ? `/movie/${item.id}`
                                                    : `/tv/${item.id}`
                                            );


                                            setSuggestions([]);

                                            setSearchQuery("");

                                        }}
                                    >

                                        <img
                                            src={
                                                item.poster_path
                                                    ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                                                    : "https://placehold.co/92x138?text=No+Image"
                                            }
                                            alt=""
                                        />


                                        <div>

                                            <h4>
                                                {
                                                    item.title ||
                                                    item.name
                                                }
                                            </h4>


                                            <p>

                                                {
                                                    item.media_type ===
                                                    "movie"
                                                        ? "🎬 Movie"
                                                        : "📺 TV Show"
                                                }

                                            </p>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </form>

            </div>


            {/* ==================================
                TRENDING CAROUSEL
            ================================== */}

            {!loading &&
                !isSearching &&
                selectedGenre === "" &&
                currentHero && (

                    <section
                        className="hero-carousel"
                        style={{
                            backgroundImage: `
                                url(
                                    https://image.tmdb.org/t/p/original${currentHero.backdrop_path}
                                )
                            `
                        }}
                    >

                        {/* Dark overlay */}

                        <div className="hero-overlay"></div>


                        {/* ==================================
                            Hero Content
                        ================================== */}

                        <div className="hero-content">

                            <div className="hero-label">

                                #
                                {heroIndex + 1}
                                {" "}
                                TRENDING NOW

                            </div>


                            <h1 className="hero-title">

                                {
                                    currentHero.title ||
                                    currentHero.name
                                }

                            </h1>


                            {/* ==============================
                                Meta
                            ============================== */}

                            <div className="hero-meta">

                                <span>

                                    ⭐{" "}

                                    {
                                        currentHero.vote_average
                                            ? currentHero.vote_average.toFixed(1)
                                            : "N/A"
                                    }

                                </span>


                                <span>

                                    {
                                        (
                                            currentHero.release_date ||
                                            currentHero.first_air_date
                                        )?.substring(0, 4)
                                    }

                                </span>


                                <span>

                                    {
                                        currentHero.media_type ===
                                        "movie"
                                            ? "🎬 Movie"
                                            : "📺 TV Show"
                                    }

                                </span>

                            </div>


                            {/* ==============================
                                Description
                            ============================== */}

                            {currentHero.overview && (

                                <p className="hero-description">

                                    {
                                        currentHero.overview
                                            .length > 200

                                            ? `${currentHero.overview.substring(
                                                0,
                                                200
                                            )}...`

                                            : currentHero.overview
                                    }

                                </p>

                            )}


                            {/* ==============================
                                Buttons
                            ============================== */}

                            <div className="hero-actions">

                                <button
                                    className="hero-watch-btn"
                                    onClick={() =>
                                        openHero(
                                            currentHero
                                        )
                                    }
                                >
                                    ▶ Watch Now
                                </button>


                                <button
                                    className="hero-info-btn"
                                    onClick={() =>
                                        openHero(
                                            currentHero
                                        )
                                    }
                                >
                                    More Info
                                </button>

                            </div>

                        </div>


                        {/* ==================================
                            Previous Button
                        ================================== */}

                        {heroItems.length > 1 && (

                            <button
                                className="hero-arrow hero-prev"
                                onClick={
                                    previousHero
                                }
                                aria-label="Previous"
                            >
                                ‹
                            </button>

                        )}


                        {/* ==================================
                            Next Button
                        ================================== */}

                        {heroItems.length > 1 && (

                            <button
                                className="hero-arrow hero-next"
                                onClick={
                                    nextHero
                                }
                                aria-label="Next"
                            >
                                ›
                            </button>

                        )}


                        {/* ==================================
                            Dots
                        ================================== */}

                        {heroItems.length > 1 && (

                            <div className="hero-dots">

                                {heroItems.map(
                                    (item, index) => (

                                        <button
                                            key={item.id}
                                            className={
                                                `hero-dot ${
                                                    index === heroIndex
                                                        ? "active"
                                                        : ""
                                                }`
                                            }
                                            onClick={() =>
                                                setHeroIndex(
                                                    index
                                                )
                                            }
                                            aria-label={
                                                `Go to slide ${
                                                    index + 1
                                                }`
                                            }
                                        />

                                    )
                                )}

                            </div>

                        )}

                    </section>

                )}


            {/* ==================================
                Continue Watching
            ================================== */}

            {!isSearching && (

                <WatchHistory />

            )}


            {/* ==================================
                Error
            ================================== */}

            {error && (

                <div className="error">

                    {error}

                </div>

            )}


            {/* ==================================
                Main Content
            ================================== */}

            {loading ? (

                <div className="loading">

                    Loading...

                </div>

            ) : (

                <>


                    {/* ==================================
                        Section Header
                    ================================== */}

                    <div className="section-header">

                        <h2>

                            {isSearching

                                ? "Search Results"

                                : selectedGenre
                                    ? "Browse"
                                    : "Trending Now"

                            }

                        </h2>

                    </div>


                    {/* ==================================
                        Media Grid
                    ================================== */}

                    <div className="movie-grid">

                        {movies.map((item) => {


                            // Ignore unsupported results

                            if (
                                item.media_type !== "movie" &&
                                item.media_type !== "tv"
                            ) {

                                return null;

                            }


                            // TV

                            if (
                                item.media_type === "tv"
                            ) {

                                return (

                                    <TVCard
                                        tv={item}
                                        key={`tv-${item.id}`}
                                    />

                                );

                            }


                            // Movie

                            return (

                                <MovieCard
                                    movie={item}
                                    key={`movie-${item.id}`}
                                />

                            );

                        })}

                    </div>


                    {/* ==================================
                        No Results
                    ================================== */}

                    {movies.length === 0 && (

                        <div className="no-results">

                            <h2>
                                No results found
                            </h2>

                        </div>

                    )}


                    {/* ==================================
                        Pagination
                    ================================== */}

                    <div className="pagination">

                        <button
                            disabled={
                                page === 1
                            }
                            onClick={() =>
                                setPage(
                                    page - 1
                                )
                            }
                        >

                            Previous

                        </button>


                        <span>

                            Page {page}

                        </span>


                        <button
                            onClick={() =>
                                setPage(
                                    page + 1
                                )
                            }
                        >

                            Next

                        </button>

                    </div>

                </>

            )}

        </div>

    );

}


export default Home;