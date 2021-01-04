//region imports
const { google } = require('googleapis');
const configs = require('../configs');

//endregion

class SpreadsheetCommunicator {
    constructor(authorizer) {
        this.authorizer = authorizer;
        this.songs = [];
        this.range = [null, null];
        this.isReady = false;
        this.loadSongs = this.loadSongs.bind(this);
        this.markAllAsProcessed = this.markAllAsProcessed.bind(this);
        this.intervalId = setInterval(() => {
            if (this.authorizer.auth === null) {
                return;
            }
            this.loadSongs();
            clearInterval(this.intervalId);
        }, 1000)
    }

    loadSongs() {
        const TITLE_INDEX  = 0,
              ARTIST_INDEX = 1,
              URL_INDEX    = 2;
        const sheets = google.sheets({ version: 'v4', auth: this.authorizer.auth });
        sheets.spreadsheets.values.get({
            spreadsheetId: configs.googleSheetId,
            range: 'A:E',
        }, (err, res) => {
            if (err) {
                return console.log("Error loading songs from spreadsheet:", err);
            }
            const rows = res.data.values;
            rows.forEach((row, i) => {
                if (row.length !== 3) {
                    return;
                }
                if (this.range[0] === null) {
                    this.range[0] = i;
                }
                this.range[1] = i;
                this.songs.push(SpreadsheetCommunicator.createSong(row[TITLE_INDEX], row[ARTIST_INDEX], row[URL_INDEX]))
            });
            const comment = this.songs.length === 0 ? 
                "No songs to download!" :
                `Ready to download ${this.songs.length} songs to ${configs.outputDirectory}...\n`;
            console.log(comment);
            this.isReady = true;
        });
    }

    static createSong(name, artist, url) {
        return { name, artist, url };
    }

    markAllAsProcessed() {
        const sheets = google.sheets({ version: 'v4', auth: this.authorizer.auth });
        const dateProcessed = new Date();
        const range = `D${this.range[0] + 1}:D${this.range[1] + 1}`;
        const values = Array(this.songs.length).fill(dateProcessed);
        const request = {
            data: [{ range, majorDimension: "COLUMNS", values: [ values ] }],
            valueInputOption: "RAW"
        };
        sheets.spreadsheets.values.batchUpdate({
            auth: this.authorizer.auth,
            spreadsheetId: configs.googleSheetId,
            requestBody: request
        }, (err, res) => {
            if (err) {
                console.log("Error", err);
            }
            console.log(`\nMarked ${res.data.totalUpdatedCells} songs as processed.`);
        });
    }

}

module.exports = SpreadsheetCommunicator;