// @flow
'use strict';

function backspaceWord(
  editorState: EditorState
): EditorState {
  console.log('cmd:backspaceword')
  return editorState
}

module.exports = backspaceWord
