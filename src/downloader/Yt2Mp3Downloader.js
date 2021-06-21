//region imports
const axios = require("axios");
const path = require("path");
const { path: ffmpegPath } = require("@ffmpeg-installer/ffmpeg");
const fs = require("fs");
const YoutubeToMp3 = require("youtube-mp3-downloader");
const IDownloader = require("./IDownloader");
const CliProgressBar = require("../progress_bar/CliProgressBar");
const { TEMP_ALBUM_ARTWORK_PATH } = require("../utils/constants");
const { createDirIfNeeded, removeDirIfNeeded } = require("../utils/utils");
//endregion

class Yt2Mp3Downloader extends IDownloader {
    constructor(config, metadataWriter) {
        super();
        this.config = config;
        this.metadataWriter = metadataWriter;
        this.completionCallback = null;
        this.progressBar = new CliProgressBar();
        this.onFinished = {};
    }

    Initialize = () => {
        this.YD = new YoutubeToMp3({
            ffmpegPath,
            outputPath: this.config.outputDirectory,
            youtubeVideoQuality: this.config.soundQuality,
            queueParallelism: this.config.maxParallelDownloads,
            progressTimeout: 1000
        });

        this.YD.on("error", (error) => {
            global.logger.err(error);
            global.process.exit(1);
        });
        this.YD.on("finished", this.finish);
        this.YD.on("progress", this.progress);
        return true;
    };

    Download = async (song) => {
        const filename = `${song.name} - ${song.artist}.mp3`;
        this.progressBar.AddBar(song.youtubeVideoId, filename);
        const artworkFilepath = await this.downloadAlbumArtwork(song);
        this.onFinished[song.youtubeVideoId] = this.getOnFinishedCallback(filename, song, artworkFilepath);
        this.YD.download(song.youtubeVideoId, filename);
    };

    SetCompletionCallback = (completionCallback) => {
        this.completionCallback = completionCallback;
    };

    getOnFinishedCallback = (filename, song, artworkFilepath) => {
        return async (filename) => {
            await this.metadataWriter.WriteMetadata(filename, song, artworkFilepath);
        };
    };

    progress = (event) => {
        this.progressBar.UpdateBar(event.videoId, event.progress.percentage);
    };

    finish = async (error, { videoId, file }) => {
        if (error) {
            global.logger.err("Error finishing download -", error);
            return;
        }
        if (this.onFinished[videoId]) {
            await this.onFinished[videoId](file);
        }
        this.progressBar.FinishBar(videoId);
        if (this.progressBar.AllDone()) {
            await this.complete();
        }
    };

    complete = async () => {
        this.progressBar.Stop();
        if (this.completionCallback) {
            await this.completionCallback();
            const WAIT_TIME_FOR_ALBUM_ARTWORK_MS = 1000;
            setTimeout(() => removeDirIfNeeded(TEMP_ALBUM_ARTWORK_PATH), WAIT_TIME_FOR_ALBUM_ARTWORK_MS);
        }
    };

    downloadAlbumArtwork = async (song) => {
        if (!song.albumArtworkUrl) {
            return null;
        }
        try {
            createDirIfNeeded(TEMP_ALBUM_ARTWORK_PATH);
            const filePath = path.join(TEMP_ALBUM_ARTWORK_PATH, `${song.name}.jpg`);
            const response = await axios.get(song.albumArtworkUrl, { responseType: "stream" });
            const writeStream = fs.createWriteStream(filePath);
            await response.data.pipe(writeStream);
            return filePath;
        } catch (e) {
            global.logger.err(e);
            return null;
        }
    }
}

module.exports = Yt2Mp3Downloader;
