// @flow
'use strict';

const modifier = require('modifier')
const EditorState = require('EditorState')

function insertNewLine(
  editorState: EditorState
): EditorState {
  console.log('cmd:split-block')

  const newContent = modifier.splitBlock(
    editorState.getContent(),
    editorState.getSelection()
  )

  return EditorState.push(editorState, newContent, 'split-block')
}

module.exports = insertNewLine
