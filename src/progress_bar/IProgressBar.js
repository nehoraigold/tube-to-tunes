//region imports
const { ErrorType } = require("../utils/constants");
//endregion

class IProgressBar {
    AddBar = (id, displayText) => { void(id); void(displayText); throw ErrorType.METHOD_NOT_IMPLEMENTED; };
    UpdateBar = (id, percentage) => { void(id); void(percentage); throw ErrorType.METHOD_NOT_IMPLEMENTED; };
    FinishBar = (id) => { void(id); throw ErrorType.METHOD_NOT_IMPLEMENTED; };
    AllDone = () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
    Stop = () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
}

module.exports = IProgressBar;