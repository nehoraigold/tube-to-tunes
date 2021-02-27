//region imports
const { path: ffmpegPath } = require('@ffmpeg-installer/ffmpeg');
const YoutubeToMp3 = require('youtube-mp3-downloader');
const cliProgress = require('cli-progress');
const IDownloader = require('./IDownloader');
const { stringToMap, getQueryParamsString } = require('../utils/utils');
//endregion

class Yt2Mp3Downloader extends IDownloader {
    constructor(config) {
        super();
        this.config = config;
        this.currentDownloadBars = {};
        this.bar = new cliProgress.MultiBar({
            clearOnComplete: false,
            hideCursor: true,
            format: " {bar} || {percentage}% || {filename}"
        }, cliProgress.Presets.shades_grey);
        this.totalDownloads = 0;
        this.finishCount = 0;
        this.completionCallback = null;
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
            logger.err(new Error(error));
            process.exit(1);
        });
        this.YD.on("finished", this.finish);
        this.YD.on("progress", this.progress);
        return true;
    };

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

module.exports = Yt2Mp3Downloader;