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
    const withLink = modifier.applyEntity(
      editorState.getContent(),
      editorState.getSelection(),
      entityKey
    )
    return EditorState.push(editorState, withLink, 'apply-entity')
  },

  applyStyle(
    editorState: EditorState,
    selection: SelectionState,
    style: string
  ): EditorState {
    console.log('richUtil:applyStyle')

    const content = editorState.getContent()
    let newContent
    
    newContent = modifier.applyStyle(content, selection, style)
    return EditorState.push(editorState, newContent, 'apply-style')
  }
}

module.exports = richUtil
