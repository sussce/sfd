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

  let anchors, focuses;
  
  if(anchorIsTextNode) {
    anchors = {
      key: asserts(findOffsetKey(anchorNode, root), 'Non node'),
      offset: anchorOffset
    }
    focuses = getPointForNonTextNode(focusNode, focusOffset, root)
    
  } else if(focusIsTextNode) {
    anchors = getPointForNonTextNode(anchorNode, anchorOffset, root),
    focuses = {
      key: asserts(findOffsetKey(focusNode, root), 'Non node'),
      offset: focusOffset
    }
  } else {
    anchors = getPointForNonTextNode(anchorNode, anchorOffset, root)
    focuses = getPointForNonTextNode(focusNode, focusOffset, root)
    
    // if(anchorNode === focusNode && anchorOffset === focusOffset) {
    //   recovery
    // }
  }

  return castSelection(
    editorState,
    anchors.key,
    anchors.offset,
    focuses.key,
    focuses.offset
  )
}

function getPointForNonTextNode(
  node: Node,
  offset: number,
  root: ?HTMLElement
): {
  key: ?{[key: string]: string},
  offset: number
} {
  const offsetKey = findOffsetKey(node, root),
        blockKey = offsetKey.blockKey

  let key: ?{[key: string]: string} = null
  
  if(offsetKey !== null && offset === 0) {
    key = offsetKey
  }
  
  return {key, offset: 0}
}

module.exports = getCastSelection
