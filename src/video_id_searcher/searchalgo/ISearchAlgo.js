//region imports
const { ErrorType } = require("../../utils/constants");
//endregion

class ISearchAlgo {
    Search = async (song) => { void(song); throw ErrorType.METHOD_NOT_IMPLEMENTED; };
}

module.exports = ISearchAlgo;