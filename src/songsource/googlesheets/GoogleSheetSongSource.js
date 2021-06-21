//region imports
const { google } = require("googleapis");
const { getYoutubeVideoIdFromUrl } = require("../../utils/utils");
const { GOOGLE_SHEETS_API_VERSION } = require("../../utils/constants");
const ISongSource = require("../ISongSource");
const GoogleSheetAuthorizer = require("../../authorizer/GoogleAuthorizer");
const Song = require("../../model/Song");
//endregion

const TITLE_INDEX = 0;
const ARTIST_INDEX = 1;
const URL_INDEX = 2;

class GoogleSheetSongSource extends ISongSource {
    constructor(config, songInfoSearcher) {
        super();
        this.sheetId = config.sheetId;
        this.authorizer = new GoogleSheetAuthorizer(config.auth);
        this.songInfoSearcher = songInfoSearcher;
        this.youtubeIdToRowNumber = {};
        this.songs = [];
    }

    Initialize = async () => {
        return await this.authorizer.Authorize() && await this.songInfoSearcher.Initialize();
    };

    LoadSongs = async () => {
        try {
            const sheet = await this.loadSpreadsheet();
            this.songs = await this.getSongsFromRows(sheet);
            return true;
        } catch (err) {
            global.logger.err(err);
            return false;
        }
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

    getSongsFromRows = async (rows) => {
        const UNPROCESSED_SONG_ROW_LENGTH = 3;
        const songs = [];
        for (let rowNumber = 1; rowNumber <= rows.length; rowNumber++) {
            const row = rows[rowNumber - 1];
            if (row.length !== UNPROCESSED_SONG_ROW_LENGTH) {
                continue;
            }
            const song = await this.getSongFromRow(row);
            this.youtubeIdToRowNumber[song.youtubeVideoId] = rowNumber;
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

        const { album, trackNumber, yearReleased, albumTotalTracks, albumArtworkUrl } = songInfo;
        const trackInfo = `${trackNumber}/${albumTotalTracks}`;
        return new Song(title, artist, youtubeId, album, trackInfo, yearReleased, null, albumArtworkUrl);
    };

    GetSongs = () => {
        return this.songs;
    };

    MarkAllAsProcessed = async (songs) => {
        const sheets = google.sheets({ version: GOOGLE_SHEETS_API_VERSION, auth: this.authorizer.Get() });
        const data = songs.map((song) => this.getDataToMarkSongAsComplete(song));
        const request = {
            data: data.filter((data) => data != null),
            valueInputOption: "RAW"
        };

        await sheets.spreadsheets.values.batchUpdate({
            auth: this.authorizer.Get(),
            spreadsheetId: this.sheetId,
            requestBody: request
        });
    };

    getDataToMarkSongAsComplete = (song) => {
        const DATE_PROCESSED_COLUMN = "D";
        const rowNumber = this.youtubeIdToRowNumber[song.youtubeVideoId];
        return rowNumber == null ? null : {
            range: `${DATE_PROCESSED_COLUMN}${rowNumber}`,
            values: [ [ new Date() ] ]
        };
    };
}

module.exports = GoogleSheetSongSource;
