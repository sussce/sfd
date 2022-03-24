// @flow
'use strict';

function getOffsetKey(node: Node): ?string {
  if(isElement(node)) {
    const castNode: Element = (node: any),
          key = castNode.getAttribute('data-offset-key')
    
    if(key) {
      return key
    }

    // for(...)
  }
  
  return null
}

function isElement(node: ?Node): boolean {
  if (!node || !node.ownerDocument) {
    return false;
  }
  return node.nodeType === Node.ELEMENT_NODE;
}

module.exports = getOffsetKey
