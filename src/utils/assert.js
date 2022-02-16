'use strict';

function assert(predicate, format, ...args) {
  let error = 'Error';
  
  if(format) {
    let i = 0;
    error = format.replace(/%s/g, function() {return args[i++]})
  }

  if(!predicate) {
    throw new Error(error)
  }
}

module.exports = assert
