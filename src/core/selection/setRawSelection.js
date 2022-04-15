// @flow
'use strict';

import type {RawSelection} from 'RawSelection'
const getDocument = require('getDocument')
const getRawSelection = require('getRawSelection')

function setRawSelection(
  node: Node,
  selection: SelectionState,
  blockKey: string,
  start: number,
  end: number
): void {
  const rawSelection: RawSelection = getRawSelection(node)
  const anchorKey = selection.getAnchorKey(),
      anchorOffset = selection.getAnchorOffset(),
      focusKey = selection.getFocusKey(),
      focusOffset = selection.getFocusOffset()

  const hasAnchor = anchorKey === blockKey &&
        start <= anchorOffset &&
        anchorOffset <= end,

        hasFocus = focusKey === blockKey &&
        start <= focusOffset &&
        focusOffset <= end,
        
        backward = selection.getBackward()
  
  if(hasAnchor && hasFocus) {
    rawSelection.removeAllRanges()
    addAnchor(
      rawSelection,
      node,
      anchorOffset - start
    )
    addFocus(
      rawSelection,
      node,
      focusOffset - start
    )
    return
  }

  if(!backward) {
    if(hasAnchor) {
      rawSelection.removeAllRanges()
      addAnchor(
        rawSelection,
        node,
        anchorOffset - start
      )
    }
    
    if(hasFocus) {
      addFocus(
        rawSelection,
        node,
        focusOffset - start
      )
    }
  } else {
    if(hasFocus) {
      rawSelection.removeAllRanges()
      addAnchor(
        rawSelection,
        node,
        focusOffset - start
      )
    }

    if(hasAnchor) {
      const tempNode = rawSelection.focusNode,
            tempOffset = rawSelection.focusOffset

      rawSelection.removeAllRanges()
      addAnchor(
        rawSelection,
        node,
        anchorOffset - start
      )
      addFocus(
        rawSelection,
        tempNode,
        tempOffset
      )
    }
  }
}

function addAnchor(
  selection: RawSelection,
  node: ?Node,
  offset: number
): void {
  const range = getDocument(node).createRange();
  range.setStart(node, offset)
  selection.addRange(range)
}

function addFocus(
  selection: RawSelection,
  node: ?Node,
  offset: number
): void {
  if(selection.extend) {
    selection.extend(node, offset)
  }
}

module.exports = setRawSelection
