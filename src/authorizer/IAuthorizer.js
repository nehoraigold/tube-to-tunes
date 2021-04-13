//region imports
const { ErrorType } = require("../utils/constants");
//endregion

class IAuthorizer {
    Get = () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
    Authorize = async () => { throw ErrorType.METHOD_NOT_IMPLEMENTED; };
}

module.exports = IAuthorizer;
