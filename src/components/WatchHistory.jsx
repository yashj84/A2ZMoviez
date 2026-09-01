import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/WatchHistory.css";

function WatchHistory() {

    const [history, setHistory] = useState([]);

    useEffect(() => {

        const stored = localStorage.getItem("watchHistory");

        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch (error) {
                console.log("Failed to load watch history:", error);
                setHistory([]);
            }
        }

    }, []);


    function deleteHistory(id, mediaType) {

        const updated = history.filter(
            item =>
                !(
                    item.id === id &&
                    item.media_type === mediaType
                )
        );

        setHistory(updated);

        localStorage.setItem(
            "watchHistory",
            JSON.stringify(updated)
        );
    }


    if (history.length === 0) {
        return null;
    }


    return (
        <section className="watch-history">

            <div className="watch-history-header">
                <h2>Continue Watching</h2>
            </div>


            <div className="history-carousel">

                {history.slice(0, 10).map((item) => (

                    <div
                        className="history-card tv-focusable"
    tabIndex={0}
                        key={`${item.media_type}-${item.id}`}
                    >

                        <Link
                            to={
                                item.media_type === "tv"
                                    ? `/tv/${item.id}`
                                    : `/movie/${item.id}`
                            }
                            className="history-link"
                        >

                            <div className="history-poster">

                                <img
                                    src={
                                        item.poster_path
                                            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                            : "https://placehold.co/500x750?text=No+Image"
                                    }
                                    alt={
                                        item.title ||
                                        item.name ||
                                        "Movie"
                                    }
                                />


                                {/* Hover play icon */}

                                <div className="history-overlay">
                                    ▶
                                </div>


                                {/* Delete button */}

                                <button
                                    className="delete-history-btn"
                                    onClick={(e) => {

                                        e.preventDefault();
                                        e.stopPropagation();

                                        deleteHistory(
                                            item.id,
                                            item.media_type
                                        );

                                    }}
                                    title="Remove from watch history"
                                >
                                    ✖
                                </button>


                                {/* Progress Bar */}

                                {item.progress > 0 && (

                                    <div className="watch-progress">

                                        <div
                                            className="watch-progress-bar"
                                            style={{
                                                width: `${Math.min(
                                                    item.progress,
                                                    100
                                                )}%`
                                            }}
                                        />

                                    </div>

                                )}

                            </div>


                            <div className="history-info">

                                <h3>
                                    {item.title || item.name}
                                </h3>


                                <p>

                                    {item.media_type === "tv"
                                        ? `📺 S${item.season || 1} E${item.episode || 1}`
                                        : "🎬 Movie"}

                                </p>

                            </div>

                        </Link>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default WatchHistory;