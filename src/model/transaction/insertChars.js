// @flow
'use strict';

import type {InlineStyle} from 'InlineStyle'
const insertToList = require('insertToList')
const ContentState = require('ContentState')
const SelectionState = require('SelectionState')
const CharMeta = require('CharMeta')
const {Repeat} = require('immutable')

function insertChars(
  content: ContentState,
  selection: SelectionState,
  chars: string,
  inlineStyle: InlineStyle
): ContentState {
  console.log('trans:insertChars')
  
  const startKey = selection.getAnchorKey(),
        startOffset = selection.getAnchorOffset(),
        block = content.getBlockForKey(startKey),
        text = block.getText()

  const charMeta = CharMeta.create({
    style: inlineStyle || OrderedSet()
    // entityKey
  })
  
  const newBlock = block.merge({
    text: text.slice(0, startOffset)
      + chars
      + text.slice(startOffset, text.length),
    charMetas: insertToList(
      block.getCharMetas(),
      Repeat(charMeta, chars.length).toList(),
      startOffset
    )
  })
  
  const newOffset = startOffset + chars.length
  
  return content.merge({
    blockMap: content.getBlockMap().set(startKey, newBlock),
    selectionAfter: selection.merge({
      anchorOffset: newOffset,
      focusOffset: newOffset
    })
    // entityMap
  })
}

module.exports = insertChars
