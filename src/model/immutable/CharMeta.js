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
