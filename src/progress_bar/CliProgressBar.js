//region imports
const cliProgress = require("cli-progress");
const IProgressBar = require("./IProgressBar");
//endregion

class CliProgressBar extends IProgressBar {
    constructor() {
        super();
        this.currentDownloadBars = {};
        this.totalDownloads = 0;
        this.finishCount = 0;
        this.bar = new cliProgress.MultiBar({
            clearOnComplete: false,
            hideCursor: true,
            format: " {bar} || {percentage}% || {displayText}"
        }, cliProgress.Presets.shades_grey);
    }

    AddBar = (id, displayText) => {
        const STARTING_VALUE = 0;
        const TOTAL_VALUE = 100;
        this.totalDownloads++;
        this.currentDownloadBars[id] = this.bar.create(TOTAL_VALUE, STARTING_VALUE, { displayText });
    };

    UpdateBar = (id, percentage) => {
        this.currentDownloadBars[id].update(percentage);
    };

    FinishBar = () => {
        this.finishCount++;
    };

    AllDone = () => {
        return this.totalDownloads === this.finishCount;
    };

    Stop = () => {
        this.bar.stop();
    }
}

module.exports = CliProgressBar;