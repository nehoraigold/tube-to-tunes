//region imports
const { writeFileSync, existsSync } = require("fs");
const { question } = require("readline-sync");
const { google } = require("googleapis");
const { getJsonFromFile } = require("../utils/utils");
const { JSON_SPACING } = require("../utils/constants");
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
        const credentials = this.getCredentials();
        if (!credentials) {
            return false;
        }
        const { client_id, client_secret, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        const token = await this.retrieveToken(oAuth2Client);
        if (!token) {
            return false;
        }

        oAuth2Client.setCredentials(token);
        this.auth = oAuth2Client;
        return true;
    };

    getCredentials = () => {
        try {
            return getJsonFromFile(this.credentialsPath);
        } catch (e) {
            global.logger.err(`${e}\nTo create or access your Google API credentials, click here: https://console.cloud.google.com/apis/dashboard`);
            return false;
        }
    };

    retrieveToken = async (oAuth2Client) => {
        let token;
        if (!existsSync(this.tokenPath)) {
            token = await this.createNewToken(oAuth2Client);
            if (!token || !this.storeToken(token)) {
                return null;
            }
        } else {
            token = getJsonFromFile(this.tokenPath);
        }
        return token;
    };

    createNewToken = async (oAuth2Client) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "online",
            scope: this.scopes,
        });
        global.logger.log(`Authorize this app by visiting this url:\n${authUrl}`);
        global.logger.log("Enter the code from that page here:");
        const code = question("");

        try {
            return await oAuth2Client.getToken(code);
        } catch (err) {
            global.logger.err(`Error while trying to retrieve access token: ${err}`);
            return null;
        }
    };

    storeToken = (token) => {
        try {
            writeFileSync(this.tokenPath, JSON.stringify(token, null, JSON_SPACING));
            global.logger.log(`Authorization token stored to ${this.tokenPath}`);
            return true;
        } catch (err) {
            global.logger.err(err);
            return false;
        }
    }
}

module.exports = GoogleAuthorizer;
