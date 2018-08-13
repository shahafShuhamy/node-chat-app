var expect = require('expect');
var {generateMessage,generateLocationMessage} = require('./message');

describe('generate message', () =>{
    it('should generate correct message object', () =>{
        var result = generateMessage('jen','hello');
        expect(result.from).toExist();
        expect(result.text).toExist();
    });
});

describe('generate location message', () =>{

    it('should generate location message', () =>{
        var result = generateLocationMessage('shahaf',1,1);
        expect(result.from).toBe('shahaf');
        expect(result.url).toContain("1,1");
    });
});