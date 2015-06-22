var expect = require('expect.js');
var sut = require('../index');

var baucisMock = {
	Error: { 
		BadSyntax : function () {}
	},
	setFormatter: function(mime, fn) { 
		this.formatter = fn;
	},
	setParser: function(mime, fn) { 
		this.parser = fn; 
	}
};

sut.apply(baucisMock);

function parse(obj, cb) {
	var response = [];
	var f1 = baucisMock.parser();
	
	f1.on('data', function(chunk) {
		if (chunk) {
			return response.push(chunk);
		}
	});
	f1.on('error', function(err) {
		return cb(err, null);
	});
	f1.on('end', function(chunk) {
		if (chunk) {
			response.push(chunk);		
		}
		return cb(null, response);
	});
	
	f1.write(obj);
	f1.end();
}


describe('parse test', function () {
	it('parse object', function (done) {
		var sample = '{"a":"name","b":7.1,"c":true,"d":null,"e":{"name":"spook"}}';
		parse(sample, function(err, objArray) {
			expect(err).to.be(null);
			expect(objArray[0]).to.have.property('a', 'name');
			expect(objArray[0]).to.have.property('b', 7.1);
			expect(objArray[0]).to.have.property('c', true);
			expect(objArray[0]).to.have.property('d', null);
			expect(objArray[0]).to.have.property('e');
			expect(objArray[0].e).to.have.property('name', 'spook');
			done();			
		});
	});	
});