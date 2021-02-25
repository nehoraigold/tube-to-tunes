//region imports
const { path: ffmpegPath } = require('@ffmpeg-installer/ffmpeg');
const YoutubeToMp3 = require('youtube-mp3-downloader');
const cliProgress = require('cli-progress');
const { stringToMap, getQueryParamsString } = require('../utils/utils');
//endregion

class Mp3Downloader {
    constructor(config) {
        this.config = config;
        this.currentDownloadBars = {};
        this.bar = new cliProgress.MultiBar({
            clearOnComplete: false,
            hideCursor: true,
            format: " {bar} || {percentage}% || {filename}"
        }, cliProgress.Presets.shades_grey);
        this.totalDownloads = 0;
        this.finishCount = 0;
    }

    Initialize = () => {
        this.YD = new YoutubeToMp3({
            ffmpegPath,
            outputPath: this.config.outputDirectory,
            youtubeVideoQuality: "highestaudio",
            queueParallelism: this.config.maxParallelDownloads,
            progressTimeout: 1000
        });

        this.YD.on("error", err => {
            console.log(`Received error - ${err}\nExiting...`); process.exit(1)
        });
        this.YD.on("finished", this.finish);
        this.YD.on("progress", this.progress);
    }

    Download = (song) => {
        const filename = `${song.name} - ${song.artist}.mp3`;
        const videoId = this.getVideoId(song.url);
        this.currentDownloadBars[videoId] = this.bar.create(100, 0, { filename });
        this.totalDownloads++;
        this.YD.download(videoId, filename);
    }

    SetCompletionCallback = (completionCallback) => {
        this.completionCallback = completionCallback;
    }

    getVideoId = (url) => {
        const VIDEO_ID_KEY = "v";
        const queryParams = getQueryParamsString(url);
        const params = stringToMap(queryParams, "&", "=");
        return params[VIDEO_ID_KEY];
    }

    progress = (event) => {
        this.currentDownloadBars[event.videoId].update(event.progress.percentage);
    }

    finish = async () => {
        this.finishCount++;
        if (this.finishCount === this.totalDownloads) {
            await this.complete();
        }
    }

    complete = async () => {
        this.bar.stop();
        if (this.completionCallback) {
            await this.completionCallback();
        }
    }
}

module.exports = Mp3Downloader;