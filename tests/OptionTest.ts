describe('Option', () => {
    const expect = chai.expect;

    it('When mergeWithDefaultOption with empty option Then url is current url without hash', () => {
        window.location.href += '#hello';

        const result = mergeWithDefaultOption({});

        expect(result.url).to.equals(getCurrentUrlWithoutHash());
    });

    it('When mergeWithDefaultOption with url Then url is not override', () => {
        const url = 'http://example.com';

        const result = mergeWithDefaultOption({ url: url});

        expect(result.url).to.equals(url);
    });

    it('When mergeWithDefaultOption with empty option Then use default option', () => {
        const result = mergeWithDefaultOption({});

        expect(result.data).to.eqls({});
        expect(result.files).to.eqls([]);
        expect(result.desiredResponseDataType).to.eqls(DataType.Json);
        expect(result.method).to.eqls('POST');
        expect(result.timeoutInSeconds).to.eqls(60);
    });

    it('When mergeWithDefaultOption Then use parameter in user option, then in default option', () => {
        defaultOption.timeoutInSeconds = 6;

        const result = mergeWithDefaultOption({ desiredResponseDataType: DataType.Xml });

        expect(result.timeoutInSeconds).to.eqls(6);
        expect(result.desiredResponseDataType).to.eqls(DataType.Xml);
    });
});
