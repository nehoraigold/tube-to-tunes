//region imports
const { path: ffmpegPath } = require("@ffmpeg-installer/ffmpeg");
const ffmetadata = require("ffmetadata");
//endregion

class FFMetadataWriter {
    constructor() {
        ffmetadata.setFfmpegPath(ffmpegPath);
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
            logger.Err("Error updating metadata - ", err);
        }
    };
}

module.exports = FFMetadataWriter;