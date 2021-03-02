//region imports
const { getConfig } = require("../utils/utils");
const DownloaderType = require("./DownloaderType");
const Yt2Mp3Downloader = require("./Yt2Mp3Downloader");
const FFMetadataWriter = require("../metadatawriter/FFMetadataWriter");
//endregion

class DownloaderFactory {
    static Create(config) {
        try {
            const downloaderConfig = this.getDownloaderConfig(config);
            return this.createDownloader(config.downloader, downloaderConfig);
        } catch (err) {
            logger.err(err);
            return null;
        }
    }

    static createDownloader(downloaderType, downloaderConfig) {
        switch (downloaderType) {
            case DownloaderType.YT2MP3:
                return new Yt2Mp3Downloader(downloaderConfig, new FFMetadataWriter());
            default:
                throw `No such downloader type ${downloaderType}`;
        }
    }

    static getDownloaderConfig(config) {
        const { downloader, outputDirectory } = config;
        const downloaderConfig = getConfig(downloader);
        return { ...downloaderConfig, outputDirectory };
    }
}

module.exports = DownloaderFactory;