// @flow
'use strict';

const Editor = require('Editor')
const EditorState = require('EditorState')
const removeRange = require('removeRange')

function onBlur(
  _this: Editor,
  e: SyntheticEvent<HTMLElement>
): void {
  console.log('BLUR')  
 
  const editorState = _this._latestEditorState

  let selection = editorState.getSelection()

  if(!selection.getFocused()) return;

  selection = selection.set('focused', false)
  // _this.props.onBlur && _this.props.onBlur(e)
  _this.sync(editorState.acceptSelection(selection));
}

module.exports = onBlur

