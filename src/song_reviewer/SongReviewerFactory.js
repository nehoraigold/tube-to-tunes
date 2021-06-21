//region imports
const PromptSongReviewer = require("./PromptSongReviewer");
//endregion

class SongReviewerFactory {
    static Create(config) {
        try {
            return new PromptSongReviewer(config);
        } catch (e) {
            global.logger.err(e);
            return null;
        }
    }
}

module.exports = SongReviewerFactory;
