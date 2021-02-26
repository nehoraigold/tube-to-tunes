//region imports
const chalk = require("chalk");
//endregion

const log = (...message) => {
    console.log(chalk.blueBright("\n\t", ...message));
}

const err = (...message) => {
    console.log(chalk.red("\n\t", ...message));
}

module.exports = { log, err };