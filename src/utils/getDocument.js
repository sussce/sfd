// @flow
'use strict';

function getDocument(node: ?Node): Document {
  if(!node || !node.ownerDocument) {
    return document
  }

  return node.ownerDocument
}

module.exports = getDocument
