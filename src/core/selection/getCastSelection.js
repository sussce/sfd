// @flow
'use strict';

const castSelection = require('castSelection')
const asserts = require('asserts')
const findOffsetKey = require('findOffsetKey')
const DOMModifier = require('DOMModifier')
const EditorState = require('EditorState')
const SelectionState = require('SelectionState')

function getCastSelection(
  editorState: EditorState,
  root: ?HTMLElement
): SelectionState {
  //debugger;
  const rawSelection: DOMSelection =  DOMModifier.getSelection(root),
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
    
  } else if(focusIsTextNode) {

  } else {
    
  }
}

module.exports = getCastSelection
