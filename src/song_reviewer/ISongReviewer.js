//region imports
const { ErrorType } = require("../utils/constants");
//endregion

class ISongReviewer {
    Review = (songs) => { void(songs); throw ErrorType.METHOD_NOT_IMPLEMENTED; }
}

module.exports = ISongReviewer;
