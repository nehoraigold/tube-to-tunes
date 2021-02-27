//region imports
const { readFileSync, existsSync } = require("fs");
const { join, dirname } = require("path");
const SongLoaderType = require("./SongLoaderType");
const GoogleSheetsSongLoader = require("./googlesheets/GoogleSheetSongLoader");
//endregion

class SongLoaderFactory {
    static Create(config) {
        const songLoaderType = config.songLoader;
        const songLoaderConfig = SongLoaderFactory.getSongLoaderConfig(songLoaderType);
        switch (songLoaderType) {
            case SongLoaderType.GOOGLE_SHEETS:
                return new GoogleSheetsSongLoader(songLoaderConfig);
            default:
                throw new Error(`No such song loader type ${songLoaderType}`);
        }
    }

    static getSongLoaderConfig(songLoaderType) {
        const songLoaderConfigPath = join(dirname(require.main.filename), "..", "configs", `${songLoaderType}.json`);
        if (!existsSync(songLoaderConfigPath)) {
            return null;
        }
        const songLoaderConfigFile = readFileSync(songLoaderConfigPath);
        return JSON.parse(songLoaderConfigFile.toString());
    }
}

module.exports = SongLoaderFactory;