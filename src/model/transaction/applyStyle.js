// @flow
'use strict';

import type {InlineStyle} from 'InlineStyle'
const ContentState = require('ContentState')
const SelectionState = require('SelectionState')

function applyStyle(
  content: ContentState,
  selection: SelectionState,
  style:InlineStyle
): ContentState {
   console.log('trans:applyStyle')

  const startKey = selection.getStartKey(),
        startOffset = selection.getStartOffset(),
        endKey = selection.getEndKey(),
        endOffset = selection.getEndOffset()

  const blockMap = content.getBlockMap()
  const newBlocks = blockMap
        .toSeq()
        .skipUntil((_, key) => key === startKey)
        .takeUntil((_, key) => key === endKey)
        .toOrderedMap()
        .merge(OrderedMap([[endKey, blockMap.get(endKey)]]))
        .map((block, key) => {
          const start = key === startKey ? startOffset : 0,
                end = key === endKey ? endOffset : block.getLength()

          return applyStyleToContentBlock(block, style, start, end)
        })
  
  return content.merge({
    blockMap: blockMap.merge(newBlocks),
    selectionBefore: selection,
    selectionAfter: selection
  })
}

module.exports = applyStyle
