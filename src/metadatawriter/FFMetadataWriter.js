//region imports
const { path: ffmpegPath } = require("@ffmpeg-installer/ffmpeg");
const ffmetadata = require("ffmetadata");
const { getAbsolutePath } = require("../utils/utils");
//endregion

class FFMetadataWriter {
    constructor() {
        ffmetadata.setFfmpegPath(ffmpegPath);
    }

    WriteMetadata = async (filename, song, albumArtworkPath) => {
        const options = albumArtworkPath ? { attachments: [getAbsolutePath(albumArtworkPath)] } : {};
        try {
            await ffmetadata.write(filename, {
                title: song.name,
                artist: song.artist,
                album: song.album,
                track: song.track,
                date: song.yearReleased
            }, options);
        } catch (err) {
            global.logger.err("Error updating metadata - ", err);
        }
    };
}

module.exports = FFMetadataWriter;
