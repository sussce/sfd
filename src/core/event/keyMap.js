// @flow
'use strict';

import type {KeyCommand} from 'KeyCommand'
const keys = require('keys')

function zCommand(e: KeyboardEvent): KeyCommand {
  return e.shiftKey ? 'redo' : 'undo'
}

function ifMod(e: KeyboardEvent): boolean {
  return !!e.ctrlKey && !e.altKey
}

function keyMap(e: KeyboardEvent): ?KeyCommand {
  const { keyCode } = e
  
  switch(keyCode) {
  case keys.RETURN:
    return 'split-block';
  case keys.BACKSPACE:
    return ifMod(e) ? 'backspaceWord' : 'backspace';
  case keys.DELETE:
    return ifMod(e) ? 'deleteWord' : 'delete';
  case keys.Z:
    return ifMod(e) ? zCommand(e) : null;
  case keys.B:
    return ifMod(e) ? 'bold' : null;
  case keys.I:
    return ifMod(e) ? 'italic' : null;
  case keys.X:
    return ifMod(e) ? 'monospace' : null;
  case keys.U:
    return ifMod(e) ? 'underline' : null;
  case keys.X:
    return ifMod(e) ? 'linethrough' : null;
  default:
    return null
  }
}

module.exports = keyMap
