/// <reference path="../libs/chai.d.ts" />
/// <reference path="../libs/mocha.d.ts" />

var expect = chai.expect;
var assert = chai.assert;

describe("ResponseDocument", () => {
    it("When extractStatus of container Then return value of statusCode and statusText attributes", () => {
        var container = $('<textarea statusCode="500" statusText="Bad"></textarea>');

        var result = extractStatus(container);

        expect(result.code).to.equals(500);
        expect(result.text).to.equals("Bad");
    });

    it("When extractStatus of container without attributs Then return status 200", () => {
        var container = $('<textarea></textarea>');

        var result = extractStatus(container);

        expect(result.code).to.equals(200);
        expect(result.text).to.equals('');
    });

    it("When extractStatus of container with status 2XX Then return success", () => {
        var container = $('<textarea statusCode="250"></textarea>');

        var result = extractStatus(container);

        expect(result.isSuccess).to.equals(true);
    });

    it("When extractStatus of container with status 1XX Then return not success", () => {
        var container = $('<textarea statusCode="199"></textarea>');

        var result = extractStatus(container);

        expect(result.isSuccess).to.equals(false);
    });

    it("When extractStatus of container with status 300 Then return not success", () => {
        var container = $('<textarea statusCode="300"></textarea>');

        var result = extractStatus(container);

        expect(result.isSuccess).to.equals(false);
    });

    it("When extractStatus of container with status 304 Then return success", () => {
        var container = $('<textarea statusCode="304"></textarea>');

        var result = extractStatus(container);

        expect(result.isSuccess).to.equals(true);
    });

    it("When parse text Then return directly string", () => {
        var value = '{ "name": "joe" }';

        var result = parse(value, DataType.Text);

        expect(result).to.equals(value);
    });

    it("When parse json Then return deserialize to json", () => {
        var value = '{ "name": "joe" }';

        var result = parse(value, DataType.Json);

        expect(result).to.eqls({ name: "joe" });
    });

    it("When parse json with invalid data Then throw exception", () => {
        var value = 'Bad value';

        expect(() => parse(value, DataType.Json)).to.throws();
    });

    it("When parse xml Then deserialize to xml", () => {
        var value = '<name>Joe</name>';

        var result = parse(value, DataType.Xml);

        var xmlText = new XMLSerializer().serializeToString(result);
        expect(xmlText).to.equals(value);
    });

    it("When parse xml with bad data Then throw exception", () => {
        var value = 'Joe';

        expect(() => parse(value, DataType.Xml)).to.throws();
    });
});  