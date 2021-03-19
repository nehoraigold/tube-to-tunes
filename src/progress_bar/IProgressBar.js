//region imports
const { ErrorType } = require("../utils/constants");
//endregion

class IProgressBar {
    AddBar = (id, displayText) => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
    UpdateBar = (id, percentage) => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
    FinishBar = (id) => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
    AllDone = () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
    Stop = () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
}

module.exports = IProgressBar;