// @flow
'use strict';

import type {RawSelection} from 'RawSelection'
const getDocument = require('getDocument')

function getRawSelection(node: ?Node): RawSelection {
  const document = getDocument(node)
  return document.defaultView.getSelection()
}

module.exports = getRawSelection
