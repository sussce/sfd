// @flow
'use strict';

import type {ContentBlockConfig} from 'ContentBlock'
const ContentBlock = require('ContentBlock')
const SelectionState = require('SelectionState')
const CharMeta = require('CharMeta')
const keyUtil = require('keyUtil')
const {Record, OrderedMap, List, Repeat} = require('immutable')

type ContentStateConfig = {
  blockMap: ?OrderedMap<string, ContentBlock>,
  selectionBefore: ?SelectionState,
  selectionAfter: ?SelectionState
  // entityMap
}

const defaultConfig: ContentStateConfig = {
  blockMap: null,
  selectionBefore: null,
  selectionAfter: null
}

const ContentStateRecord = (Record(defaultConfig):any)

class ContentState extends ContentStateRecord {
  static createWithText(
    text: string,
    delimiter: string | RegExp = /\r\n?|\n/g
  ): ContentState {
    const strings = text.split(delimiter)
    const blocks = strings.map(string => ({
      key: keyUtil.random(),
      type: 'unstyled',
      text: string,
      charMetas: List(Repeat(CharMeta.EMPTY, string.length))
    }))
    
    return ContentState.createWithArray(blocks)
  }

  static createWithArray(blocks: Array<ContentBlockConfig>): ContentState {
    const blockMap = OrderedMap(
      blocks.map(block => [block.key, new ContentBlock(block)])
    )

    const selection = blockMap.isEmpty()
          ? new SelectionState()
          : SelectionState.createEmpty(blockMap.first().getKey())
    
    return new ContentState({
      blockMap: blockMap,
      selectionBefore: selection,
      selectionAfter: selection
    })
  }

  getBlockArray(): Array<ContentBlock> {
    return this.getBlockMap().toArray()
  }
    
  getBlockMap(): OrderedMap<string, ContentBlock> {
    return this.get('blockMap')
  }

  getBlockForKey(key: string): ContentBlock {
    return this.getBlockMap().get(key)
  }

  getSelectionBefore(): SelectionState {
    return this.get('selectionBefore')
  }

  getSelectionAfter(): SelectionState {
    return this.get('selectionAfter')
  }

  findEntity() {}
}

module.exports = ContentState
