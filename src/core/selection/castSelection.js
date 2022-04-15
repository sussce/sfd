// @flow
'use strict';

const EditorState = require('EditorState')
const SelectionState = require('SelectionState')

function castSelection(
  editorState: EditorState,
  anchorKeys: ?{[key: string]: string},
  anchorOffset: number,
  focusKeys: ?{[key: string]: string},
  focusOffset: number
): SelectionState {
  const selection = editorState.getSelection()

  if(!anchorKeys || !focusKeys) {
    return selection
  }
  
  const anchorTree = editorState.getTree(anchorKeys.blockKey)

  const anchorLeaf = anchorTree.getIn([
          anchorKeys.decoratorKey,
          'leaves',
          anchorKeys.leafKey
        ])

  const focusTree = editorState.getTree(focusKeys.blockKey),
        focusLeaf = focusTree.getIn([
          focusKeys.decoratorKey,
          'leaves',
          focusKeys.leafKey
        ])

  if(!anchorLeaf || !focusLeaf) {
    return selection
  }

  const anchorLeafStart = anchorLeaf.get('start'),
        anchorLeafEnd = anchorLeaf.get('end'),
        anchorBlockOffset = anchorLeafStart + anchorOffset,
        focusLeafStart = focusLeaf.get('start'),
        focusLeafEnd = focusLeaf.get('end'),
        focusBlockOffset = focusLeafStart + focusOffset
  
  const areEqual = selection.getAnchorKey() === anchorKeys.blockKey &&
        selection.getAnchorOffset() === anchorBlockOffset &&
        selection.getFocusKey() === focusKeys.blockKey &&
        selection.getFocusOffset() === focusBlockOffset
  
  if(areEqual) {
    return selection
  }

  const collapsed = anchorKeys.blockKey === focusKeys.blockKey &&
      anchorBlockOffset === focusBlockOffset
      
  let backward = false

  if(anchorKeys.blockKey === focusKeys.blockKey) {
    backward = anchorLeafStart === focusLeafStart
      && anchorLeafEnd === focusLeafEnd
      ? anchorOffset > focusOffset
      : anchorLeafStart > focusLeafStart
  } else {
    const startKey = editorState
          .getContent()
          .getBlockMap()
          .keySeq()
          .skipUntil(key => key === anchorKeys.blockKey ||
                     key === focusKeys.blockKey)
          .first()
    backward = startKey === focusKeys.blockKey
  }
  
  return selection.merge({
    anchorKey: anchorKeys.blockKey,
    anchorOffset: anchorBlockOffset,
    focusKey: focusKeys.blockKey,
    focusOffset: focusBlockOffset,
    collapsed,
    backward
  })
}

module.exports = castSelection
