//region imports
const fs = require('fs');
const { question } = require('readline-sync');
const { google } = require('googleapis');
const logger = require("../../utils/logging");
//endregion

class GoogleSheetAuthorizer {
    constructor(config) {
        this.tokenPath = config.tokenPath;
        this.credentialsPath = config.credentialsPath;
        this.scopes = config.scopes;
        this.auth = null;
    }

    Authorize = async () => {
        const credentials = JSON.parse(fs.readFileSync(this.credentialsPath).toString());
        const { client_id, client_secret, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        let token;
        try {
            token = fs.readFileSync(this.tokenPath);
        } catch (err) {
            return await this.getNewToken(oAuth2Client);
        }

        oAuth2Client.setCredentials(JSON.parse(token));
        this.auth = oAuth2Client;
    };

    getNewToken = async (oAuth2Client) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'online',
            scope: this.scopes,
        });
        logger.log(`Authorize this app by visiting this url: ${authUrl}`);
        logger.log("Enter the code from that page here:");
        const code = question('');
        
        let token;
        try {
            token = await oAuth2Client.getToken(code);
        } catch (err) {
            return logger.err(`Error while trying to retrieve access token: ${err}`);
        }

        oAuth2Client.setCredentials(token);
        try {
            fs.writeFileSync(this.tokenPath, JSON.stringify(token));
        } catch (err) {
            return logger.err(err);
        }

        logger.log(`Authorization token stored to ${this.tokenPath}`);
        this.auth = oAuth2Client;
    };
}

module.exports = GoogleSheetAuthorizer;
