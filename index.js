//region imports
const Mp3Downloader = require('./services/Mp3Downloader');
const Authorizer = require("./services/Authorizer");
const SpreadsheetCommunicator = require('./services/SpreadsheetCommunicator');
const config = require("./config.json");
//endregion

async function main() {
    establishShutdownProcedure();
    const authorizer = new Authorizer(config);
    const spreadsheetCommunicator = new SpreadsheetCommunicator(config, authorizer);
    const downloader = new Mp3Downloader(config);

    try {
        await authorizer.Authorize();
        await spreadsheetCommunicator.LoadSongs();
        downloader.Initialize();
        downloader.SetCompletionCallback(spreadsheetCommunicator.MarkAllAsProcessed);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }

    for (const song of spreadsheetCommunicator.songs) {
        downloader.Download(song)
    }
}

function establishShutdownProcedure() {
    const shutdown = () => {
        console.log("\nProgram has terminated.");
        process.exit(1);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGABRT", shutdown);
    process.on("SIGTERM", shutdown);
}

main();