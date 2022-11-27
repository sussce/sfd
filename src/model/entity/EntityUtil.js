// @flow
'use strict';

import type {Mutability} from 'Mutability'
const uuid = require('uuid')
const Entity = require('Entity')
const {OrderedMap} = require('immutable')

let entities: OrderedMap<string, Entity> = OrderedMap(),
    key: number = uuid()

const EntityUtil = {
  create(
    type: string,
    mutability: Mutability,
    data?: Object
  ): string {
    return EntityUtil.add(
      new Entity({type, mutability, data})
    )
  },

  add(instance: Entity): string {
    key = uuid()
    entities = entities.set(key, instance)
    return key
  },
  
  getLastKey(): string {
    return key
  },
  
  get(key: number): ?Entity {
    return entities.get(key)
  }
}

module.exports = EntityUtil
