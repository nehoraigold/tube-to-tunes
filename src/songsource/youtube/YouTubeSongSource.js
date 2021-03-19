//region imports
const { google } = require("googleapis");
const { YOUTUBE_API_VERSION } = require("../../utils/constants");
const ISongSource = require("../ISongSource");
const ApiKeyAuthorizer = require("../../authorizer/ApiKeyAuthorizer");
const Song = require("../../model/Song");
//endregion

class YouTubeSongSource extends ISongSource {
    constructor(config, songInfoSearcher) {
        super();
        this.playlistId = config.playlistId;
        this.markPlaylistAsDownloaded = config.markPlaylistAsDownloaded;
        this.forceDownloadPlaylist = config.forceDownloadPlaylist;
        this.forceDownloadVideos = config.forceDownloadVideos;
        this.authorizer = new ApiKeyAuthorizer(config.auth.apiKeyPath);
        this.songInfoSearcher = songInfoSearcher;
        this.youtube = null;
        this.playlistTitle = null;
        this.songs = [];
        this.downloadedPlaylistTitleAppender = "(Downloaded)";
    }

    Initialize = async () => {
        if (!(await this.authorizer.Authorize())) {
            return false;
        }
        if (!(await this.songInfoSearcher.Initialize())) {
            return false;
        }
        this.youtube = google.youtube({ version: YOUTUBE_API_VERSION, auth: this.authorizer.Get() });
        return await this.setPlaylistTitle();
    };

    LoadSongs = async () => {
        const tracks = await this.retrieveTracksFromPlaylist();
        if (!tracks) {
            return false;
        }
        return await this.retrieveSongInfo(tracks);
    };

    GetSongs = () => {
        return this.songs;
    };

    MarkAllAsProcessed = async () => {
        console.log("Can't mark these songs as processed. You must remove them from the playlist manually.");
        return true;
    };

    setPlaylistTitle = async () => {
        const { data } = await this.youtube.playlists.list({
            part: ["snippet", "id"],
            id: this.playlistId
        });
        const playlistInfo = data.items[0];
        if (!playlistInfo) {
            logger.err(`Could not find YouTube playlist with id ${this.playlistId}. Make it public?`);
            return false;
        }
        this.playlistTitle = playlistInfo.snippet.channelTitle;

        if (this.playlistTitle.indexOf(this.downloadedPlaylistTitleAppender) !== -1) {
            if (!this.forceDownloadPlaylist) {
                logger.err(`The playlist ${this.playlistTitle} has already been downloaded! Choose a different playlist or enable forceDownload`);
                return false;
            }
            logger.log(`The playlist ${this.playlistTitle} will be downloaded again because the 'forceDownloadPlaylist' option is enabled.`);
        }
        return true;
    };

    retrieveTracksFromPlaylist = async () => {
        const MAX_RESULTS = 50;
        try {
            const { data }  = await this.youtube.playlistItems.list({
                part: ["snippet", "contentDetails"],
                playlistId: this.playlistId,
                maxResults: MAX_RESULTS
            });
            return data.items;
        } catch (e) {
            logger.err(e);
            return null;
        }
    };

    retrieveSongInfo = async (tracks) => {
        for (const { snippet } of tracks) {
            let song = new Song(snippet.title, null, snippet.resourceId.videoId);
            const songInfo = await this.songInfoSearcher.Search(song.name);
            if (songInfo) {
                const { name, artist, album, trackNumber, albumTotalTracks, yearReleased } = songInfo;
                const track = `${trackNumber}/${albumTotalTracks}`;
                song = new Song(name, artist, song.youtubeVideoId, album, track, yearReleased);
            } else if (!this.forceDownloadVideos) {
                logger.err(`Could not retrieve song info for video with ID ${song.youtubeVideoId}: ${song.name}`);
                continue;
            }
            this.songs.push(song);
        }
        return this.songs.length > 0;
    }
}

module.exports = YouTubeSongSource;