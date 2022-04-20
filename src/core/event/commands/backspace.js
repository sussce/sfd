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
  console.log('removeChars')

  let target = selection
  if(selection.getCollapsed()) {
    console.log('sel:', selection.toJS())
    target = moveSelectionBackward(content, selection)    
    return removeRange(content, target)
  }
  
  return modifier.removeRange(content, selection)
}

function moveSelectionBackward(
  content: ContentState,
  selection: SelectionState
): SelectionState {
  return selection
}

module.exports = backspace
