//region imports
const { getJsonFromFile, getAbsolutePath } = require("../utils/utils");
const IAuthorizer = require("./IAuthorizer");
//endregion

class ApiKeyAuthorizer extends IAuthorizer {
    constructor(apiKeyPath) {
        super();
        this.apiKeyPath = apiKeyPath;
        this.apiKey = "";
    }

    Get = () => {
        return this.apiKey;
    };

    Authorize = async () => {
        logger.Debug("ApiKeyAuthorizer authorizing...");
        const absolutePath = getAbsolutePath(this.apiKeyPath);
        try {
            const { key } = getJsonFromFile(absolutePath);
            this.apiKey = key;
        } catch (err) {
            logger.Err(err);
            return false;
        }
        logger.Debug("Successfully retrieved API key.");
        return true;
    };
}

module.exports = ApiKeyAuthorizer;