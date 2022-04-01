// @flow
'use strict';

const isElement = require('isElement')

function getOffsetKey(node: Node): ?string {
  if(isElement(node)) {
    const castNode: Element = (node: any),
          key = castNode.getAttribute('data-offset-key')
    
    if(key) {
      return key
    }

    // for(..)
  }
  
  return null
}

module.exports = getOffsetKey
