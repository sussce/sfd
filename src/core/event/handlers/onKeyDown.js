// @flow
'use strict';

const insertNewLine = require('insertNewLine')
const backspace = require('backspace')
const backspaceWord = require('backspaceWord')
const keyMap = require('keyMap')
const keys = require('keys')
const Editor = require('Editor')

function onKeyDown(
  _this: Editor,
  e: SyntheticKeyboardEvent<HTMLElement>
): void {
  const { keyMap } = _this.props,
        { key, keyCode } = e

  // space, return
  switch(keyCode) {
  case keys.RETURN:
    console.log('key:return')
    e.preventDefault()
    break
  case keys.SPACE:
    console.log('key:space')
    e.preventDefault()
    break;
  default:
    break;
  }

  const command = keyMap(e)
  
  if(!command) {
    return 
  }

  e.preventDefault()

  // top-level
  // const { handler } = _this.props

  const { editorState } = _this.props,
        newEditorState = handle(command, editorState)
   
  if(editorState != newEditorState) {
    _this.sync(newEditorState)
  }
}

function handle(
  command: string,
  editorState: EditorState
): EditorState {
  switch(command) {
  case 'backspace':
    return backspace(editorState)
  case 'backspaceWord':
    return backspaceWord(editorState)
  case 'split-block':
    return insertNewLine(editorState)
  default:
    return editorState
  }
}

module.exports = onKeyDown
