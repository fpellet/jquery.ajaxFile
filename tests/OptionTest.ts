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
        expect(result.dataType).to.eqls('json');
        expect(result.type).to.eqls('POST');
    });

    it("When mergeWithDefaultOption with empty option Then use jquery default option", () => {
        $.ajaxSettings.timeout = 5;

        var result = mergeWithDefaultOption({});

        expect(result.global).to.eqls(true);
        expect(result.timeout).to.eqls(5);
    });

    it("When mergeWithDefaultOption Then use default parameter in user option, then in default option, then in jquery option", () => {
        $.ajaxSettings.timeout = 5;
        defaultOption.timeout = 6;

        var result = mergeWithDefaultOption({ dataType: 'xml' });

        expect(result.timeout).to.eqls(6);
        expect(result.dataType).to.eqls('xml');
    });
}); 