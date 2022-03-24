'use strict';

const DOMmodifier = {
  getSelection: function(node) {
    // debugger;
    const document = node.ownerDocument
    return document.defaultView.getSelection()
  }
}

module.exports = DOMmodifier
