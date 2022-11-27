// @flow
'use strict';

const removeStyle = require('removeStyle')
const applyStyleToBlock = require('applyStyleToBlock')
const ContentState = require('ContentState')
const SelectionState = require('SelectionState')
const {OrderedMap} = require('immutable')

function applyStyle(
  content: ContentState,
  selection: SelectionState,
  style: string
): ContentState {
  const startKey = selection.getStartKey(),
        startOffset = selection.getStartOffset(),
        endKey = selection.getEndKey(),
        endOffset = selection.getEndOffset()

  const blockMap = content.getBlockMap()
  let newBlocks = blockMap
      .toSeq()
      .skipUntil((_, key) => key === startKey)
      .takeUntil((_, key) => key === endKey)
      .toOrderedMap()
      .merge(OrderedMap([[endKey, blockMap.get(endKey)]]))

  const ifApply = newBlocks.some((block, key) => {
    const charMetas = block.getCharMetas(),
          start = key === startKey ? startOffset : 0,
          end = key === endKey ? endOffset : block.getLength()
    return charMetas
      .slice(start, end)
      .some((cm, offset) => !cm.getStyle().includes(style))
  })

  newBlocks = newBlocks.map((block, key) => {
    const start = key === startKey ? startOffset : 0,
          end = key === endKey ? endOffset : block.getLength()

    if (ifApply) 
      return applyStyleToBlock(block, style, start, end)
    else
      return removeStyle(block, style, start, end)
  })    
  
  return content.merge({
    blockMap: blockMap.merge(newBlocks),
    selectionBefore: selection,
    selectionAfter: selection
  })
}

module.exports = applyStyle
