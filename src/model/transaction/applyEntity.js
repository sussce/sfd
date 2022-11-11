// @flow
'use strict';

const applyEntityToContentBlock = require('applyEntityToContentBlock')
const ContentState = require('ContentState')
const SelectionState = require('SelectionState')
const {OrderedMap} = require('immutable')

function applyEntity(
  content: ContentState,
  selection: SelectionState,
  entityKey: string
): ContentState {
  console.log('trans:applyEntity')

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

          return applyEntityToContentBlock(block, entityKey, start, end)
        })
  
  return content.merge({
    blockMap: blockMap.merge(newBlocks),
    selectionBefore: selection,
    selectionAfter: selection
  })
}

module.exports = applyEntity
