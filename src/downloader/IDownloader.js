//region imports
const { ErrorType } = require("../utils/constants");
//endregion

class IDownloader {
    Initialize = async () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
    SetCompletionCallback = (completionCallback) => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
    Download = async (song) => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
}

module.exports = IDownloader;