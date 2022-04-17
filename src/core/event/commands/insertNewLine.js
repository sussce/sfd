// @flow
'use strict';

const modifier = require('modifier')
const EditorState = require('EditorState')

function insertNewLine(
  editorState: EditorState
): EditorState {
  const newContent = modifier.splitBlock(
    editorState.getContent(),
    editorState.getSelection()
  )

  return EditorState.push(editorState, newContent, 'split-block')
}

module.exports = insertNewLine
