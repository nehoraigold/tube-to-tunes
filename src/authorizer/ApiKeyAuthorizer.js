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
        const absolutePath = getAbsolutePath(this.apiKeyPath);
        try {
            const { key } = getJsonFromFile(absolutePath);
            this.apiKey = key;
        } catch (err) {
            logger.err(err);
            return false;
        }
        return true;
    };
}

module.exports = ApiKeyAuthorizer;