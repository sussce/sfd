// @flow
'use strict';

const asserts = require('asserts')
const isHTMLElement = require('isHTMLElement')
const Editor = require('Editor')

function getContentEditable(_this: Editor): ?HTMLElement {
  const container: ?HTMLElement = _this.editorContainer
  asserts(isHTMLElement(container), 'Container is not HTMLElement')
  
  return (container.firstChild: any)
}

module.exports = getContentEditable
