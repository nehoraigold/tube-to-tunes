//region imports
const { readFileSync, existsSync } = require("fs");
const { join, dirname } = require("path");
const { CONFIGS_DIRECTORY, SECONDS_IN_MINUTE, MINUTES_IN_HOUR } = require("./constants");
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

const durationStringToSeconds = (durationString) => {
    const HOUR_INDEX = 6;
    const MINUTE_INDEX = 7;
    const SECOND_INDEX = 8;

    const durationRegex = /^(-?)P(?=\d|T\d)(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)([DW]))?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;
    const matches = durationString.match(durationRegex);

    let seconds = matches[SECOND_INDEX] ? parseInt(matches[SECOND_INDEX]) : 0;
    seconds += matches[MINUTE_INDEX] ? parseInt(matches[MINUTE_INDEX]) * SECONDS_IN_MINUTE : 0;
    seconds += matches[HOUR_INDEX] ? parseInt(matches[HOUR_INDEX]) * MINUTES_IN_HOUR * SECONDS_IN_MINUTE : 0;
    return seconds;
};

module.exports = {
    getQueryParamsString,
    stringToMap,
    getYoutubeVideoIdFromUrl,
    getAbsolutePath,
    getJsonFromFile,
    getConfig,
    durationStringToSeconds
};