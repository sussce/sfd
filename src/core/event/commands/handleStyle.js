// @flow

const richUtil = require('richUtil')
const EditorState = require('EditorState')

function handleStyle(
  editorState: EditorState,
  style: string
): EditorState {
  const selection = editorState.getSelection()
  if (selection.getCollapsed()) return;
  
  return richUtil.applyStyle(
    editorState,
    selection,
    style.toUpperCase()
  )
}

module.exports = handleStyle
