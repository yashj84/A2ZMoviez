export const providers = {
    vidsrc: {
        name: "VidSrc",
    movie: (id) =>
      `https://vidsrc.sbs/embed/movie/${id}`,

    tv: (id, season, episode) =>
      `https://vidsrc.sbs/embed/tv/${id}/${season}/${episode}`
  },
    vidfast: {
        name: "VidFast",

        movie: (id) =>
            `https://vidfast.vc/movie/${id}?theme=7C3AED`,

        tv: (id, season, episode) =>
            `https://vidfast.vc/tv/${id}/${season}/${episode}?autoPlay=true&theme=7C3AED`,
    },

    videasy: {
        name: "VideoEasy",

        movie: (id) =>
            `https://player.videasy.net/movie/${id}?color=7C3AED`,

        tv: (id, season, episode) =>
            `https://player.videasy.net/tv/${id}/${season}/${episode}?color=7C3AED`,
    },

    vidKing: {
        name: "VideoKing",
    movie: (id) =>
      `https://www.vidking.net/embed/movie/${id}?color=7C3AED`,

    tv: (id, season, episode) =>
      `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?color=7C3AED`
  },
      vidLove: {
        name: "VidLove",
    movie: (id) =>
      `https://player.vidlove.cc/embed/movie/${id}?primarycolor=7C3AED`,

    tv: (id, season, episode) =>
      `https://player.vidlove.cc/embed/tv/${id}/${season}/${episode}?primarycolor=7C3AED`
  }

};