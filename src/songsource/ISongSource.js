//region imports
const { ErrorType } = require("../utils/constants");
//endregion

class ISongSource {
     Initialize = async () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
     LoadSongs = async () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
     GetSongs = () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
     MarkAllAsProcessed = async () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
}

module.exports = ISongSource;