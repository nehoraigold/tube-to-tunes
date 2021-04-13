//region imports
const ora = require("ora");
const chalk = require("chalk");
const { textSync } = require("figlet");
const logger = require("./utils/logging");
const DownloaderFactory = require("./downloader/DownloaderFactory");
const SongSourceFactory = require("./songsource/SongSourceFactory");
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
    global.spinner = ora("Initializing... 🤔").start();
    const songSource = SongSourceFactory.Create(config);
    const downloader = DownloaderFactory.Create(config);

    if (!songSource || !(await songSource.Initialize())) {
        global.spinner.fail("Failed to initialize song loader! 😞");
        return null;
    }
    if (!downloader || !(await downloader.Initialize())) {
        global.spinner.fail("Failed to initialize downloader! 😞");
        return null;
    }
    global.spinner.succeed("Initialized successfully! 😄");
    return { songSource, downloader };
}

async function retrieveSongs(songSource) {
    global.spinner = ora("Loading songs... 🥁").start();
    if (!(await songSource.LoadSongs())) {
        global.spinner.fail("Failed to load songs! 🎻");
        return false;
    }

    const songs = songSource.GetSongs();
    if (songs.length === 0) {
        global.spinner.succeed("No songs need downloading! 🎹");
        return false;
    }

    global.spinner.succeed(`Successfully loaded ${songs.length} song${songs.length === 1 ? "" : "s"}! 🎹`);
    return songs;
}

function downloadSongs(songSource, downloader, songs) {
    downloader.SetCompletionCallback(async () => {
        try {
            await songSource.MarkAllAsProcessed(songs);
            global.spinner.succeed("Download complete! 🎉🎉");
        } catch (e) {
            global.spinner.fail("Failed to mark songs as processed! 😞");
            logger.err(e);
        }
    });

    global.spinner = ora("Starting download... ⬇️").succeed();
    songs.forEach((song) => downloader.Download(song));
}

function establishShutdownProcedure() {
    const shutdown = () => {
        const message = "Program has terminated. 😳";
        if (global.spinner) {
            global.spinner.stopAndPersist();
            global.spinner.fail(message);
        } else {
            logger.err(message);
        }
        global.process.exit(1);
    };

    global.process.on("SIGINT", shutdown);
    global.process.on("SIGABRT", shutdown);
    global.process.on("SIGTERM", shutdown);
}

main();
