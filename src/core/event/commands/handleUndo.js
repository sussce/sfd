// @flow
'use strict';

const EditorState = require('EditorState')
const Editor = require('Editor')

function handleUndo(
  e: SyntheticKeyboardEvent<>,
  editorState: EditorState,
  _this: Editor
): void {
  console.log('cmd: undo')
  
  e.preventDefault()
  
  const undoState = EditorState.undo(editorState)
  setTimeout(() => { _this.sync(undoState) }, 0)
}

module.exports = handleUndo
