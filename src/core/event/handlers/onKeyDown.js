// @flow
'use strict';

const handleStyle = require('handleStyle')
const handleRedo = require('handleRedo')
const handleUndo = require('handleUndo')
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
  console.log('KEYDOWN');
  
  const { keyMap } = _this.props,
        { keyCode } = e

  // space, return
  switch(keyCode) {}

  const command = keyMap(e);
  if(!command) return;
  
  e.preventDefault()
  
  // top-level handler
  // return _this.props.handler()

  const { editorState } = _this.props

  /* special updating behavior in-sync is required,
     handle it separately. */
  if (command == 'undo')
    return handleUndo(e, editorState, _this);

  const newEditorState = handle(command, editorState)
  if(editorState != newEditorState) {
    _this.sync(newEditorState)
  }
}

function handle(
  command: string,
  editorState: EditorState
): EditorState {
  switch(command) {
  case 'split-block':
    return insertNewLine(editorState)    
  case 'redo':
    return handleRedo(editorState)
  case 'backspace':
    return backspace(editorState)
  case 'backspaceWord':
    return backspaceWord(editorState)
  case 'bold':
  case 'italic':
  case 'monospace':
  case 'underline':
  case 'linethrough':
    return handleStyle(editorState, command)
  case 'delete':
  case 'deleteWord':
  default:
    return editorState
  }
}

module.exports = onKeyDown
