// @flow
'use strict';

const getContentEditable = require('getContentEditable')
const getCastSelection = require('getCastSelection')
const EditorState = require('EditorState')
const Editor = require('Editor')
const getDocument = require('getDocument')

function onSelect(_this: Editor): void {
  console.log('SELECT')
  
  const {editorState} = _this.props
 
  if(_this._blockSelectEvent ||
     _this._latestEditorState !== _this.props.editorState) {
    return
  }

  const selection = getCastSelection(editorState, getContentEditable(_this))
  
  let newEditorState: EditorState 

  if(selection !== editorState.getSelection()) {
    // forceSelection
    newEditorState = editorState.acceptSelection(selection)
    _this.sync(newEditorState)
  }
}

module.exports = onSelect
