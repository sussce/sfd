// @flow
'use strict';

const removeRange = require('removeRange')
const modifier = require('modifier')
const EditorState = require('EditorState')
const SelectionState = require('SelectionState')

function backspace(editorState: EditorState): EditorState {
  console.log('cmd:backspace')

  const removal = removeChars(
    editorState.getContent(),
    editorState.getSelection()
  )

  if(removal === editorState.getContent()) {
    return editorState
  }
  
  return EditorState.push(
    editorState,
    removal,
    editorState.getSelection().getCollapsed()
      ? 'backspace'
      : 'remove-range'
  )
}

function removeChars(
  content: ContentState,
  selection: SelectionState
): ContentState {
  console.log('cmd:backspace:removeChars')

  let target = selection
  if(selection.getCollapsed()) {
    if(atStartOfContent(content, target)) {
      return content
    }
    
    target = moveSelectionBackward(content, selection)
  }
  
  return modifier.removeRange(content, target)
}

function moveSelectionBackward(
  content: ContentState,
  selection: SelectionState
): SelectionState {
  console.log('moveSelectionbackward')

  const startKey = selection.getStartKey(),
        startOffset = selection.getStartOffset()
 
  let newKey = startKey,
      newOffset = startOffset - 1
  
  if(anchorOffset === 0) {
    const prevBlock = content.getBlockMap()
          .toSeq()
          .reverse()
          .skipUntil((_, key) => key === anchorKey)
          .rest()
          .first()

    newKey = prevBlock.getKey()
    newOffset = prevBlock.getLength()
  }

  return selection.merge({
    focusKey: newKey,
    focusOffset: newOffset,
    collapsed: false,
    backward: true
  })
}

function atStartOfContent(
  content: ContentState,
  selection: SelectionState
): boolean {
  const blockMap = content.getBlockMap(),
        startKey = selection.getStartKey(),
        startOffset = selection.getStartOffset()

  return startOffset === 0 &&
    startKey === content
    .getBlockMap()
    .keySeq()
    .first()
}

module.exports = backspace
