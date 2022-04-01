// @flow
'use strict';

function isElement(node: ?Node): boolean {
  if (!node || !node.ownerDocument) {
    return false;
  }
  
  return node.nodeType === Node.ELEMENT_NODE;
}

module.exports = isElement
