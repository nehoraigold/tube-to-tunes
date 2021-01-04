//region imports
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const credentials = require('../credentials');

//endregion

class Authorizer {
    constructor() {
        this.authorize = this.authorize.bind(this);
        this.getNewToken = this.getNewToken.bind(this);
        this.TOKEN_PATH = "token.json";
        this.SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
        this.auth = null;
        this.authorize();
    }

    authorize() {
        const { client_id, client_secret, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        fs.readFile(this.TOKEN_PATH, (err, token) => {
            if (err) {
                return this.getNewToken(oAuth2Client);
            }
            oAuth2Client.setCredentials(JSON.parse(token));
            this.auth = oAuth2Client;
        });
    }

    getNewToken(oAuth2Client) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error while trying to retrieve access token:', err);
                oAuth2Client.setCredentials(token);
                fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('Authorization token stored to', this.TOKEN_PATH);
                });
                this.auth = oAuth2Client;
            });
        });
    }
}

module.exports = Authorizer;
