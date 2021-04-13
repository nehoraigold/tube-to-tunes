//region imports
const chalk = require("chalk");
//endregion

const log = (...message) => {
    console.log("\n" + chalk.blue(...message));
};

const err = (...message) => {
    console.log("\n" + chalk.red(...message));
};

module.exports = { log, err };
