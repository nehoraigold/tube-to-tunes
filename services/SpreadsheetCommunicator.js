//region imports
const { google } = require('googleapis');
const Song = require('../model/Song');
//endregion

class SpreadsheetCommunicator {
    constructor(config, authorizer) {
        this.authorizer = authorizer;
        this.sheetId = config.google.sheetId;
        this.outputDirectory = config.download.outputDirectory;
        this.range = {
            lowBound: null,
            highBound: null
        };
    }

    LoadSongs = async () => {
        const TITLE_INDEX = 0;
        const ARTIST_INDEX = 1;
        const URL_INDEX = 2;
        const UNPROCESSED_SONG_ROW_LENGTH = 3;
        const sheet = await this.loadSpreadsheet();
        const relevantRows = sheet.filter((row, i) => {
            if (row.length === UNPROCESSED_SONG_ROW_LENGTH) {
                this.updateRange(i);
                return true;
            }
            return false;
        });

        return relevantRows.map((row) => new Song(row[TITLE_INDEX], row[ARTIST_INDEX], row[URL_INDEX]));
    }

    MarkAllAsProcessed = async (songs) => {
        const DATE_PROCESSED_COLUMN = "D";
        const range = `${DATE_PROCESSED_COLUMN}${this.range.lowBound + 1}:${DATE_PROCESSED_COLUMN}${this.range.highBound + 1}`;
        const sheets = google.sheets({ version: 'v4', auth: this.authorizer.auth });
        const dateProcessed = new Date();
        const values = Array(songs.length).fill(dateProcessed);
        const request = {
            data: [{ range, majorDimension: "COLUMNS", values: [ values ] }],
            valueInputOption: "RAW"
        };

        await sheets.spreadsheets.values.batchUpdate({
            auth: this.authorizer.auth,
            spreadsheetId: this.sheetId,
            requestBody: request
        });
    }

    loadSpreadsheet = async () => {
        const range = "A:E";
        const sheets = google.sheets({ version: 'v4', auth: this.authorizer.auth });
        const { data: { values } } = await sheets.spreadsheets.values.get({
            spreadsheetId: this.sheetId,
            range,
        });
        return values;
    }

    updateRange = (index) => {
        if (this.range.lowBound === null || this.range.lowBound > index) {
            this.range.lowBound = index;
        }

        if (this.range.highbBound === null || this.range.highBound < index) {
            this.range.highBound = index;
        }
    }
}

module.exports = SpreadsheetCommunicator;