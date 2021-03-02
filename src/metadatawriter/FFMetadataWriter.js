//region imports
const { existsSync } = require("fs");
const ffmetadata = require("ffmetadata");
//endregion

class FFMetadataWriter {
    constructor() {
        this.throwIfFfmpegDoesNotExist();
    }

    WriteMetadata = async (filename, song) => {
        try {
            await ffmetadata.write(filename, {
                title: song.name,
                artist: song.artist,
                album: song.album,
                track: song.track,
                date: song.yearReleased
            }, {});
        } catch (err) {
            logger.err("Error updating metadata - ", err);
        }
    };

    throwIfFfmpegDoesNotExist() {
        if (!this.ffmpegExists()) {
            throw `Can't find FFmpeg! Make sure your PATH can find it or set environment variable FFMPEG_PATH`;
        }
    }

    ffmpegExists() {
        const FFMPEG_ENVIRONMENT_VARIABLE = "FFMPEG_PATH";
        const FFMPEG_EXECUTABLE = "ffmpeg";
        const PATH_DELIMITER = ":";

        if (process.env[FFMPEG_ENVIRONMENT_VARIABLE]) {
            return true;
        }

        const paths = process.env.PATH.split(PATH_DELIMITER);
        for (const path of paths) {
            if (existsSync(`${path}/${FFMPEG_EXECUTABLE}`)) {
                return true;
            }
        }
        return false;
    }
}

module.exports = FFMetadataWriter;