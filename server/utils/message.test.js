var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {

    it('should generate the correct message object', () => {
        var from = 'TestAdmin';
        var text = 'Hi There!!!';
        var result = generateMessage(from, text);

        expect(result).toInclude({
            from,
            text
        });
        expect(result.createdAt).toBeA('number');
    });

});

describe('generateLocationMessage', () => {

    it('should generate the correct location object', () => {
        var from = 'TestAdmin';
        var latitude = '123';
        var longitude = '321';
        var url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        var result = generateLocationMessage(from, latitude, longitude);

        expect(result).toInclude({
            from,
            url
        });
        expect(result.createdAt).toBeA('number');
    });

});