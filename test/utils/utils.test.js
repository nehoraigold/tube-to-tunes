const { existsSync } = require("fs");
const { describe, it, afterEach, beforeEach } = require("mocha");
const { expect } = require("chai");

const utils = require("../../src/utils/utils");

describe("Utils tests", () => {
    describe(utils.getQueryParamsString.name, () => {
        it("should return empty string if no query params", () => {
            // arrange
            const URL = "http://www.example.com";

            // act
            const queryParams = utils.getQueryParamsString(URL);

            // assert
            expect(queryParams).to.be.a("string").with.length(0);
        });

        it("should return query params as string in a URL", () => {
            // arrange
            const QUERY_PARAMS = "id=3&v=u";
            const URL = `http://www.example.com?${QUERY_PARAMS}`;

            // act
            const queryParams = utils.getQueryParamsString(URL);

            // assert
            expect(queryParams).to.equal(QUERY_PARAMS);
        });
    });

    describe(utils.stringToMap.name, () => {
        it("should convert an empty string to an empty object", () => {
            // arrange
            const string = "";

            // act
            const map = utils.stringToMap(string, ",", ":");

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
            const map = utils.stringToMap(string, PAIR_DELIM, KEY_VAL_DELIM);

            // assert
            expect(map).to.deep.equal({ [KEY_1]: VAL_1, [KEY_2]: VAL_2 });
        });
    });

    describe(utils.capitalize.name, () => {
        it("string without lowercase first letter should return the same string", () => {
            // arrange
            const strings = ["", "Uppercase", "1abc"];

            strings.forEach((string) => {
                // act
                const capitalized = utils.capitalize(string);

                // assert
                expect(capitalized).to.equal(string);
            });
        });

        it("string with lowercase first character should return with uppercase first character", () => {
            // arrange
            const lowercase = "lowercase";

            // act
            const capitalized = utils.capitalize(lowercase);

            // assert
            expect(capitalized).to.equal(lowercase.charAt(0).toUpperCase() + lowercase.slice(1))
        });
    });

    describe(utils.getYearFromDate.name, () => {
        it("should return the year from string with yyyy_mm_dd format", () => {
            // arrange
            const year = "2001";
            const yyyy_mm_dd = `${year}-12-12`;

            // act
            const receivedYear = utils.getYearFromDate(yyyy_mm_dd);

            // assert
            expect(receivedYear).to.equal(year);
        });

        it("should return an empty string if not in that format", () => {
            // arrange
            const strings = ["", "12-12-2001", "20011212", "abc123"];

            strings.forEach((string) => {
                // act
                const year = utils.getYearFromDate(string);

                // assert
                expect(year).to.be.a("string").with.length(0);
            });
        });
    });

    describe(utils.splitCamelCase.name, () => {
        it("should return an empty string if given an empty string", () => {
            // arrange
            const string = "";

            // act
            const split = utils.splitCamelCase(string);

            // assert
            expect(split).to.be.a("string").with.length(0);
        });

        it("should return a single lowercase word when all lowercase", () => {
            // arrange
            const word = "word";

            // act
            const split = utils.splitCamelCase(word);

            // assert
            expect(split).to.equal(word);
        });

        it("should return separated words with same casing for camelCase input", () => {
            // arrange
            const camelCase = "camelCase";

            // act
            const split = utils.splitCamelCase(camelCase);

            // assert
            expect(split).to.equal("camel Case");
        });
    });

    const TMP_DIR_PATH = "/tmp/tmp_dir";

    describe(utils.createDirIfNeeded.name, () => {
        afterEach(() => {
            utils.removeDirIfNeeded(TMP_DIR_PATH);
        });

        it("should create a directory if it does not exist", () => {
            // arrange
            expect(existsSync(TMP_DIR_PATH)).to.be.false;

            // act
            utils.createDirIfNeeded(TMP_DIR_PATH);

            // assert
            expect(existsSync(TMP_DIR_PATH)).to.be.true;
        });
    });

    describe(utils.removeDirIfNeeded.name, () => {
        beforeEach(() => {
            utils.createDirIfNeeded(TMP_DIR_PATH);
        });

        it("should remove a directory if it exists", () => {
            // arrange
            expect(existsSync(TMP_DIR_PATH)).to.be.true;

            // act
            utils.removeDirIfNeeded(TMP_DIR_PATH);

            // assert
            expect(existsSync(TMP_DIR_PATH)).to.be.false;
        });
    });
});