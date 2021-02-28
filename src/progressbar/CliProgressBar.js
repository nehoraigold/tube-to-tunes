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
        this.totalDownloads++;
        this.currentDownloadBars[id] = this.bar.create(100, 0, { displayText });
    };

    UpdateBar = (id, percentage) => {
        this.currentDownloadBars[id].update(percentage);
    };

    FinishBar = (id) => {
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