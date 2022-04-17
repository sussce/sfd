// @flow
'use strict';

import type {InlineStyle} from 'InlineStyle'
const isSelectionAtLeafStart = require('isSelectionAtLeafStart')
const EditorState = require('EditorState')
const Editor = require('Editor')
const modifier = require('modifier')

function onBeforeInput(
  _this: Editor,
  e: SyntheticInputEvent<HTMLElement>
): void {
  console.log('BEFOREINPUT')  
  
  const editorState = _this._latestEditorState,
        {data} = e

  if(!data) {
    return
  }
  
  const selection = editorState.getSelection(),
        inlineStyle = editorState.getInlineStyle(),
        chars = data
  
  if(!selection.getCollapsed()) {
    e.preventDefault()
    _this.sync(
      replaceChars(
        editorState,
        chars,
        inlineStyle,
        true
      )
    )
    return
  }
 
  let newEditorState = replaceChars(
    editorState,
    chars,
    inlineStyle,
    false
  )

  let preventDefault = false
  if(!preventDefault) {
    preventDefault = isSelectionAtLeafStart(
      _this._committedEditorState
    )
  }
  if(preventDefault) {
    e.preventDefault()
    newEditorState = EditorState.set(newEditorState, {
      forceSelection: true
    })
    _this.sync(newEditorState)
    return
  }

  _this._pendingEditorState = newEditorState
}

function replaceChars(
  editorState: EditorState,
  chars: string,
  inlineStyle: InlineStyle,
  forceSelection: boolean
): EditorState {
  const content = modifier.replaceChars(
    editorState.getContent(),
    editorState.getSelection(),
    chars,
    inlineStyle
  )
  
  return EditorState.push(
    editorState,
    content,
    'insert-chars',
    forceSelection
  )
}

module.exports = onBeforeInput
                         
