class IProgressBar {
    AddBar = (id, displayText) => { };
    UpdateBar = (id, percentage) => { };
    FinishBar = (id) => { };
    AllDone = () => { };
    Stop = () => { };
}

module.exports = IProgressBar;