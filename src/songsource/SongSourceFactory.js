//region imports
const { getConfig } = require("../utils/utils");
const SongSourceType = require("./SongSourceType");
const GoogleSheetsSongSource = require("./googlesheets/GoogleSheetSongSource");
const SpotifySongSource = require("./spotify/SpotifySongSource");
const VideoIdSearcher = require("../video_id_searcher/VideoIdSearcher");
const YouTubeSongSource = require("./youtube/YouTubeSongSource");
const SpotifySongInfoSearcher = require("../song_info_searcher/SpotifySongInfoSearcher");
//endregion

class SongSourceFactory {
    static Create(config) {
        try {
            return this.createSongSource(config.songSource);
        } catch (err) {
            global.logger.err(err);
            return null;
        }
    }

    static createSongSource(songSourceType) {
        const songSourceConfig = getConfig(songSourceType);
        switch (songSourceType) {
        case SongSourceType.GOOGLE_SHEETS: {
            const songInfoSearcher = new SpotifySongInfoSearcher(getConfig("spotify"));
            return new GoogleSheetsSongSource(songSourceConfig, songInfoSearcher);
        }
        case SongSourceType.SPOTIFY: {
            const videoIdSearcher = new VideoIdSearcher(getConfig("video_id_searcher"), getConfig("youtube"));
            return new SpotifySongSource(songSourceConfig, videoIdSearcher);
        }
        case SongSourceType.YOUTUBE: {
            const songInfoSearcher = new SpotifySongInfoSearcher(getConfig("spotify"));
            return new YouTubeSongSource(songSourceConfig, songInfoSearcher);
        }
        default:
            throw `No such song source type - ${songSourceType}`;
        }
    }
}

module.exports = SongSourceFactory;