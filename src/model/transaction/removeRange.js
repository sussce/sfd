// Transaction
// @flow
'use strict';

const ContentState = require('ContentState')
const SelectionState = require('SelectionState')

function removeRange(
  content: ContentState,
  selection: SelectionState
): ContentState {
  console.log('trans:removeRange')

  if(selection.getCollapsed()) {
    return content
  }
  
  let startKey = selection.getStartKey(),
      startOffset = selection.getStartOffset(),
      endKey = selection.getEndKey(),
      endOffset = selection.getEndOffset()

  const blockMap = content.getBlockMap(),
        startBlock = blockMap.get(startKey),
        endBlock = blockMap.get(endKey)

  const charMetas = startBlock.getCharMetas().slice(0, startOffset)
        .concat(endBlock.getCharMetas().slice(endOffset))
  
  const newStart =startBlock.merge({
    text: startBlock.getText().slice(0, startOffset) +
      endBlock.getText().slice(endOffset),
    charMetas
  })
  
  const newBlocks = blockMap
        .skipUntil((_, key) => key === startKey)
        .takeUntil((_, key) => key === endKey)
        .concat([[endKey, null]])
        // .filter()
        .map((_, key) => key === startKey ? newStart : null)

  const newBlockMap = blockMap
        .merge(newBlocks)
        .filter(block => !!block).toOrderedMap()

  const newSelection = selection.merge({
    anchorKey: startKey,
    anchorOffset: startOffset,
    focusKey: startKey,
    focusOffset: startOffset,
    collapsed: true,
    backward: false
  })
 
  return content.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: newSelection
  })
}

module.exports = removeRange
