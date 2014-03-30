// __Dependencies__
var es = require('event-stream');

// __Private Methods__

// Default formatter — emit a single JSON object or an array of them.
function singleOrArray (alwaysArray) {
  var first = false;
  var multiple = false;

  return es.through(
    function (doc) {
      // Start building the output.  If this is the first document,
      // store it for a moment.
      if (!first) {
        first = doc;
        return;
      }
      // If this is the second document, output array opening and the two documents
      // separated by a comma.
      if (!multiple) {
        multiple = true;
        this.emit('data', '[');
        this.emit('data', JSON.stringify(first));
        this.emit('data', ',\n')
        this.emit('data', JSON.stringify(doc));
        return;
      }
      // For all documents after the second, emit a comma preceding the document.
      this.emit('data', ',\n');
      this.emit('data', JSON.stringify(doc));
    },
    function () {
      // If no documents, simply end the stream.
      if (!first) return this.emit('end');
      // If only one document emit it unwrapped, unless always returning an array.
      if (!multiple && alwaysArray) this.emit('data', '[');
      if (!multiple) this.emit('data', JSON.stringify(first));
      // For greater than one document, emit the closing array.
      else this.emit('data', ']');
      if (!multiple && alwaysArray) this.emit('data', ']');
      // Done.  End the stream.
      this.emit('end');
    }
  );
};

// Default parser.  Parses incoming JSON string into an object orobjects.
// Works whether an array or single object is sent as the request body.  It's
// very lenient with input outside of objects.
function JSONParser () {
  var depth = 0;
  var buffer = '';

  return es.through(
    function (chunk) {
    var match;
    var head;
    var brace;
    var tail;
    var remaining = chunk.toString();

    while (remaining !== '') {
      match = remaining.match(/[\}\{]/);
      // The head of the string is all characters up to the first brace, if any.
      head = match ? remaining.substr(0, match.index) : remaining;
      // The first brace in the string, if any.
      brace = match ? match[0] : '';
      // The rest of the string, following the brace.
      tail = match ? remaining.substr(match.index + 1) : '';

      if (depth === 0) {
        // The parser is outside an object.
        // Ignore the head of the string.
        // Add brace if it's an open brace.
        if (brace === '{') {
          depth += 1;
          buffer += brace;
        }
      }
      else {
        // The parser is inside an object.
        // Add the head of the string to the buffer.
        buffer += head;
        // Increase or decrease depth if a brace was found.
        if (brace === '{') depth += 1;
        else if (brace === '}') depth -= 1;
        // Add the brace to the buffer.
        buffer += brace;
        // If the object ended, emit it.
        if (depth === 0) {
          this.emit('data', JSON.parse(buffer));
          buffer = '';
        }
      }
      // Move on to the unprocessed remainder of the string.
      remaining = tail;
    }
  });
}

// Decorate the Api class.
var plugin = module.exports = function () {
  var baucis = this;
  baucis.Api.decorators(function () {
    this.setFormatter('application/json', singleOrArray);
    this.setParser('application/json', JSONParser);
  });
};
