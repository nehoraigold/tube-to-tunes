//region imports
const { readFileSync, existsSync } = require("fs");
const { join, dirname } = require("path");
const { CONFIGS_DIRECTORY } = require("./constants");
//endregion

const getQueryParamsString = (url) => {
    const QUERY_PARAMS_INDEX = 1;
    const QUERY_PARAMS_DELIMITER = "?";
    return url.split(QUERY_PARAMS_DELIMITER)[QUERY_PARAMS_INDEX];
};

const stringToMap = (string, pairDelimiter, keyValueDelimiter) => {
    const KEY_INDEX = 0;
    const VALUE_INDEX = 1;

    const map = {};
    const keyValuePairs = string.split(pairDelimiter);
    keyValuePairs.forEach(pair => {
        const keyVal = pair.split(keyValueDelimiter);
        map[keyVal[KEY_INDEX]] = keyVal[VALUE_INDEX];
    });
    return map;
};

const getYoutubeVideoIdFromUrl = (url) => {
    const VIDEO_ID_KEY = "v";
    const PAIR_DELIMITER = "&";
    const KEY_VALUE_DELIMITER = "=";
    const queryParams = getQueryParamsString(url);
    const params = stringToMap(queryParams, PAIR_DELIMITER, KEY_VALUE_DELIMITER);
    return params[VIDEO_ID_KEY];
};

const getAbsolutePath = (pathFromRoot) => {
    return join(dirname(require.main.filename), "..", pathFromRoot);
};

const getJsonFromFile = (filepath) => {
    if (!existsSync(filepath)) {
        throw `No JSON file at ${filepath}!`;
    }
    const jsonFile = readFileSync(filepath);
    return JSON.parse(jsonFile.toString());
};

const getConfig = (configType) => {
    return getJsonFromFile(getAbsolutePath(`${CONFIGS_DIRECTORY}/${configType}.json`));
};

const getYearFromDate = (yyyy_mm_dd) => {
    return yyyy_mm_dd.substring(0, 4);
};

module.exports = {
    getQueryParamsString,
    stringToMap,
    getYoutubeVideoIdFromUrl,
    getAbsolutePath,
    getJsonFromFile,
    getConfig,
    getYearFromDate
};