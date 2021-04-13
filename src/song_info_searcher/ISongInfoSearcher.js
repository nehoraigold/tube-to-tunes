//region imports
const { ErrorType } = require("../utils/constants");
//endregion

class ISongInfoSearcher {
    Initialize = () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
    FindSongInfo = (searchQuery) => { void(searchQuery); throw ErrorType.METHOD_NOT_IMPLEMENTED; };
}

module.exports = ISongInfoSearcher;