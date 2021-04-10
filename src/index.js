//region imports
const ora = require("ora");
const chalk = require("chalk");
const { textSync } = require("figlet");
const logger = require('./utils/logging');
const DownloaderFactory = require("./downloader/DownloaderFactory");
const SongSourceFactory = require('./songsource/SongSourceFactory');
const config = require("../config.json");
//endregion

global.spinner = null;
global.logger = logger;

async function main() {
    console.log(chalk.green(textSync("Tube 2 Tunes")));
    establishShutdownProcedure();

    const success = await initializeApp();
    if (!success) {
        return;
    }
    const { songSource, downloader } = success;

    const songs = await retrieveSongs(songSource);
    if (!songs) {
        return;
    }

    downloadSongs(songSource, downloader, songs);
}

async function initializeApp() {
    spinner = ora("Initializing... 🤔").start();
    const songSource = SongSourceFactory.Create(config);
    const downloader = DownloaderFactory.Create(config);

    if (!songSource || !(await songSource.Initialize())) {
        spinner.fail("Failed to initialize song loader! 😞");
        return null;
    }
    if (!downloader || !(await downloader.Initialize())) {
        spinner.fail("Failed to initialize downloader! 😞");
        return null;
    }
    spinner.succeed("Initialized successfully! 😄");
    return { songSource, downloader };
}

async function retrieveSongs(songSource) {
    spinner = ora("Loading songs... 🥁").start();
    if (!(await songSource.LoadSongs())) {
        spinner.fail("Failed to load songs! 🎻");
        return false;
    }

    const songs = songSource.GetSongs();
    if (songs.length === 0) {
        spinner.succeed("No songs need downloading! 🎹");
        return false;
    }

    spinner.succeed(`Successfully loaded ${songs.length} song${songs.length === 1 ? "" : "s"}! 🎹`);
    return songs;
}

function downloadSongs(songSource, downloader, songs) {
    downloader.SetCompletionCallback(async () => {
        try {
            await songSource.MarkAllAsProcessed(songs);
            spinner.succeed("Download complete! 🎉🎉");
        } catch (e) {
            spinner.fail("Failed to mark songs as processed! 😞");
            logger.err(e);
        }
    });

    spinner = ora("Starting download... ⬇️").succeed();
    songs.forEach(song => downloader.Download(song));
}

function establishShutdownProcedure() {
    const shutdown = () => {
        const message = "Program has terminated. 😳";
        if (spinner) {
            spinner.stopAndPersist();
            spinner.fail(message);
        } else {
            logger.err(message);
        }
        process.exit(1);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGABRT", shutdown);
    process.on("SIGTERM", shutdown);
}

main();