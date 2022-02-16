// @flow
'use strict';

import type {InlineStyle} from 'InlineStyle'
const CharMeta = require('CharMeta')
const {Record, List} = require('immutable')

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

  getStyleAt(offset: numeber): InlineStyle {
    const charMeta:CharMeta = this.getCharMetas().get(offset)
    return charMeta.getStyle()
  }
}

module.exports = ContentBlock
