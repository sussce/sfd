// @flow
'use strict';

import type {RawSelection} from 'RawSelection'
const asserts = require('asserts')
const findOffsetKey = require('findOffsetKey')
const getRawSelection = require('getRawSelection')
const Editor = require('Editor')

function onInput(
  _this: Editor,
  e: ?SyntheticInputEvent<>
): void {
  console.log('INPUT')

  if(_this._pendingEditorState != undefined) {
    _this.sync(_this._pendingEditorState)
    _this._pendingEditorState = undefined
  }
  
  const editorState = _this._latestEditorState,
        content = editorState.getContent()
  
  const rawSelection: RawSelection = getRawSelection(_this.editor),
        {anchorNode, anchorOffset, isCollapsed} = rawSelection,
        domText = anchorNode.textContent
  
  const anchorKeys = asserts(findOffsetKey(anchorNode, _this.editor), 'Null node'),
        {start, end} = editorState
        .getTree(anchorKeys.blockKey)
        .getIn([
          anchorKeys.decoratorKey,
          'leaves',
          anchorKeys.leafKey
        ])
  
  const anchorBlock = content.getBlockForKey(anchorKeys.blockKey),
        modelText = anchorBlock.getText().slice(start, end)    
  
  // _this._latestEditorstate, _this.props.editorState
  if(domText == modelText) {
    const inputType = e ? e.nativeEvent.inputType : undefined
    if(inputType) {}
    return
  }
}

module.exports = onInput
