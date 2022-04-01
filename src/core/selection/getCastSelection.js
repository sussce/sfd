// @flow
'use strict';

import type {RawSelection} from 'RawSelection'

const asserts = require('asserts')
const findOffsetKey = require('findOffsetKey')
const castSelection = require('castSelection')
const getRawSelection = require('getRawSelection')
const SelectionState = require('SelectionState')
const EditorState = require('EditorState')

function getCastSelection(
  editorState: EditorState,
  root: ?HTMLElement
): SelectionState {
  const rawSelection: RawSelection = getRawSelection(root),
        { anchorNode, anchorOffset, focusNode, focusOffset, rangeCount } = rawSelection,
        selection = editorState.getSelection()

  if(rangeCount == 0 ||
     anchorNode == null ||
     focusNode == null) {
    return selection
  }

  const anchorIsTextNode = anchorNode.nodeType == Node.TEXT_NODE,
        focusIsTextNode = focusNode.nodeType == Node.TEXT_NODE

  if(anchorIsTextNode && focusIsTextNode) {
    return castSelection(
      editorState,
      asserts(findOffsetKey(anchorNode, root), 'Null node'),
      anchorOffset,
      asserts(findOffsetKey(focusNode, root), 'Null node'),
      focusOffset
    )
  }

  if(anchorIsTextNode) {
    // castSelectionWithTextNode
    // castSelectionWithNonTextNode
  } else if(focusIsTextNode) {

  } else {
    
  }
}

module.exports = getCastSelection
