//region imports
const { ErrorType } = require("../utils/constants");
//endregion

class ISongInfoSearcher {
    Initialize = () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
    FindSongInfo = (searchQuery) => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
}

module.exports = ISongInfoSearcher;