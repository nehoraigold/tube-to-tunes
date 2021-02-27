const getQueryParamsString = (url) => {
    const QUERY_PARAMS_INDEX = 1;
    const QUERY_PARAMS_DELIMITER = "?";
    return url.split(QUERY_PARAMS_DELIMITER)[QUERY_PARAMS_INDEX];
}

const stringToMap = (string, pairDelimiter, keyValueDelimiter) => {
    const KEY_INDEX = 0;
    const VALUE_INDEX = 1;

    const map = {};
    const keyValuePairs = string.split(pairDelimiter);
    keyValuePairs.forEach(pair => {
        const keyVal = pair.split(keyValueDelimiter);
        map[keyVal[KEY_INDEX]] = keyVal[VALUE_INDEX];
    })
    return map;
};

module.exports = {
    getQueryParamsString,
    stringToMap
}