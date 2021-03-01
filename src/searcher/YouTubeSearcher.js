//region imports
const { google } = require("googleapis");
const ApiKeyAuthorizer = require("../authorizer/ApiKeyAuthorizer");
const SearchAlgoFactory = require("./searchalgo/SearchAlgoFactory");
//endregion

class YouTubeSearcher {
    constructor(config) {
        this.authorizer = new ApiKeyAuthorizer(config.auth.apiKeyPath);
        this.youtube = null;
        this.algo = config.searchAlgo;
    }

    Initialize = async () => {
        if (!(await this.authorizer.Authorize())) {
            return false;
        }
        this.youtube = google.youtube({ version: 'v3', auth: this.authorizer.Get() });
        this.algo = SearchAlgoFactory.Create(this.algo, this.youtube);
        return true;
    };

    Search = async (song) => {
        return await this.algo.Search(song);
    }
}

module.exports = YouTubeSearcher;