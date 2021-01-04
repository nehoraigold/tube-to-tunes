//region imports
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const YoutubeToMp3 = require('youtube-mp3-downloader');
const cliProgress = require('cli-progress');
const configs = require('../configs');

//endregion

class Mp3Downloader {
    constructor() {
        this.download = this.download.bind(this);
        this.progress = this.progress.bind(this);
        this.finish = this.finish.bind(this);
        this.complete = this.complete.bind(this);
        this.setCompletionCallback = this.setCompletionCallback.bind(this);
        this.initializeDownloader = this.initializeDownloader.bind(this);
        this.completionCallback = null;
        this.currentDownloadBars = {};
        this.bar = new cliProgress.MultiBar({
            clearOnComplete: false,
            hideCursor: true,
            format: " {bar} || {percentage}% || {filename}"
        }, cliProgress.Presets.shades_grey);
        this.totalDownloads = 0;
        this.finishCount = 0;
        this.initializeDownloader();
    }

    initializeDownloader() {
        this.YD = new YoutubeToMp3({
            ffmpegPath,
            outputPath: configs.outputDirectory,
            youtubeVideoQuality: "highestaudio",
            queueParallelism: configs.maxParallelDownloads,
            progressTimeout: 1000
        });

        this.YD.on("error", err => {console.log(`Received error - ${err}\nExiting...`); process.exit(1)});
        this.YD.on("finished", this.finish);
        this.YD.on("progress", this.progress);
    }

    download(song) {
        const filename = `${song.name} - ${song.artist}.mp3`;
        const videoId = this.getVideoId(song.url);
        this.currentDownloadBars[videoId] = this.bar.create(100, 0, { filename });
        this.totalDownloads++;
        this.YD.download(videoId, filename);
    }

    getVideoId(url) {
        const KEY_INDEX = 0;
        const VAL_INDEX = 1;
        const VIDEO_ID_KEY = "v";
        const args = url.split("?")[1].split("&");
        let argsMap = {};
        args.forEach(pair => {
            const keyval = pair.split("=");
            argsMap[keyval[KEY_INDEX]] = keyval[VAL_INDEX];
        });
        return argsMap[VIDEO_ID_KEY];
    }

    progress(event) {
        this.currentDownloadBars[event.videoId].update(event.progress.percentage);
    }

    finish() {
        this.finishCount++;
        if (this.finishCount === this.totalDownloads) {
            this.complete();
        }
    }

    complete() {
        this.bar.stop();
        if (this.completionCallback !== null) {
            this.completionCallback();
        }
        console.log("\nDownloads completed!");
    }

    setCompletionCallback(callback) {
        this.completionCallback = callback;
    }
}

module.exports = Mp3Downloader;