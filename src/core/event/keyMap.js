// @flow
'use strict';

const keys = require('keys')

function keyMap(e: KeyboardEvent): /* KeyCommand */ ?string {
  const { keyCode, ctrlKey } = e
  
  switch(keyCode) {
  case keys.BACKSPACE:
    return 'backspace';
  case keys.B:
    return ctrlKey ? 'backspace' : null 
  default:
    return null
  }
}

module.exports = keyMap
