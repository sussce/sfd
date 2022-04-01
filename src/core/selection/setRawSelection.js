// @flow
'use strict';

import type {RawSelection} from 'RawSelection'
const getRawSelection = require('getRawSelection')

function setRawSelection(
  node: Node,
  selection: SelectionState,
  blockKey: string,
  start: number,
  end: number
): void {
  const rawSelection: RawSelection = getRawSelection(node),
        anchorKey = selection.getAnchorKey(),
        anchorOffset = selection.getAnchorOffset(),
        focusKey = selection.getFocusKey(),
        focusOffset = selection.getFocusOffset()

  const hasAnchor = anchorKey === blockKey &&
        start <= anchorOffset &&
        anchorOffset <= end,
        hasFocus = focusKey === blockKey &&
        start <= focusOffset &&
        focusOffset <= end
  
  if(hasAnchor && hasFocus) {
    rawSelection.removeAllRanges()

    // setAnchor
    const range = node.ownerDocument.createRange();
    range.setStart(node, anchorOffset - start)
    rawSelection.addRange(range)

    // setFocus
  } else if(hasAnchor) {
    
  } else if(hasFocus) {
    
  }
}


function addRangeToSelction(): void {}
function addAnchorToSelection(): void {}
function addFocusToSelection(): void {}

module.exports = setRawSelection
