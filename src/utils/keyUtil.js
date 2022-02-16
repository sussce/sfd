'use strict';

const MULTIPLIER = Math.pow(2,24)
const DELIMITER = '-'
let keys = []

const keyUtil = {
  random: function() {
    let key;
    while(!key || keys.hasOwnProperty(key) && !isNaN(key)) {
      key = Math.floor(Math.random()*MULTIPLIER).toString(32)
    }
    keys[key]=true
    return key
  },

  encodin: function(key1, key2, key3) {
    return [key1, key2, key3].join(DELIMITER)
  },

  decodin: function(key) {
    const [key1, key2, key3] = key.split(DELIMITER)
    return  key1 == key ? null : {
      blockKey: key1,
      decoratorKey: key2,
      leafKey: key3
    }
  }
}

module.exports = keyUtil
