/// <reference path="../libs/chai.d.ts" />
/// <reference path="../libs/mocha.d.ts" />
/// <reference path="../src/url.ts" />

var expect = chai.expect;
var assert = chai.assert;

describe("Url", () => {
    var currentUrl = window.location.href;

    it("When call getCurrentUrlWithoutHash then return current url", () => {
        var result = getCurrentUrlWithoutHash();

        expect(result).to.equals(currentUrl);
    });

    it("Given current url with hash When call getCurrentUrlWithoutHash then return current url without hash", () => {
        window.location.href += "#home";

        var result = getCurrentUrlWithoutHash();

        expect(result).to.equals(currentUrl);
    });

    it("Given url on http When call urlIsHttpsMode then return false", () => {
        var result = urlIsHttpsMode('http://localhost/');

        assert.notOk(result);
    });

    it("Given url on https When call urlIsHttpsMode then return true", () => {
        var result = urlIsHttpsMode('https://localhost/');

        assert.ok(result);
    });

    it("Given url empty When call urlIsHttpsMode then return false", () => {
        var result = urlIsHttpsMode('');

        assert.notOk(result);
    });

    it("When call currentPageIsHttpsMode then return result of urlIsHttpsMode on current url", () => {
        var result = currentPageIsHttpsMode();

        assert.notOk(result);
    });

    it("When call extractParameters with object then return parameters list for form inputs", () => {
        var result = JsonToPostDataConverter.convert({
            name: 'joe',
            data: {
                age: 5,
                lastname: 'bob'
            }
        });

        expect(result).to.have.length(3);
        expect(result).to.deep.include({ name: 'name', value: 'joe' });
        expect(result).to.deep.include({ name: 'data[age]', value: '5' });
        expect(result).to.deep.include({ name: 'data[lastname]', value: 'bob' });
    });

    it("When call extractParameters with collection then return parameters list for form inputs", () => {
        var result = JsonToPostDataConverter.convert({
            name: 'joe',
            list: [
                { label: 'bob', size: 5 },
                { label: 'indien' }
            ]
        });

        expect(result).to.have.length(4);
        expect(result).to.deep.include({ name: 'name', value: 'joe' });
        expect(result).to.deep.include({ name: 'list[0][label]', value: 'bob' });
        expect(result).to.deep.include({ name: 'list[0][size]', value: '5' });
        expect(result).to.deep.include({ name: 'list[1][label]', value: 'indien' });
    });

    it("When call extractParameters with special char then return parameters list for form inputs", () => {
        var result = JsonToPostDataConverter.convert({
            value1: 'joé',
            value2: 'jo"',
            value3: '<joe />',
        });

        expect(result).to.have.length(3);
        expect(result[0]).to.deep.include({ name: 'value1', value: 'joé' });
        expect(result[1]).to.deep.include({ name: 'value2', value: 'jo"' });
        expect(result[2]).to.deep.include({ name: 'value3', value: '<joe />' });
    });

    it("When call extractParameters with no data then return empty parameters list", () => {
        var result = JsonToPostDataConverter.convert({});

        expect(result).to.have.length(0); 
    });

    it("When call extractParameters with empty data then return empty parameters list", () => {
        var result = JsonToPostDataConverter.convert({ value: '' });

        expect(result).to.have.length(0);
    });
});