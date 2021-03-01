//region imports
const SpotifyAPI = require("spotify-web-api-node");
const ISongSource = require("../ISongSource");
const Song = require("../../model/Song");
const SpotifyAuthorizer = require("../../authorizer/SpotifyAuthorizer");
const { SpotifyTrackField, parseSpotifyTrackFields } = require("./SpotifyTrackFieldParser");
//endregion

class SpotifySongSource extends ISongSource {
    constructor(config, searcher) {
        super();
        this.api = new SpotifyAPI();
        this.authorizer = new SpotifyAuthorizer(this.api, config.credentialsPath);
        this.userId = config.userId;
        this.playlistName = config.playlistName;
        this.searcher = searcher;
        this.songs = [];
    }

    Initialize = async () => {
        try {
            return await this.authorizer.Authorize() && await this.searcher.Initialize();
        } catch (err) {
            logger.err(err);
            return false;
        }
    };

    LoadSongs = async () => {
        try {
            const playlist = await this.getPlaylist();
            if (!playlist) {
                return false;
            }

            const tracks = await this.getTracks(playlist.id);
            if (!tracks) {
                return false;
            }

            this.songs = await this.convertTracksToSongs(tracks);
            return true;
        } catch (err) {
            logger.err(err);
            return false;
        }
    };

    GetSongs = () => {
        return this.songs;
    };

    MarkAllAsProcessed = async () => {
        console.log("Can't mark these songs as processed. You must remove them from the playlist manually.");
        return true;
    };

    getPlaylist = async () => {
        const { body } = await this.api.getUserPlaylists(this.userId);
        const playlist = body.items.filter(item => item.name === this.playlistName)[0];
        if (!playlist) {
            logger.err(`Could not find playlist '${this.playlistName}' for user ${this.userId}. Is it public?`);
        }
        return playlist;
    };

    getTracks = async (playlistId) => {
        const fields = parseSpotifyTrackFields(
            SpotifyTrackField.TITLE,
            SpotifyTrackField.ARTIST,
            SpotifyTrackField.ALBUM,
            SpotifyTrackField.SONG_LENGTH
        );
        const { body: { items } } = await this.api.getPlaylistTracks(playlistId, { fields });
        return items;
    };

    convertTracksToSongs = async (tracks) => {
        const songs = [];
        for (const { track } of tracks) {
            const name = track.name;
            const artist = track.artists[0].name;
            const url = await this.searcher.Search({ name, artist });
            songs.push(new Song(name, artist, url));
        }
        return songs;
    };
}

module.exports = SpotifySongSource;