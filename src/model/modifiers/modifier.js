// Modifier
// @flow
'use strict';

import type {InlineStyle} from 'InlineStyle'

const applyStyle = require('applyStyle')
const applyEntity = require('applyEntity')
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
  applyStyle(
    content: ContentState,
    selection: SelectionState,
    style: string
  ): ContentState {
    console.log('modifier:applyStyle')
    
    return applyStyle(content, selection, style)
  },
  
  applyEntity(
    content: ContentState,
    selection: SelectionState,
    entityKey: string
  ): ContentState {
    console.log('modifier:applyEntity')

    //const withoutEntity = removeEntity(content, selection)
    const withoutEntity = content
    return applyEntity(withoutEntity, selection, entityKey)
  },
  
  replaceChars(
    content: ContentState,
    selection: SelectionState,
    chars: string,
    inlineStyle: InlineStyle
  ): ContentState {
    console.log('modifier:replaceChars')

    // withoutEntity = removeEntity()
    const withoutEntity = content.merge({
      selectionAfter: selection
    })
    
    const withoutRange = removeRange(withoutEntity, selection)
    
    return insertChars(
      withoutRange,
      withoutRange.getSelectionAfter(),
      chars,
      inlineStyle
    )
  },

  removeRange(
    content: ContentState,
    selection: SelectionState
  ): ContentState {
    console.log('modifier:removeRange')

    // withoutEntity = removeEntity
    const withoutEntity = content.merge({
      selectionAfter: selection
    })

    return removeRange(withoutEntity, selection)
  },

  splitBlock(
    content: ContentState,
    selection: SelectionState
  ): ContentState {
    console.log('modifier:splitBlock')

    // withoutEntity = removeEntity()
    const withoutEntity = content.merge({
      selectionAfter: selection
    })
    
    const withoutRange = removeRange(withoutEntity, selection)
    
    return splitBlock(withoutRange, withoutRange.getSelectionAfter())
  }
}

module.exports = modifier
