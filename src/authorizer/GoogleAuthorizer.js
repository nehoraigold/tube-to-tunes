//region imports
const { writeFileSync, existsSync } = require("fs");
const { question } = require("readline-sync");
const { google } = require("googleapis");
const { getJsonFromFile } = require("../utils/utils");
const IAuthorizer = require("./IAuthorizer");
//endregion

class GoogleAuthorizer extends IAuthorizer {
    constructor(config) {
        super();
        this.tokenPath = config.tokenPath;
        this.credentialsPath = config.credentialsPath;
        this.scopes = config.scopes;
        this.auth = null;
    }

    Get = () => {
        return this.auth;
    };

    Authorize = async () => {
        const credentials = getJsonFromFile(this.credentialsPath);
        const { client_id, client_secret, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        if (!existsSync(this.tokenPath)) {
            return await this.getNewToken(oAuth2Client);
        }

        const token = getJsonFromFile(this.tokenPath);
        oAuth2Client.setCredentials(token);
        this.auth = oAuth2Client;
        return true;
    };

    getNewToken = async (oAuth2Client) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "online",
            scope: this.scopes,
        });
        global.logger.log(`Authorize this app by visiting this url: ${authUrl}`);
        global.logger.log("Enter the code from that page here:");
        const code = question("");
        
        let token;
        try {
            token = await oAuth2Client.getToken(code);
        } catch (err) {
            global.logger.err(`Error while trying to retrieve access token: ${err}`);
            return false;
        }

        oAuth2Client.setCredentials(token);
        try {
            writeFileSync(this.tokenPath, JSON.stringify(token, null, 4));
        } catch (err) {
            global.logger.err(err);
            return false;
        }

        global.logger.log(`Authorization token stored to ${this.tokenPath}`);
        this.auth = oAuth2Client;
        return true;
    };
}

module.exports = GoogleAuthorizer;
