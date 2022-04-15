// @flow
'use strict';

const isElement = require('isElement')

function isBRElement(node: ?Node): boolean {
  if (!node || !node.ownerDocument) {
    return false;
  }
  return isElement(node) && node.nodeName === 'BR';
}

module.exports = isBRElement
