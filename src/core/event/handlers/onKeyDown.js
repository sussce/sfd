// @flow
'use strict';

// const backspace = require('backspace')
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
  case keys.SPACE:
    console.log('space')
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
    console.log('backspace')
    // return backspace(editorstate)
    return editorState
  default:
    return editorState
  }
}

module.exports = onKeyDown
