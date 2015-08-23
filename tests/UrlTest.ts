describe('Url', () => {
    const expect = chai.expect;
    const assert = chai.assert;

    const currentUrl = window.location.href;

    it('When call getCurrentUrlWithoutHash then return current url', () => {
        const result = getCurrentUrlWithoutHash();

        expect(result).to.equals(currentUrl);
    });

    it('Given current url with hash When call getCurrentUrlWithoutHash then return current url without hash', () => {
        window.location.href += '#home';

        const result = getCurrentUrlWithoutHash();

        expect(result).to.equals(currentUrl);
    });

    it('Given url on http When call urlIsHttpsMode then return false', () => {
        const result = urlIsHttpsMode('http://localhost/');

        assert.notOk(result);
    });

    it('Given url on https When call urlIsHttpsMode then return true', () => {
        const result = urlIsHttpsMode('https://localhost/');

        assert.ok(result);
    });

    it('Given url empty When call urlIsHttpsMode then return false', () => {
        const result = urlIsHttpsMode('');

        assert.notOk(result);
    });

    it('When call currentPageIsHttpsMode then return result of urlIsHttpsMode on current url', () => {
        const result = currentPageIsHttpsMode();

        assert.notOk(result);
    });

    it('When call extractParameters with object then return parameters list for form inputs', () => {
        const result = JsonToPostDataConverter.convert({
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

    it('When call extractParameters with collection then return parameters list for form inputs', () => {
        const result = JsonToPostDataConverter.convert({
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

    it('When call extractParameters with special char then return parameters list for form inputs', () => {
        const result = JsonToPostDataConverter.convert({
            value1: 'joé',
            value2: 'jo\'',
            value3: '<joe />'
        });

        expect(result).to.have.length(3);
        expect(result[0]).to.deep.include({ name: 'value1', value: 'joé' });
        expect(result[1]).to.deep.include({ name: 'value2', value: 'jo\'' });
        expect(result[2]).to.deep.include({ name: 'value3', value: '<joe />' });
    });

    it('When call extractParameters with no data then return empty parameters list', () => {
        const result = JsonToPostDataConverter.convert({});

        expect(result).to.have.length(0);
    });

    it('When call extractParameters with empty data then return empty parameters list', () => {
        const result = JsonToPostDataConverter.convert({ value: '' });

        expect(result).to.have.length(0);
    });
});
