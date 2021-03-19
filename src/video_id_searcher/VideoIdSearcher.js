//region imports
const { google } = require("googleapis");
const { YOUTUBE_API_VERSION } = require("../utils/constants");
const ApiKeyAuthorizer = require("../authorizer/ApiKeyAuthorizer");
const SearchAlgoFactory = require("./searchalgo/SearchAlgoFactory");
//endregion

class VideoIdSearcher {
    constructor(algoConfig, youTubeConfig) {
        this.algo = algoConfig.searchAlgo;
        this.authorizer = new ApiKeyAuthorizer(youTubeConfig.auth.apiKeyPath);
        this.youtube = null;
    }

    Initialize = async () => {
        if (!(await this.authorizer.Authorize())) {
            return false;
        }
        this.youtube = google.youtube({ version: YOUTUBE_API_VERSION, auth: this.authorizer.Get() });
        this.algo = SearchAlgoFactory.Create(this.algo, this.youtube);
        return true;
    };

    Search = async (song) => {
        return this.algo.Search(song);
    }
}

module.exports = VideoIdSearcher;