import { useParams } from "react-router-dom";import { useState, useEffect, useRef } from "react";import "../../css/MovieDetails.css";import { getTVDetails, getSeasonDetails, getTVRecommendations } from "../../services/api";import { providers } from "../../services/providers";
import TVCard from "../../components/TVCard";

function TVDetails() {

const { id } = useParams();
const [historyLoaded, setHistoryLoaded] = useState(false);

const iframeRef = useRef(null);

const [season, setSeason] = useState(1);
const [episode, setEpisode] = useState(1);

const [tvDetails, setTVDetails] = useState(null);
const [seasons, setSeasons] = useState([]);
const [episodes, setEpisodes] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

const [selectedProvider, setSelectedProvider] =
    useState("vidfast");

const currentProvider = providers[selectedProvider];

const TV_URL = currentProvider.tv(
    id,
    season,
    episode
);


// ==========================================
// Load saved Season + Episode
// ==========================================

useEffect(() => {

const stored = JSON.parse(
    localStorage.getItem("watchHistory") || "[]"
);

const savedTV = stored.find(
    item =>
        item.id === Number(id) &&
        item.media_type === "tv"
);

if (savedTV) {

    setSeason(savedTV.season || 1);
    setEpisode(savedTV.episode || 1);

    if (
        savedTV.provider &&
        providers[savedTV.provider]
    ) {
        setSelectedProvider(
            savedTV.provider
        );
    }
}

setHistoryLoaded(true);

}, [id]);


// ==========================================
// Load TV Details
// ==========================================

useEffect(() => {

    async function loadTVDetails() {

        try {

            const data = await getTVDetails(id);

            setTVDetails(data);

            setSeasons(data.seasons || []);

        } catch (err) {

            console.log(err);

        }

    }

    loadTVDetails();

}, [id]);


// ==========================================
// Load Episodes
// ==========================================

useEffect(() => {

    async function loadEpisodes() {

        try {

            const data =
                await getSeasonDetails(id, season);

            setEpisodes(
                data.episodes || []

            );

        } catch (err) {

            console.log(err);

        }

    }

    loadEpisodes();

}, [id, season]);


// ==========================================
// Save TV Progress
// ==========================================

function saveTVProgress(progress) {

    if (!tvDetails) return;


    const stored = JSON.parse(
        localStorage.getItem("watchHistory") || "[]"
    );


    const tv = {

        id: tvDetails.id,

        name: tvDetails.name,

        poster_path: tvDetails.poster_path,

        media_type: "tv",

        season: season,

        episode: episode,

        provider: selectedProvider,

        progress: Number(
            progress.toFixed(1)
        )

    };


    // Remove previous entry for this TV show

    const filtered = stored.filter(
        item =>
            !(
                item.id === tv.id &&
                item.media_type === "tv"
            )
    );


    // Put current episode at the beginning

    const updated = [
        tv,
        ...filtered
    ];


    localStorage.setItem(
        "watchHistory",
        JSON.stringify(
            updated.slice(0, 20)
        )
    );


    console.log(
        "Saved TV watch history:",
        tv
    );

}


// ==========================================
// Listen for Player Status
// ==========================================

useEffect(() => {

    if (!tvDetails) return;

    function handlePlayerMessage(event) {

        const data = event.data;

        console.log(
            "MESSAGE FROM TV PLAYER:",
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
                    "TV CURRENT TIME:",
                    currentTime
                );

                console.log(
                    "TV DURATION:",
                    duration
                );

                console.log(
                    "TV PROGRESS:",
                    progress.toFixed(1) + "%"
                );


                saveTVProgress(progress);

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

}, [tvDetails, season, episode]);


// ==========================================
// Request Player Status Every 5 Seconds
// ==========================================

useEffect(() => {

    if (!tvDetails) return;

    const requestStatus = () => {

        if (!iframeRef.current) {

            console.log(
                "TV iframe not ready"
            );

            return;

        }


        console.log(
            "Requesting TV player status..."
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

}, [tvDetails, TV_URL]);


// ==========================================
// Fetch TV Recommendations
// ==========================================

useEffect(() => {
    if (!tvDetails) return;

    async function loadRecommendations() {
        try {
            const data = await getTVRecommendations(id);
            setRecommendations(data);
        } catch (err) {
            console.log(err);
        }
    }

    loadRecommendations();
}, [id, tvDetails]);


// ==========================================
// Loading
// ==========================================

if (!tvDetails) {

    return (
        <div className="loading">
            Loading...
        </div>
    );

}


// ==========================================
// JSX
// ==========================================

return (
    <>
        <div className="tv-details">

            <h1>
                {tvDetails.name}
            </h1>


            {/* ================================
                Video Player
            ================================= */}
            <iframe
                ref={iframeRef}
                className="movie-player"
                src={TV_URL}
                frameBorder="0"
                allowFullScreen
                allow="encrypted-media"
                title="TV Player"
                onLoad={() => {
                    iframeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
            />


            {/* ================================
                Controls
            ================================= */}
            <div className="controls">

                {/* Season */}
                <div className="control">

                    <label>
                        Season
                    </label>

                    <select
                        value={season}
                        onChange={(e) => {

                            setSeason(
                                Number(e.target.value)
                            );

                            // Start new season at episode 1
                            setEpisode(1);

                        }}
                    >

                        {seasons
                            .filter(
                                item =>
                                    item.season_number > 0
                            )
                            .map((item) => (

                                <option
                                    key={item.id}
                                    value={
                                        item.season_number
                                    }
                                >
                                    Season{" "}
                                    {item.season_number}
                                </option>

                            ))}
                    </select>

                </div>

                {/* Episode */}
                <div className="control">

                    <label>
                        Episode
                    </label>

                    <select
                        value={episode}
                        onChange={(e) =>
                            setEpisode(
                                Number(e.target.value)
                            )
                        }
                    >

                        {episodes.map((item) => (

                            <option
                                key={item.id}
                                value={
                                    item.episode_number
                                }
                            >
                                Episode{" "}
                                {item.episode_number}
                            </option>

                        ))}
                    </select>

                </div>

                {/* Provider */}
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
                                    {
                                        providers[key]
                                            .name
                                    }
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
                    recommendations.map((tv) => (
                        <TVCard key={tv.id} tv={tv} />
                    ))
                ) : (
                    <p>Loading recommendations...</p>
                )}
            </div>
        </div>
    </>
);
}

export default TVDetails;