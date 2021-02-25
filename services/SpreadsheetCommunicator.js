//region imports
const { google } = require('googleapis');
const Song = require('../model/Song');

//endregion

class SpreadsheetCommunicator {
    constructor(config, authorizer) {
        this.authorizer = authorizer;
        this.sheetId = config.google.googleSheetId;
        this.outputDirectory = config.outputDirectory;
        this.songs = [];
        this.range = [null, null];
    }

    LoadSongs = async () => {
        const TITLE_INDEX = 0;
        const ARTIST_INDEX = 1;
        const URL_INDEX = 2;
        const DATA_RANGE = "A:E";

        const sheets = google.sheets({ version: 'v4', auth: this.authorizer.auth });
        let res;
        try {
            res = await sheets.spreadsheets.values.get({
                spreadsheetId: this.sheetId,
                range: DATA_RANGE,
            });
        } catch (err) {
            return console.log("Error loading songs from spreadsheet:", err);
        }
        const rows = res.data.values;
        const UNPROCESSED_SONG_ROW_LENGTH = 3;
        rows.forEach((row, i) => {
            if (row.length !== UNPROCESSED_SONG_ROW_LENGTH) {
                return;
            }
            if (this.range[0] === null) {
                this.range[0] = i;
            }
            this.range[1] = i;
            this.songs.push(new Song(row[TITLE_INDEX], row[ARTIST_INDEX], row[URL_INDEX]))
        });
        const comment = this.songs.length === 0 ? 
            "No songs to download!" :
            `Ready to download ${this.songs.length} song${this.songs.length === 1 ? "" : "s"} to ${this.outputDirectory}...\n`;
        console.log(comment);
    }

    MarkAllAsProcessed = async () => {
        const DATE_PROCESSED_COLUMN = "D";
        const range = `${DATE_PROCESSED_COLUMN}${this.range[0] + 1}:${DATE_PROCESSED_COLUMN}${this.range[1] + 1}`;
        const sheets = google.sheets({ version: 'v4', auth: this.authorizer.auth });
        const dateProcessed = new Date();
        const values = Array(this.songs.length).fill(dateProcessed);
        const request = {
            data: [{ range, majorDimension: "COLUMNS", values: [ values ] }],
            valueInputOption: "RAW"
        };
        try {
            const { data: { totalUpdatedCells } } = await sheets.spreadsheets.values.batchUpdate({
                auth: this.authorizer.auth,
                spreadsheetId: this.sheetId,
                requestBody: request
            });
            console.log(`\nMarked ${totalUpdatedCells} songs as processed.`);
        } catch (err) {
            console.error("Error", err);
        }
    }

}

module.exports = SpreadsheetCommunicator;