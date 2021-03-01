//region imports
const { getAbsolutePath, getJsonFromFile } = require("../utils/utils");
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
        const downloaderConfigPath = getAbsolutePath(`configs/${config.downloader}.json`);
        const downloaderConfig = getJsonFromFile(downloaderConfigPath);
        downloaderConfig.outputDirectory = config.outputDirectory;
        return downloaderConfig;
    }
}

module.exports = DownloaderFactory;