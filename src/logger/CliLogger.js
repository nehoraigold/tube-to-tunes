//region imports
const chalk = require("chalk");
const ILogger = require("./ILogger");
const LogMode = require("./LogMode");
//endregion

class CliLogger extends ILogger {
    constructor(config) {
        super();
        this.mode = config.mode;
    }

    Info = (...message) => {
        console.log("\n" + chalk.white(...message));
    };

    Err = (...message) => {
        console.log("\n" + chalk.red(...message));
    };

    Debug = (...message) => {
        if (this.mode === LogMode.DEBUG)
            console.log("\n" + chalk.green(...message));
    };
}



module.exports = CliLogger;