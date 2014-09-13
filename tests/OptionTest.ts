/// <reference path="../libs/chai.d.ts" />
/// <reference path="../src/option.ts" />
/// <reference path="../libs/mocha.d.ts" />

var expect = chai.expect;
var assert = chai.assert;

describe("Option", () => {
    it("When mergeWithDefaultOption with empty option Then url is current url without hash", () => {
        window.location.href += '#hello';

        var result = mergeWithDefaultOption({});

        expect(result.url).to.equals(getCurrentUrlWithoutHash());
    });

    it("When mergeWithDefaultOption with url Then url is not override", () => {
        var url = 'http://example.com';

        var result = mergeWithDefaultOption({ url: url});

        expect(result.url).to.equals(url);
    });

    it("When mergeWithDefaultOption with empty option Then use default option", () => {
        var result = mergeWithDefaultOption({});

        expect(result.data).to.eqls({});
        expect(result.files).to.eqls([]);
        expect(result.desiredResponseDataType).to.eqls(DataType.Json);
        expect(result.method).to.eqls('POST');
        expect(result.timeoutInSeconds).to.eqls(60);
    });

    it("When mergeWithDefaultOption Then use parameter in user option, then in default option", () => {
        defaultOption.timeoutInSeconds = 6;

        var result = mergeWithDefaultOption({ desiredResponseDataType: DataType.Xml });

        expect(result.timeoutInSeconds).to.eqls(6);
        expect(result.desiredResponseDataType).to.eqls(DataType.Xml);
    });
}); 