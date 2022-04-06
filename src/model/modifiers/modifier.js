// @flow
'use strict';

import type {InlineStyle} from 'InlineStyle'

const insertToList = require('insertToList')
const EditorState = require('EditorState')
const ContentState = require('ContentState')
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

    if(!selection.collapsed()) {}

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

  insertText(
    content: ContentState,
    selection: SelectionState,
    chars: string,
  ): ContentState {
    console.log('modifier:insertTtext')
    return content
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
    return content
  }
}


module.exports = modifier
