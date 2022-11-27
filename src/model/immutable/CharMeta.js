// @flow
'use strict';

import type {InlineStyle} from 'InlineStyle'
const {Record, Map, OrderedSet} = require('immutable')

type CharMetaValueType = InineStyle | ?string
type CharMetaConfig = {
  style?: CharMetaValueType,
  entity?: CharMetaValueType
}

const EMPTYSET = OrderedSet()
const defaultConfig: CharMetaConfig = {
  style: EMPTYSET,
  entity: null
}

const CharMetaRecord = (Record(defaultConfig):any)

class CharMeta extends CharMetaRecord {
  static EMPTY: CharMeta

  static create(config: CharMetaConfig): CharMeta {
    if(!config) {
      return EMPTY
    }
    
    const map = Map(defaultConfig).merge(config),
          copy = pool.get(map)
    
    if(copy) {
      return copy
    }

    const charMeta = new CharMeta(config)
    pool = pool.set(map, charMeta)
    return charMeta
  }

  static applyEntity(
    charMeta: CharMeta,
    entityKey: string
  ): CharMeta {
    charMeta = charMeta.getEntity() == entityKey
      ? charMeta
      : charMeta.set('entity', entityKey)

    return CharMeta.create(charMeta)
  }

  static applyStyle(
    charMeta: CharMeta,
    style: string
  ): CharMeta {
    const styleSet = charMeta.getStyle()
    charMeta = styleSet.includes(style)
      ? charMeta
      : charMeta.set('style', styleSet.add(style))
    return CharMeta.create(charMeta)
  }

  static removeStyle(
    charMeta: CharMeta,
    style: string
  ): CharMeta {
    const styleSet = charMeta.getStyle()
    charMeta = styleSet.includes(style)
      ? charMeta.set('style', styleSet.delete(style))
      : charMeat
    return CharMeta.create(charMeta)
  }
  
  getStyle(): InlineStyle {
    return this.get('style')
  }

  getEntity(): ?string {
    return this.get('entity')
  }
}

const EMPTY = new CharMeta()
let pool: Map<Map<any, any>, CharMeta> = Map([
  [Map(defaultConfig), EMPTY]
])
CharMeta.EMPTY = EMPTY

module.exports = CharMeta
