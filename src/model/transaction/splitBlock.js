// @flow
'use strict';

const keyUtil = require('keyUtil')
const asserts = require('asserts')
const ContentBlock = require('ContentBlock')
const ContentState = require('ContentState')
const SelectionState = require('SelectionState')

function splitBlock(
  content: ContentState,
  selection: SelectionState
): ContentState {
  console.log('trans:splitBlock')

  asserts(selection.getCollapsed(), 'selection must be collapsed')

  const blockMap = content.getBlockMap(),
        key = selection.getAnchorKey()
  
  const block = blockMap.get(key),
        text = block.getText(),
        charMetas = block.getCharMetas(),
        offset = selection.getAnchorOffset()        

  if(!text) {}
  
  const blockAbove = block.merge({
    text: text.slice(0, offset),
    charMetas: charMetas.slice(0, offset)
  })

  const keyBelow = keyUtil.random(),
        blockBelow = block.merge({
          key: keyBelow,
          text: text.slice(offset),
          charMetas: charMetas.slice(offset)
        })

  const blockBefore = blockMap.toSeq().takeUntil(e => e === block),
        blockAfter = blockMap.toSeq().skipUntil(e => e === block).rest()

  const newBlockMap = blockBefore.concat(
    [
      [key, blockAbove],
      [keyBelow, blockBelow]
    ],
    blockAfter
  ).toOrderedMap()

  console.log(
    'above)', blockAbove.toJS(),
    '\nbelow)', blockBelow.toJS(),
    '\nnewBlockMap', blockMap.toJS()
  )
  
  return content.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection.merge({
      anchorKey: keyBelow,
      anchorOffset: 0,
      focusKey: keyBelow,
      focusOffset: 0,
      collapsed: true,
      backward: false
    })
  })
}

module.exports = splitBlock
