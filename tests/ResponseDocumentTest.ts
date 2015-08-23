describe('ResponseDocument', () => {
    const expect = chai.expect;

    it('When extractStatus of container Then return value of statusCode and statusText attributes', () => {
        const container = $('<textarea statusCode="500" statusText="Bad"></textarea>');

        const result = extractStatus(container);

        expect(result.code).to.equals(500);
        expect(result.text).to.equals('Bad');
    });

    it('When extractStatus of container without attributs Then return status 200', () => {
        const container = $('<textarea></textarea>');

        const result = extractStatus(container);

        expect(result.code).to.equals(200);
        expect(result.text).to.equals('OK');
    });

    it('When extractStatus of container with status 2XX Then return success', () => {
        const container = $('<textarea statusCode="250"></textarea>');

        const result = extractStatus(container);

        expect(result.isSuccess).to.equals(true);
    });

    it('When extractStatus of container with status 1XX Then return not success', () => {
        const container = $('<textarea statusCode="199"></textarea>');

        const result = extractStatus(container);

        expect(result.isSuccess).to.equals(false);
    });

    it('When extractStatus of container with status 300 Then return not success', () => {
        const container = $('<textarea statusCode="300"></textarea>');

        const result = extractStatus(container);

        expect(result.isSuccess).to.equals(false);
    });

    it('When extractStatus of container with status 304 Then return success', () => {
        const container = $('<textarea statusCode="304"></textarea>');

        const result = extractStatus(container);

        expect(result.isSuccess).to.equals(true);
    });

    it('When parse text Then return directly string', () => {
        const value = '{ "name": "joe" }';

        const result = parse(value, DataType.Text);

        expect(result).to.equals(value);
    });

    it('When parse json Then return deserialize to json', () => {
        const value = '{ "name": "joe" }';

        const result = parse(value, DataType.Json);

        expect(result).to.eqls({ name: 'joe' });
    });

    it('When parse json with invalid data Then throw exception', () => {
        const value = 'Bad value';

        expect(() => parse(value, DataType.Json)).to.throws();
    });

    it('When parse xml Then deserialize to xml', () => {
        const value = '<name>Joe</name>';

        const result = parse(value, DataType.Xml);

        const xmlText = new XMLSerializer().serializeToString(result);
        expect(xmlText).to.equals(value);
    });

    it('When parse xml with bad data Then throw exception', () => {
        const value = 'Joe';

        expect(() => parse(value, DataType.Xml)).to.throws();
    });
});
