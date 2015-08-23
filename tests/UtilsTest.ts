describe('Utils', () => {
    const expect = chai.expect;

    it('map array for old navigator', () => {
        const values = [5, 6, 7];

        const result = map(values, value => value + 1);

        expect(result).to.eql([6, 7, 8]);
    });
});
