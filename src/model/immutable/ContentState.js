// @flow
'use strict';

import type {ContentBlockConfig} from 'ContentBlock'
const ContentBlock = require('ContentBlock')
const CharMeta = require('CharMeta')
const keyUtil = require('keyUtil')
const {Record, OrderedMap, List, Repeat} = require('immutable')
  
type ContentStateConfig = {
  blockMap: ?OrderedMap<string, ContentBlock>
}

const defaultConfig: ContentStateConfig = {
  blockMap: null
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
    // ?to-OrderedMap
    const blockMap = OrderedMap(
      blocks.map(block=>[block.key, new ContentBlock(block)])
    )
    
    return new ContentState({
      blockMap: blockMap
    })
  }

  findEntity() {

  }
  
  getBlockMap(): OrderedMap<string, ContentBlock> {
    return this.get('blockMap')
  }

  getBlockForKey(key: string): ContentBlock {
    return this.getBlockMap().get(key)
  }
}

module.exports = ContentState
