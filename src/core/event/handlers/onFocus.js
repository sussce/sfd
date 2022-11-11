// @flow
'use strict';

const EditorState = require('EditorState')

function onFocus(
  _this: Editor,
  e: SyntheticFocusEvent<>
): void {
  console.log('FOCUS')
  
  const editorState = _this._latestEditorState

  if(editorState.getSelection().getFocused()) {
    return
  }

  // _this.props.onFocus && _this.props.onFocus(e)
  
  const selection = editorState.getSelection().merge({ focused: true })

  // https://crbug.com/540004
  const isBrowser = () => true;
  if(isBrowser('Chrome < 60.0.3081.0')) {
    _this.sync(editorState.forceSelection(selection))
  } else {
    _this.sync(editorState.acceptSelection(selection))
  }
}

module.exports = onFocus
