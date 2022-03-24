// @flow
'use strict';

const EditorState = require('EditorState')
const SelectionState = require('SelectionState')

function castSelection(
  editorState: EditorState,
  anchorKeys: ?{ [ key: string ]: string },
  anchorOffset: number,
  focusKeys: ?{ [ key: string ]: string },
  focusOffset: number
): SelectionState {
  const selection = editorState.getSelection()

  if(!anchorKeys || !focusKeys) {
    return selection
  }
  
  const anchorTree = editorState.getTree(anchorKeys.blockKey),
        anchorLeaf = anchorTree.getIn([
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
        anchorBlockOffset = anchorLeafStart + anchorOffset,
        focusLeafStart = focusLeaf.get('start'),
        focusBlockOffset = focusLeafStart + focusOffset

  if(selection.get('anchorKey') == anchorKeys.blockKey &&
     selection.get('anchorOffset') == anchorBlockOffset &&
     selection.get('focusKey') == focusKeys.blockKey &&
     selection.get('focusOffset') == focusBlockOffset) {
    return selection
  }

  return selection.merge({
    anchorKey: anchorKeys.blockKey,
    anchorOffset: anchorBlockOffset,
    focusKey: focusKeys.blockKey,
    focusOffset: focusBlockOffset
  })
}

module.exports = castSelection
