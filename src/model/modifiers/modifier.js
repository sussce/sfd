// @flow
'use strict';

import type {InlineStyle} from 'InlineStyle'
const splitBlock = require('splitBlock')
const removeRange = require('removeRange')
const insertToList = require('insertToList')
const EditorState = require('EditorState')
const ContentState = require('ContentState')
const SelectionState = require('SelectionState')
const CharMeta = require('CharMeta')
const { List, Repeat } = require('immutable')

const modifier = {
  replaceChars(
    content: ContentState,
    selection: SelectionState,
    chars: string,
    inlineStyle: InlineStyle
  ): ContentState {
    const startKey = selection.getAnchorKey(),
          startOffset = selection.getAnchorOffset(),
          block = content.getBlockForKey(startKey),
          text = block.getText()

    if(!selection.getCollapsed()) {}

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
  },

  removeRange(
    content: ContentState
  ): ContentState {
    console.log('modifier:removeRange')
    return content
  },

  splitBlock(
    content: ContentState,
    selection: SelectionState
  ): ContentState {
    console.log('modifier:splitBlock')

    // withoutEntity = removeEntity()
    content = content.merge({
      selectionAfter: selection
    })
    
    const removal = removeRange(content, selection)
    
    return splitBlock(removal, removal.getSelectionAfter())
  }
}

module.exports = modifier
