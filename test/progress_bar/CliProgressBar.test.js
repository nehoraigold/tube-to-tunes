const { describe, it, afterEach } = require("mocha");
const { expect } = require("chai");

const CliProgressBar = require("../../src/progress_bar/CliProgressBar");

let progressBar;

describe(CliProgressBar.prototype.constructor.name, () => {
    afterEach(() => {
        if (progressBar) {
            progressBar.Stop();
            progressBar = null;
        }
    });

    describe(CliProgressBar.prototype.AllDone.name, () => {
        it("should return false when a bar is added and not finished", () => {
            // arrange
            progressBar = new CliProgressBar();
            progressBar.AddBar("id", "");

            // act
            const isDone = progressBar.AllDone();

            // assert
            expect(isDone).to.be.false;
        });

        it("should return false when all bars that have been added are finished", () => {
            // arrange
            progressBar = new CliProgressBar();
            const barId = "id";
            progressBar.AddBar(barId, "");
            progressBar.FinishBar(barId);

            // act
            const isDone = progressBar.AllDone();

            // assert
            expect(isDone).to.be.true;
        });
    });

    describe(CliProgressBar.prototype.UpdateBar.name, () => {
        it("should not throw an error if the ID exists", () => {
            // arrange
            const barId = "id";
            progressBar = new CliProgressBar();
            progressBar.AddBar(barId, "");

            // act
            const updateBar = progressBar.UpdateBar.bind(progressBar, barId, 10);

            // assert
            expect(updateBar).to.not.throw();
        });

        it("should throw an exception if the bar ID does not exist", () => {
            // arrange
            progressBar = new CliProgressBar();

            // act
            const updateBar = progressBar.UpdateBar.bind(progressBar, "nonexistent_id", 10);

            // assert
            expect(updateBar).to.throw();
        });
    });
});