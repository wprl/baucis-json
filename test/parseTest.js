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

baucisJson.apply(baucisMock);

function parse(obj, cb) {
  var response = [];
  var parser = baucisMock.parser();

  parser.on('data', function(chunk) {
    if (chunk) {
      return response.push(chunk);
    }
  });
  parser.on('error', function(err) {
    return cb(err, null);
  });
  parser.on('end', function(chunk) {
    if (chunk) {
      response.push(chunk);
    }
    return cb(null, response);
  });

  parser.write(obj);
  parser.end();
}


describe('parse test', function () {
  it('parse object', function (done) {
    var sample = '{"a":"name","b":7.1,"c":true,"d":null,"e":{"name":"spook"},"f":false}';
    parse(sample, function(err, objArray) {
      expect(err).to.be(null);
      expect(objArray[0]).to.have.property('a', 'name');
      expect(objArray[0]).to.have.property('b', 7.1);
      expect(objArray[0]).to.have.property('c', true);
      expect(objArray[0]).to.have.property('d', null);
      expect(objArray[0]).to.have.property('e');
      expect(objArray[0].e).to.have.property('name', 'spook');
      expect(objArray[0]).to.have.property('f', false);

      done();
    });
  });
});
