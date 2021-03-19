//region imports
const { ErrorType } = require("../utils/constants")
//endregion

class ISongInfoSearcher {
    Initialize = () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
    FillSongInfo = () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
}

module.exports = ISongInfoSearcher;