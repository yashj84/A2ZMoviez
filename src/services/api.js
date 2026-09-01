const API_KEY = "1f0cc1e0737d83944ea2da497ed762ab";
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopular = async (type, page = 1) => {

    let url;

    if (type === "multi") {

        url =
            `${BASE_URL}/trending/all/day?api_key=${API_KEY}&page=${page}`;

    } else {

        url =
            `${BASE_URL}/${type}/popular?api_key=${API_KEY}&page=${page}&include_adult=false`;

    }

    const response = await fetch(url);

    const data = await response.json();


    // Remove Japanese-language TV/anime
    if (type === "multi") {

        data.results = data.results.filter(
            item =>
                !(
                    item.media_type === "tv" &&
                    item.original_language === "ja"
                )
        );

    }


    return data;
};

export const searchMedia = async (query, page = 1) => {

    const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );

    const data = await response.json();

    // Remove people from the results
    data.results = data.results.filter(
        item => item.media_type !== "person"
    );

    return data;

}

export const showGenreMovies = async (genreId, page = 1) => {

    const response = await fetch(
        `${BASE_URL}/discover/movie?with_genres=${genreId}&page=${page}&api_key=${API_KEY}`
    );

    const data = await response.json();

    return data.results;

}

export const getTVDetails = async (id) => {

    const response = await fetch(
        `${BASE_URL}/tv/${id}?api_key=${API_KEY}`
    );

    const data = await response.json();

    return data;

}
export const getSeasonDetails = async (id, season) => {

    const response = await fetch(
        `${BASE_URL}/tv/${id}/season/${season}?api_key=${API_KEY}`
    );

    const data = await response.json();

    return data;

}

export const getMovieDetails = async (id) => {

    const response = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
    );

    const data = await response.json();

    return data;

}

export const searchSuggestions = async (query) => {

    if (!query.trim()) return [];

    const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    const data = await response.json();

    return data.results.filter(
        item =>
            item.media_type !== "person" &&
            (item.title || item.name)
    );
};

export const RandomMedia = async () => {
    const page = Math.floor(Math.random() * 500) + 1;

    const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&include_adult=false}&vote_average.gte=4&vote_count.gte=100`
    );

    const data = await response.json();

    const randomMovie =
        data.results[Math.floor(Math.random() * data.results.length)];

    return randomMovie;
};


export const getMovieTrailer = async (id) => {
    const response = await fetch(
        `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`
    );

    const data = await response.json();

    return data.results.find(
        (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer"
    );
};

export const getMovieRecommendations = async (id) => {
    const response = await fetch(
        `${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}`
    );

    const data = await response.json();
    return data.results;
};

export const getTVRecommendations = async (id) => {
    const response = await fetch(
        `${BASE_URL}/tv/${id}/recommendations?api_key=${API_KEY}`
    );

    const data = await response.json();
    return data.results;
};
