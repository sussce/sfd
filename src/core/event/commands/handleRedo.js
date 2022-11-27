// @flow
'use strict';

const EditorState = require('EditorState')

function handleRedo(
  editorState: EditorState
): EditorState {
  console.log('cmd: redo')

  return EditorState.redo(editorState)
}

module.exports = handleRedo
