//region imports
const chalk = require("chalk");
const prompts = require("prompts");
const ISongReviewer = require("./ISongReviewer");
const ReviewMode = require("./ReviewMode");
const { capitalize, splitCamelCase } = require("../utils/utils");
//endregion

class PromptSongReviewer extends ISongReviewer {
    constructor(config) {
        super();
        this.enableSongSkip = config.enableSongSkip;
        this.reviewFunction = this.getReviewFunction(config.reviewMode);
    }

    getReviewFunction = (reviewMode) => {
        switch (reviewMode) {
        case ReviewMode.DISPLAY:
            return this.displaySong;
        case ReviewMode.CONFIRM:
            return this.confirmSong;
        case ReviewMode.EDIT:
            return this.editSong;
        case ReviewMode.OFF:
            return null;
        default:
            throw `Unknown review mode "${reviewMode}"! Expecting one of the following: ${Object.values(ReviewMode).map((mode) => `"${mode}"`).join(", ")}`;
        }
    };

    Review = async (songs) => {
        const reviewedSongs = [];
        for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            console.log(this.getSongHeader(song, i));
            if (this.enableSongSkip && await this.shouldSkip()) {
                continue;
            }
            const reviewedSong = this.reviewFunction ? await this.reviewFunction(song) : song;
            if (reviewedSong) {
                reviewedSongs.push(reviewedSong);
            }
        }
        return reviewedSongs;
    };

    shouldSkip = async () => {
        const { shouldDownload } = await prompts({
            type: "confirm",
            message: "Download this song?",
            name: "shouldDownload",
            initial: true
        });
        return !shouldDownload;
    };

    displaySong = async (song) => {
        console.log(this.getSongDetails(song));
        return song;
    };

    confirmSong = async (song) => {
        console.log(this.getSongDetails(song));
        const { songInfoIsCorrect } = await prompts([
            {
                type: "confirm",
                message: "Are the song details correct?",
                name: "songInfoIsCorrect",
                initial: true
            }]);
        return songInfoIsCorrect ? song : await this.editSong(song);
    };

    editSong = async (song) => {
        const questions = Object.entries(song).map(([prop, value]) => {
            return {
                type: value == null || prop === "durationSeconds" ? null : "text",
                message: splitCamelCase(capitalize(prop)),
                name: prop,
                initial: value
            };
        });

        return await prompts(questions);
    };

    getSongHeader = (song, index) => {
        return chalk.bold.greenBright(`Song #${index + 1}`) +
            `: '${chalk.yellowBright(song.name)}' by ${chalk.magentaBright(song.artist)}`;
    };

    getSongDetails = (song) => {
        const properties = [];
        for (const [property, value] of Object.entries(song)) {
            if (property === "durationSeconds") {
                continue;
            }
            properties.push(`  ${chalk.cyanBright(splitCamelCase(capitalize(property)))}: ${chalk.white(value)}`);
        }
        return properties.join("\n");
    };
}

module.exports = PromptSongReviewer;
