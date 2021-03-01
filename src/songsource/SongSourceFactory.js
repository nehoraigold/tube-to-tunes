//region imports
const { getAbsolutePath, getJsonFromFile } = require("../utils/utils");
const SongSourceType = require("./SongSourceType");
const GoogleSheetsSongSource = require("./googlesheets/GoogleSheetSongSource");
//endregion

class SongSourceFactory {
    static Create(config) {
        const songSourceType = config.songSource;
        const songSourceConfig = SongSourceFactory.getSongSourceConfig(songSourceType);
        switch (songSourceType) {
            case SongSourceType.GOOGLE_SHEETS:
                return new GoogleSheetsSongSource(songSourceConfig);
            default:
                throw new Error(`No such song source type ${songSourceType}`);
        }
    }

    static getSongSourceConfig(songSourceType) {
        const songSourceConfigPath = getAbsolutePath(`configs/${songSourceType}.json`);
        return getJsonFromFile(songSourceConfigPath);
    }
}

module.exports = SongSourceFactory;