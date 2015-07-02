var expect = require('expect.js');
var baucisJson = require('..');

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
  var formatter = baucisMock.formatter();

  formatter.on('data', function(chunk) {
    if (chunk) {
      response += chunk;
    }
  });
  formatter.on('end', function(chunk) {
    if (chunk) {
      response += chunk;
    }
    cb(null, response);
  });

  formatter.write(obj);
  formatter.end();
}

function formatArray(array, cb) {
  var response = '';
  var formatter = baucisMock.formatter();

  formatter.on('data', function(chunk) {
    if (chunk) {
      response += chunk;
    }
  });
  formatter.on('end', function(chunk) {
    if (chunk) {
      response += chunk;
    }
    cb(null, response);
  });

  for(var i=0; i<array.length; i++) {
    var obj = array[i];
    formatter.write(obj);
  }
  formatter.end();
}


baucisJson.apply(baucisMock);

describe('object serialization', function () {
  it('serializes an object', function (done) {
    var testObject = {a: 'name', b: 7.1, c:true, d:null, e: { name: 'spook'} };
    format(testObject, function(err, result) {
      if (err) return done(err);
      expect(result).to.be('{"a":"name","b":7.1,"c":true,"d":null,"e":{"name":"spook"}}');
      done();
    });
  });
});

describe('array serialization', function () {
  it('serializes an array of objects', function (done) {
    var testObject = {a: 'name', b: 7.1, c:true, d:null, e: { name: 'spook'} };
    var arraySample = [testObject, testObject, testObject];
    formatArray(arraySample, function(err, result) {
      if (err) return done(err);
      expect(result).to.be('[{"a":"name","b":7.1,"c":true,"d":null,"e":{"name":"spook"}},\n{"a":"name","b":7.1,"c":true,"d":null,"e":{"name":"spook"}},\n{"a":"name","b":7.1,"c":true,"d":null,"e":{"name":"spook"}}]');
      done();
    });
  });
  it('serializes an array of numbers', function (done) {
    var arraySample = [1, -2.0, 3.010];
    formatArray(arraySample, function(err, result) {
      if (err) return done(err);
      expect(result).to.be('[1,\n-2,\n3.01]');
      done();
    });
  });
});

describe('primitive values serialization', function () {
  it('serializes null', function (done) {
    var testObject = null;
    format(testObject, function(err, result) {
      if (err) return done(err);
      expect(result).to.be('{"value":null}');
      done();
    });
  });

  it('serializes a number', function (done) {
    var testObject = 3.14;
    format(testObject, function(err, result) {
      if (err) return done(err);
      expect(result).to.be('{"value":3.14}');
      done();
    });
  });

  it('serializes zero', function (done) {
    var testObject = 0;
    format(testObject, function(err, result) {
      if (err) return done(err);
      expect(result).to.be('{"value":0}');
      done();
    });
  });

  it('serializes a string', function (done) {
    var testObject = 'enterprise';
    format(testObject, function(err, result) {
      if (err) return done(err);
      expect(result).to.be('{"value":"enterprise"}');
      done();
    });
  });

  it('serializes the empty string', function (done) {
    var testObject = '';
    format(testObject, function(err, result) {
      if (err) return done(err);
      expect(result).to.be('{"value":""}');
      done();
    });
  });

  it('serializes a boolean', function (done) {
    var testObject = true;
    format(testObject, function(err, result) {
      if (err) return done(err);
      expect(result).to.be('{"value":true}');
      done();
    });
  });

  it('serializes false', function (done) {
    var testObject = false;
    format(testObject, function(err, result) {
      if (err) return done(err);
      expect(result).to.be('{"value":false}');
      done();
    });
  });

});

