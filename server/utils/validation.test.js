const expect = require('expect');
const { isRealString } = require('./validation');

describe('isRealString', () => {

    it('should reject non string values', () => {
        var text = 123;
        var result = isRealString(text);
        expect(result).toBe(false);
    });

    it('should reject string with only spaces', () => {
        var text = '  ';
        var result = isRealString(text);
        expect(result).toBe(false);
    });

    it('should allow string with non space characters', () => {
        var text = '  Test  ';
        var result = isRealString(text);
        expect(result).toBe(true);
    });

});