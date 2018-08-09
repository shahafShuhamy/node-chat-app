var expect = require('expect');
var {generateMessage} = require('./message');

describe('generate message', () =>{
    it('should generate correct message object', () =>{
        var result = generateMessage('jen','hello');
        expect(result.from).toExist();
        expect(result.text).toExist();
    });
});