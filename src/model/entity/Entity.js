// @flow
'use strict';

import type {Mutability} from 'Mutability'
const {Record} = require('immutable')

type EntityType = {
  type: string,
  mutability: Mutability,
  data: Object
}

const defaultConfig: EntityType = {
  type: "TOKEN",
  mutability: "MUTABLE",
  data: {}
}

class Entity extends Record(defaultConfig) {
  getType(): string {
    return this.get('type')
  }

  getMutablity(): Mutability {
    return this.get('mutability')
  }

  getData(): Object {
    return this.get('data')
  }
}

module.exports = Entity
