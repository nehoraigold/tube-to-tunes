//region imports
const { readFileSync, existsSync } = require("fs");
const { join, dirname } = require("path");
const DownloaderType = require("./DownloaderType");
const Yt2Mp3Downloader = require("./Yt2Mp3Downloader");
//endregion

class DownloaderFactory {
    static Create(config) {
        const downloaderType = config.downloader;
        const downloaderConfig = DownloaderFactory.getDownloaderConfig(config);
        switch (downloaderType) {
            case DownloaderType.YT2MP3:
                return new Yt2Mp3Downloader(downloaderConfig);
            default:
                throw `No such downloader type ${downloaderType}`;
        }
    }

    static getDownloaderConfig(config) {
        const downloaderConfigPath = join(dirname(require.main.filename), "..", "configs", `${config.downloader}.json`);
        if (!existsSync(downloaderConfigPath)) {
            return null;
        }
        const downloaderConfigFile = readFileSync(downloaderConfigPath);
        const downloaderConfig = JSON.parse(downloaderConfigFile.toString());
        downloaderConfig.outputDirectory = config.outputDirectory;
        return downloaderConfig;
    }
}

module.exports = DownloaderFactory;