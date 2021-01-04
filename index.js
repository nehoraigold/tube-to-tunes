//region imports
const Mp3Downloader = require('./services/Mp3Downloader');
const Authorizer = require("./services/Authorizer");
const SpreadsheetCommunicator = require('./services/SpreadsheetCommunicator');
//endregion

function main() {
    const downloader = new Mp3Downloader();
    const authorizer = new Authorizer();
    const spreadsheetCommunicator = new SpreadsheetCommunicator(authorizer);

    downloader.setCompletionCallback(spreadsheetCommunicator.markAllAsProcessed);

    const intervalId = setInterval(() => {
        if (spreadsheetCommunicator.isReady) {
            spreadsheetCommunicator.songs.forEach(song => downloader.download(song));
            clearInterval(intervalId);
        }
    });

    const shutdown = () => {
        console.log("\nProgram has terminated.");
        process.exit(1);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGABRT", shutdown);
    process.on("SIGTERM", shutdown);
}

main();