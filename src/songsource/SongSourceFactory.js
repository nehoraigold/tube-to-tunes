//region imports
const { getConfig } = require("../utils/utils");
const SongSourceType = require("./SongSourceType");
const GoogleSheetsSongSource = require("./googlesheets/GoogleSheetSongSource");
const SpotifySongSource = require("./spotify/SpotifySongSource");
const YouTubeSearcher = require("../searcher/YouTubeSearcher");
//endregion

class SongSourceFactory {
    static Create(config) {
        try {
            return this.createSongSource(config.songSource);
        } catch (err) {
            logger.Err(err);
            return null;
        }
    }

    static createSongSource(songSourceType) {
        const songSourceConfig = getConfig(songSourceType);
        switch (songSourceType) {
            case SongSourceType.GOOGLE_SHEETS:
                return new GoogleSheetsSongSource(songSourceConfig);
            case SongSourceType.SPOTIFY:
                const searcher = new YouTubeSearcher(getConfig("youtube"));
                return new SpotifySongSource(songSourceConfig, searcher);
            default:
                throw `No such song source type - ${songSourceType}`;
        }
    }
}

module.exports = SongSourceFactory;