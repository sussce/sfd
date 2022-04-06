// @flow
'use strict';

import type {KeyCommand} from 'KeyCommand'
const keys = require('keys')
  
function keyMap(e: KeyboardEvent): KeyCommand {
  const { keyCode, ctrlKey } = e
  
  switch(keyCode) {
  case keys.RETURN:
    return 'split-block'
  case keys.BACKSPACE:
    return 'backspace';
  case keys.B:
    return ctrlKey ? 'backspace' : null 
  default:
    return null
  }
}

module.exports = keyMap
