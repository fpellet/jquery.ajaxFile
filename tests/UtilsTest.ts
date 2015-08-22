/// <reference path="../src/utils.ts" />
/// <reference path="../typings/tsd.d.ts" />

var expect = chai.expect;
var assert = chai.assert;

describe("Utils", () => {
    it("map array for old navigator", () => {
        var values = [5, 6, 7];

        var result = map(values, value => value + 1);

        expect(result).to.eql([6,7,8]);
    });
});