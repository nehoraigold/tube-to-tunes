//region imports
const { google } = require('googleapis');
const { getYoutubeVideoIdFromUrl } = require("../../utils/utils");
const { GOOGLE_SHEETS_API_VERSION } = require("../../utils/constants");
const ISongSource = require("../ISongSource");
const GoogleSheetAuthorizer = require("../../authorizer/GoogleAuthorizer");
const Song = require('../../model/Song');
//endregion

const TITLE_INDEX = 0;
const ARTIST_INDEX = 1;
const URL_INDEX = 2;
const UNPROCESSED_SONG_ROW_LENGTH = 3;

class GoogleSheetSongSource extends ISongSource {
    constructor(config, songInfoSearcher) {
        super();
        this.sheetId = config.sheetId;
        this.authorizer = new GoogleSheetAuthorizer(config.auth);
        this.songInfoSearcher = songInfoSearcher;
        this.range = { lowBound: null, highBound: null };
        this.songs = [];
    }

    Initialize = async () => {
        return await this.authorizer.Authorize() && await this.songInfoSearcher.Initialize();
    };

    LoadSongs = async () => {
        let sheet = null;
        try {
            sheet = await this.loadSpreadsheet()
        } catch (err) {
            logger.err(err);
            return false;
        }

        const relevantRows = sheet.filter((row, i) => {
            const isRelevantRow = row.length === UNPROCESSED_SONG_ROW_LENGTH;
            if (isRelevantRow) {
                this.updateRange(i);
            }
            return isRelevantRow;
        });

        this.songs = await this.getSongsFromRows(relevantRows);
        return true;
    };


    loadSpreadsheet = async () => {
        const range = "A:E";
        const sheets = google.sheets({ version: GOOGLE_SHEETS_API_VERSION, auth: this.authorizer.Get() });
        const { data: { values } } = await sheets.spreadsheets.values.get({
            spreadsheetId: this.sheetId,
            range,
        });
        return values;
    };

    updateRange = (index) => {
        if (this.range.lowBound === null || this.range.lowBound > index) {
            this.range.lowBound = index;
        }
        if (this.range.highBound === null || this.range.highBound < index) {
            this.range.highBound = index;
        }
    };

    getSongsFromRows = async (rows) => {
        const songs = [];
        for (const row of rows) {
            const song = await this.getSongFromRow(row);
            songs.push(song);
        }
        return songs;
    };

    getSongFromRow = async (row) => {
        const title = row[TITLE_INDEX];
        const artist = row[ARTIST_INDEX];
        const youtubeId = getYoutubeVideoIdFromUrl(row[URL_INDEX]);

        const songInfo = await this.songInfoSearcher.FindSongInfo(`${title} ${artist}`);

        if (!songInfo) {
            return new Song(title, artist, youtubeId);
        }

        const { album, trackNumber, yearReleased, albumTotalTracks } = songInfo;
        const trackInfo = `${trackNumber}/${albumTotalTracks}`;
        return new Song(title, artist, youtubeId, album, trackInfo, yearReleased);
    };

    GetSongs = () => {
        return this.songs;
    };

    MarkAllAsProcessed = async (songs) => {
        const DATE_PROCESSED_COLUMN = "D";
        const range = `${DATE_PROCESSED_COLUMN}${this.range.lowBound + 1}:${DATE_PROCESSED_COLUMN}${this.range.highBound + 1}`;
        const sheets = google.sheets({ version: GOOGLE_SHEETS_API_VERSION, auth: this.authorizer.Get() });
        const dateProcessed = new Date();
        const values = Array(songs.length).fill(dateProcessed);
        const request = {
            data: [{ range, majorDimension: "COLUMNS", values: [ values ] }],
            valueInputOption: "RAW"
        };

        await sheets.spreadsheets.values.batchUpdate({
            auth: this.authorizer.Get(),
            spreadsheetId: this.sheetId,
            requestBody: request
        });
    };
}

module.exports = GoogleSheetSongSource;