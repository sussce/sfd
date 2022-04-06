// @flow
'use strict';

const modifier = require('modifier')

const EditorState = require('EditorState')

function splitBlock(editorState: EditorState): EditorState {
  console.log('cmd:split-block')
  
  const content = editorState.getContent()

  modifier.splitBlock(content)

  return EditorState.push(
    editorState,
    content,
    true,
    'split-block'
  )
}

module.exports = splitBlock
