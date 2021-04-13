//region imports
const SpotifyAPI = require("spotify-web-api-node");
const { getYearFromDate } = require("../utils/utils");
const ISongInfoSearcher = require("./ISongInfoSearcher");
const SpotifyAuthorizer = require("../authorizer/SpotifyAuthorizer");
const { SpotifyTrackField, parseSpotifyTrackFields, extractFieldsFromTrack } = require("../utils/spotify_utils");
//endregion

class SpotifySongInfoSearcher extends ISongInfoSearcher {
    constructor(config) {
        super();
        this.spotify = new SpotifyAPI();
        this.authorizer = new SpotifyAuthorizer(this.spotify, config.credentialsPath);
    }

    Initialize = async () => {
        return await this.authorizer.Authorize();
    };

    FindSongInfo = async (searchString) => {
        const fields = parseSpotifyTrackFields(
            SpotifyTrackField.TITLE,
            SpotifyTrackField.ARTIST,
            SpotifyTrackField.ALBUM,
            SpotifyTrackField.TRACK_NUMBER,
            SpotifyTrackField.ALBUM_TOTAL_TRACKS,
            SpotifyTrackField.ALBUM_RELEASE_DATE
        );
        const { body: { tracks: { items } } } = await this.spotify.searchTracks(searchString, { fields });
        if (items.length === 0) {
            return null;
        }
        const songInfo = extractFieldsFromTrack(items[0]);
        songInfo.yearReleased = getYearFromDate(songInfo.dateReleased);
        return songInfo;
    };
}

module.exports = SpotifySongInfoSearcher;
