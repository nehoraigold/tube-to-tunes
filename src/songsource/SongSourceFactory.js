//region imports
const { readFileSync, existsSync } = require("fs");
const { join, dirname } = require("path");
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
        const songSourceConfigPath = join(dirname(require.main.filename), "..", "configs", `${songSourceType}.json`);
        if (!existsSync(songSourceConfigPath)) {
            return null;
        }
        const songSourceConfigFile = readFileSync(songSourceConfigPath);
        return JSON.parse(songSourceConfigFile.toString());
    }
}

module.exports = SongSourceFactory;