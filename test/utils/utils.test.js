const { describe, it } = require("mocha");
const { expect } = require("chai");

const utils = require("../../src/utils/utils");

describe(utils.getQueryParamsString.name, () => {
    const { getQueryParamsString } = utils;
    it("should return empty string if no query params", () => {
        // arrange
        const URL = "http://www.example.com";

        // act
        const queryParams = getQueryParamsString(URL);

        // assert
        expect(queryParams).to.be.a("string").with.length(0);
    });

    it("should return query params as string in a URL", () => {
        // arrange
        const QUERY_PARAMS = "id=3&v=u";
        const URL = `http://www.example.com?${QUERY_PARAMS}`;

        // act
        const queryParams = getQueryParamsString(URL);

        // assert
        expect(queryParams).to.equal(QUERY_PARAMS);
    });
});

describe(utils.stringToMap.name, () => {
    const { stringToMap } = utils;
    it("should convert an empty string to an empty object", () => {
        // arrange
        const string = "";

        // act
        const map = stringToMap(string, ",", ":");

        // assert
        expect(map).to.be.an("object").that.is.empty;
    });

    it("should convert a query string to a map with the right fields and values", () => {
        // arrange
        const KEY_1 = "key1";
        const KEY_2 = "key2";
        const VAL_1 = "val1";
        const VAL_2 = "val2";
        const PAIR_DELIM = "&";
        const KEY_VAL_DELIM = "=";
        const string = `${KEY_1}${KEY_VAL_DELIM}${VAL_1}${PAIR_DELIM}${KEY_2}${KEY_VAL_DELIM}${VAL_2}`;

        // act
        const map = stringToMap(string, PAIR_DELIM, KEY_VAL_DELIM);

        // assert
        expect(map).to.deep.equal({ [KEY_1]: VAL_1, [KEY_2]: VAL_2 });
    });
});