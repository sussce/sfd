// @flow
'use strict';

const modifier = require('modifier')
const EditorState = require('EditorState')
const ContentState = require('ContentState')
const SelectionState = require('SelectionState')

const richUtil = {
  toggleLink(
    editorState: EditorState,
    selection: SelectionState,
    entityKey: ?string
  ): EditorState {
    if(selection.getCollapsed()) {
      return editorState
    }

    const withEntity = modifier.applyEntity(
      editorState.getContent(),
      editorState.getSelection(),
      entityKey
    )
    
    return EditorState.push(editorState, withEntity, 'apply-entity')
  },

  applyStyle(
    editorState: EditorState,
    selection: SelectionState,
    style: InlineStyle
  ): EditorState {
    console.log('richUtil:applyStyle')

    const content = editorState.getContent()
    let newContent
    
    newContent = modifier.applyStyle(content, selection, style)
    
    return editorState
    // return EditorState.push(editorState, newContent, 'apply-style')
  }
}

module.exports = richUtil
