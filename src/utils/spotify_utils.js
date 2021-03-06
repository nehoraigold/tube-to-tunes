const SpotifyTrackField = {
    ALL: "items",
    ALL_EXCEPT_AVAILABLE_MARKETS: "items.track.album(!available_markets),items.track(!available_markets)",
    TITLE: "items.track.name",
    ALBUM: "items.track.album.name",
    ARTIST: "items.track.artists.name",
    ALBUM_TOTAL_TRACKS: "items.track.album.total_tracks",
    ALBUM_RELEASE_DATE: "items.track.album.release_date",
    TRACK_NUMBER: "items.track.track_number",
    SONG_LENGTH: "items.track.duration_ms",
    ALBUM_ARTWORK: "items.track.album.images"
};

const parseSpotifyTrackFields = (...desiredFields) => {
    return desiredFields.join(",");
};

const extractFieldsFromTrack = (track) => {
    const imageData = track.album.images.reduce((biggestImage, nextImage) => {
        return biggestImage.width > nextImage.width ? biggestImage : nextImage;
    });
    return {
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        trackNumber: track.track_number,
        albumTotalTracks: track.album.total_tracks,
        durationMs: track.duration_ms,
        dateReleased: track.album.release_date,
        albumArtworkUrl: imageData.url
    };
};

module.exports = {
    parseSpotifyTrackFields,
    extractFieldsFromTrack,
    SpotifyTrackField
};
