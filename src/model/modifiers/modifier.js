// Modifier
// @flow
'use strict';

import type {InlineStyle} from 'InlineStyle'
const insertChars = require('insertChars')
const splitBlock = require('splitBlock')
const removeRange = require('removeRange')
const insertToList = require('insertToList')
const EditorState = require('EditorState')
const ContentState = require('ContentState')
const SelectionState = require('SelectionState')
const CharMeta = require('CharMeta')
const {List, Repeat} = require('immutable')

const modifier = {
  replaceChars(
    content: ContentState,
    selection: SelectionState,
    chars: string,
    inlineStyle: InlineStyle
  ): ContentState {
    console.log('modifier:replaceChars')

    // withoutEntity = removeEntity()
    content = content.merge({
      selectionAfter: selection
    })
    
    const removalRange = removeRange(content, selection)
    
    return insertChars(
      removalRange,
      removalRange.getSelectionAfter(),
      chars,
      inlineStyle
    )
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
