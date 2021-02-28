//region imports
const { path: ffmpegPath } = require('@ffmpeg-installer/ffmpeg');
const YoutubeToMp3 = require('youtube-mp3-downloader');
const IDownloader = require('./IDownloader');
const CliProgressBar = require("../progressbar/CliProgressBar");
const { stringToMap, getQueryParamsString } = require('../utils/utils');
//endregion

class Yt2Mp3Downloader extends IDownloader {
    constructor(config) {
        super();
        this.config = config;
        this.completionCallback = null;
        this.progressBar = new CliProgressBar();
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
            logger.err(error);
            process.exit(1);
        });
        this.YD.on("finished", this.finish);
        this.YD.on("progress", this.progress);
        return true;
    };

    Download = (song) => {
        const filename = `${song.name} - ${song.artist}.mp3`;
        const videoId = this.getVideoId(song.url);
        this.progressBar.AddBar(videoId, filename);
        this.YD.download(videoId, filename);
    };

    SetCompletionCallback = (completionCallback) => {
        this.completionCallback = completionCallback;
    };

    getVideoId = (url) => {
        const VIDEO_ID_KEY = "v";
        const PAIR_DELIMITER = "&";
        const KEY_VALUE_DELIMITER = "=";
        const queryParams = getQueryParamsString(url);
        const params = stringToMap(queryParams, PAIR_DELIMITER, KEY_VALUE_DELIMITER);
        return params[VIDEO_ID_KEY];
    };

    progress = (event) => {
        this.progressBar.UpdateBar(event.videoId, event.progress.percentage);
    };

    finish = async (error, event) => {
        this.progressBar.FinishBar(event.videoId);
        if (this.progressBar.AllDone()) {
            await this.complete();
        }
    };

    complete = async () => {
        this.progressBar.Stop();
        if (this.completionCallback) {
            await this.completionCallback();
        }
    };
}

module.exports = Yt2Mp3Downloader;