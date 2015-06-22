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

function format(obj, cb) {
	var response = '';
	var f1 = baucisMock.formatter();
	
	f1.on('data', function(chunk) {
		if (chunk) {
			response += chunk;
		}
	});
	f1.on('end', function(chunk) {
		if (chunk) {
			response += chunk;				
		}
		cb(null, response);
	});
	
	f1.write(obj);
	f1.end();
}

function formatArray(array, cb) {
	var response = '';
	var f1 = baucisMock.formatter();
	
	f1.on('data', function(chunk) {
		if (chunk) {
			response += chunk;
		}
	});
	f1.on('end', function(chunk) {
		if (chunk) {
			response += chunk;				
		}
		cb(null, response);
	});
	
	for(var i=0; i<array.length; i++) {
		var obj = array[i];	
		f1.write(obj);
	}
	f1.end();
}


sut.apply(baucisMock);

describe('object serialization', function () {
	it('serialize object', function (done) {
		var testObject = {a: 'name', b: 7.1, c:true, d:null, e: { name: 'spook'} };
		format(testObject, function(err, result) {
			expect(err).to.be(null);
			expect(result).to.be('{"a":"name","b":7.1,"c":true,"d":null,"e":{"name":"spook"}}');
			done();
		});
	});
});

describe('array serialization', function () {		
	it('serialize array of objects', function (done) {
		var testObject = {a: 'name', b: 7.1, c:true, d:null, e: { name: 'spook'} };
		var arraySample = [testObject, testObject, testObject];
		formatArray(arraySample, function(err, result) {
			expect(err).to.be(null);
			expect(result).to.be('[{"a":"name","b":7.1,"c":true,"d":null,"e":{"name":"spook"}},\n{"a":"name","b":7.1,"c":true,"d":null,"e":{"name":"spook"}},\n{"a":"name","b":7.1,"c":true,"d":null,"e":{"name":"spook"}}]');
			done();
		});
	});
	it('serialize array of numbers', function (done) {
		var arraySample = [1, -2.0, 3.010];
		formatArray(arraySample, function(err, result) {
			expect(err).to.be(null);
			expect(result).to.be('[1,\n-2,\n3.01]');
			done();
		});
	});
});

describe('primitive values serialization', function () {
	it('serialize null', function (done) {
		var testObject = null;
		format(testObject, function(err, result) {
			expect(err).to.be(null);
			expect(result).to.be('');
			done();
		});
	});
	
	it('serialize number', function (done) {
		var testObject = 3.14;
		format(testObject, function(err, result) {
			expect(err).to.be(null);
			expect(result).to.be('3.14');
			done();
		});
	});

	it('serialize string', function (done) {
		var testObject = 'enterprise';
		format(testObject, function(err, result) {
			expect(err).to.be(null);
			expect(result).to.be('"enterprise"');
			done();
		});
	});

	it('serialize boolean', function (done) {
		var testObject = true;
		format(testObject, function(err, result) {
			expect(err).to.be(null);
			expect(result).to.be('true');
			done();
		});
	});
	
});
	
