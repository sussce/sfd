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

    // noEntity = removeEntity()
    const noEntity = content.merge({
      selectionAfter: selection
    })
    
    const noRange = removeRange(noEntity, selection)
    
    return insertChars(
      noRange,
      noRange.getSelectionAfter(),
      chars,
      inlineStyle
    )
  },

  removeRange(
    content: ContentState,
    selection: SelectionState
  ): ContentState {
    console.log('modifier:removeRange')

    // noEntity = removeEntity
    const noEntity = content.merge({
      selectionAfter: selection
    })

    return removeRange(noEntity, selection)
  },

  splitBlock(
    content: ContentState,
    selection: SelectionState
  ): ContentState {
    console.log('modifier:splitBlock')

    // noEntity = removeEntity()
    const noEntity = content.merge({
      selectionAfter: selection
    })
    
    const noRange = removeRange(noEntity, selection)
    
    return splitBlock(noRange, noRange.getSelectionAfter())
  }
}

module.exports = modifier
