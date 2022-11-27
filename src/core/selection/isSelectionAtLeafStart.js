// @flow
'use strict';

function isSelectionAtLeafStart(
  editorState: EditorState
): boolean {
  const selection = editorState.getSelection(),
        anchorKey = selection.getAnchorKey(),
        anchorOffset = selection.getAnchorOffset(),
        blockTree = editorState.getTree(anchorKey)

  let isStart: boolean = false
  blockTree.some(range => {
    if(anchorOffset === range.get('start')) {
      isStart = true
      return true
    }
  })

  return isStart
}

module.exports = isSelectionAtLeafStart
