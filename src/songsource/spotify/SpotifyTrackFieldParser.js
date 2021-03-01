const SpotifyTrackField = {
    ALL: "items",
    ALL_EXCEPT_AVAILABLE_MARKETS: "items.track.album(!available_markets),items.track(!available_markets)",
    TITLE: "items.track.name",
    ALBUM: "items.track.album.name",
    ARTIST: "items.track.artists.name",
    SONG_LENGTH: "items.track.duration_ms"
};

const parseSpotifyTrackFields = (...desiredFields) => {
    return desiredFields.join(",");
};

module.exports = {
    parseSpotifyTrackFields,
    SpotifyTrackField
};