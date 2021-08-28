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
        this.bindFunctions();
    }

    AddBar(id, displayText) {
        const STARTING_VALUE = 0;
        const TOTAL_VALUE = 100;
        this.totalDownloads++;
        const newBar = this.bar.create(TOTAL_VALUE, STARTING_VALUE, { displayText });
        this.currentDownloadBars[id] = newBar ? newBar : this.createNonTtyBar();
    }

    UpdateBar(id, percentage) {
        if (!this.currentDownloadBars[id]) {
            throw new Error(`No progress bar with id ${id}!`);
        }
        this.currentDownloadBars[id].update(percentage);
    }

    FinishBar() {
        this.finishCount++;
    }

    AllDone() {
        return this.totalDownloads === this.finishCount;
    }

    Stop() {
        this.bar.stop();
    }

    bindFunctions() {
        this.AddBar = this.AddBar.bind(this);
        this.UpdateBar = this.UpdateBar.bind(this);
        this.FinishBar = this.FinishBar.bind(this);
        this.AllDone = this.AllDone.bind(this);
        this.Stop = this.Stop.bind(this);
    }

    createNonTtyBar() {
        return {
            percentage: 0,
            update(percentage) {
                this.percentage = percentage;
            }
        };
    }
}

module.exports = CliProgressBar;
