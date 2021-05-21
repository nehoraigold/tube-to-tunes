//region imports
const { getJsonFromFile } = require("../utils/utils");
const IAuthorizer = require("./IAuthorizer");
//endregion

class SpotifyAuthorizer extends IAuthorizer {
    constructor(api, credentialsPath) {
        super();
        this.api = api;
        this.api.setCredentials(this.getCredentials(credentialsPath));
    }

    Get = () => {
        return this.api.getCredentials();
    };

    Authorize = async () => {
        const accessToken = await this.getAccessToken();
        if (!accessToken) {
            global.logger.err("Unable to retrieve access token.");
            return false;
        }
        this.api.setAccessToken(accessToken);
        return true;
    };

    getCredentials = (relativePath) => {
        try {
            return getJsonFromFile(relativePath);
        } catch (e) {
            throw `${e}\nTo create or access your Spotify API credentials, click here: https://developer.spotify.com/dashboard/`;
        }
    };

    getAccessToken = async () => {
        try {
            const { body: { access_token } } = await this.api.clientCredentialsGrant();
            return access_token ? access_token : "";
        } catch (err) {
            global.logger.err(err);
            return "";
        }
    };
}

module.exports = SpotifyAuthorizer;
