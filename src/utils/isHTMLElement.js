// @flow
'use strict';

function isHTMLElement(node: ?Node): boolean {
  if (!node || !node.ownerDocument) {
    return false;
  }
  
  if (!node.ownerDocument.defaultView) {
    return node instanceof HTMLElement;
  }
  
  if (node instanceof node.ownerDocument.defaultView.HTMLElement) {
    return true;
  }
  
  return false;
}

module.exports = isHTMLElement
