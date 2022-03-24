// @flow
'use strict';

const keyUtil = require('keyUtil')
const getOffsetKey = require('getOffsetKey')

function findOffsetKey(
  node: Node,
  root: ?HTMLElement
): ?{ [ key: string ]: string } {
  let key, paren = node

  while(paren && paren != root) {
    key = getOffsetKey(paren)
    
    if(key) {
      return keyUtil.decodin(key)
    }

    paren = paren.parentNode
  }

  return null
}

module.exports = findOffsetKey
