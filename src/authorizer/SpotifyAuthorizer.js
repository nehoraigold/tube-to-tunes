//region imports
const { getJsonFromFile, getAbsolutePath } = require('../utils/utils');
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
        logger.Debug("Spotify authorizer authorizing...");
        const accessToken = await this.getAccessToken();
        if (!accessToken) {
            logger.Err("Unable to retrieve access token.");
            return false;
        }
        this.api.setAccessToken(accessToken);
        logger.Debug("Spotify authorization completed successfully.");
        return true;
    };

    getCredentials = (relativePath) => {
        const credentialsPath = getAbsolutePath(relativePath);
        return getJsonFromFile(credentialsPath);
    };

    getAccessToken = async () => {
        try {
            const { body: { access_token } } = await this.api.clientCredentialsGrant();
            return access_token ? access_token : "";
        } catch (err) {
            logger.Err(err);
            return "";
        }
    };
}

module.exports = SpotifyAuthorizer;