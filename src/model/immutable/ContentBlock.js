// @flow
'use strict';

import type {InlineStyle} from 'InlineStyle'
const CharMeta = require('CharMeta')
const {Record, List, OrderedSet} = require('immutable')

const EMPTY_SET = OrderedSet()

export type ContentBlockConfig = {
  key: string,
  type: string, //BlockType
  text: string,
  charMetas: List<CharMeta>
}

const defaultConfig: ContentBlockConfig = {
  key: '',
  type: 'unstyled',
  text: '',
  charMetas: List(new CharMeta())
}

const ContentBlockRecord = (Record(defaultConfig):any)

class ContentBlock extends ContentBlockRecord {
  getLength(): number {
    return this.getText().length
  }
  
  getStyleAt(offset: numeber): InlineStyle {
    const charMeta:CharMeta = this.getCharMetas().get(offset)
    return charMeta ? charMeta.getStyle() : EMPTY_SET
  }
  
  getKey(): string {
    return this.get('key')
  }

  getType(): string {
    return this.get('type')
  }
  
  getText(): string {
    return this.get('text')
  }

  getCharMetas(): List<CharMeta> {
    return this.get('charMetas')
  }
}

module.exports = ContentBlock
