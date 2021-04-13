//region imports
const OfficialAudioSearchAlgo = require("./OfficialAudioSearchAlgo");
//endregion

const SEARCH_ALGO_TYPES = {
    "OfficialAudio": OfficialAudioSearchAlgo
};

class SearchAlgoFactory {
    static Create(algoType, youtube) {
        if (!Object.keys(SEARCH_ALGO_TYPES).includes(algoType)) {
            throw `Search algo type '${algoType}' does not exist!`;
        }
        return new SEARCH_ALGO_TYPES[algoType](youtube);
    }
}

module.exports = SearchAlgoFactory;
