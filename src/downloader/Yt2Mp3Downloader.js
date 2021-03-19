//region imports
const { path: ffmpegPath } = require('@ffmpeg-installer/ffmpeg');
const YoutubeToMp3 = require('youtube-mp3-downloader');
const IDownloader = require('./IDownloader');
const CliProgressBar = require("../progress_bar/CliProgressBar");
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
            logger.err(error);
            process.exit(1);
        });
        this.YD.on("finished", this.finish);
        this.YD.on("progress", this.progress);
        return true;
    };

    Download = (song) => {
        const filename = `${song.name} - ${song.artist}.mp3`;
        this.progressBar.AddBar(song.youtubeVideoId, filename);
        this.onFinished[song.youtubeVideoId] = async (filename) => {
            await this.metadataWriter.WriteMetadata(filename, song);
        };
        this.YD.download(song.youtubeVideoId, filename);
    };

    SetCompletionCallback = (completionCallback) => {
        this.completionCallback = completionCallback;
    };

    progress = (event) => {
        this.progressBar.UpdateBar(event.videoId, event.progress.percentage);
    };

    finish = async (error, { videoId, file }) => {
        if (error) {
            logger.err("Error finishing download -", error);
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
        }
    };
}

module.exports = Yt2Mp3Downloader;