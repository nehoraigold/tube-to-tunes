//region imports
const ora = require("ora");
const Mp3Downloader = require('./services/Mp3Downloader');
const Authorizer = require("./services/Authorizer");
const SpreadsheetCommunicator = require('./services/SpreadsheetCommunicator');
const logger = require('./utils/logging');
const config = require("./config.json");
//endregion

global.spinner = undefined;

async function main() {
    establishShutdownProcedure();
    const authorizer = new Authorizer(config);
    const spreadsheetCommunicator = new SpreadsheetCommunicator(config, authorizer);
    const downloader = new Mp3Downloader(config);

    try {
        spinner = ora("Authorizing...").start();
        await authorizer.Authorize();
        spinner.succeed("Authorized!");
    } catch (e) {
        spinner.fail("Authorization failed!");
        return logger.err(e);
    }

    try {
        spinner = ora("Loading songs...").start();
        await spreadsheetCommunicator.LoadSongs();
    } catch (e) {
        spinner.fail("Failed to load songs!");
        return logger.err(e);
    }

    const songCount = spreadsheetCommunicator.songs.length;

    if (songCount === 0) {
        spinner.succeed("No songs need downloading!");
        spinner.succeed("Program complete!");
        return;
    } else {
        spinner.succeed(`Successfully loaded ${songCount} song${songCount === 1 ? "" : "s"}!`)
    }

    spinner = ora("Starting download...").succeed();
    downloader.Initialize();
    downloader.SetCompletionCallback(async () => {
        try {
            await spreadsheetCommunicator.MarkAllAsProcessed();
            spinner.succeed("Download complete!");
        } catch (e) {
            spinner.fail("Failed to mark songs as processed!");
            logger.err(e);
        }
    });

    for (const song of spreadsheetCommunicator.songs) {
        downloader.Download(song)
    }
}

function establishShutdownProcedure() {
    const shutdown = () => {
        spinner.stopAndPersist();
        spinner.fail("Program has terminated.");
        process.exit(1);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGABRT", shutdown);
    process.on("SIGTERM", shutdown);
}

main();