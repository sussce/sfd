// @flow
'use strict';

function backspaceWord(
  editorState: EditorState
): EditorState {
  console.log('cmd:backspaceWord')
  return editorState
}

module.exports = backspaceWord
