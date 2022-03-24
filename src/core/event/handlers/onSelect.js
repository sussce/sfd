// @flow
'use strict';

const asserts = require('asserts')
const getCastSelection = require('getCastSelection')
const castSelection = require('castSelection')
const EditorState = require('EditorState')
const Editor = require('Editor')

type DOMSelection = {
  anchorNode: ?Node,
  anchorOffset: number,
  focusNode: ?Node,
  focusOffset: number
}

function onSelect(_this: Editor): void {
  console.log('SELECT')
  // debugger;
  
  const { editorState } = _this.props
  
  if(_this._blockSelectEvent ||
     _this._latestEditorState !== _this.props.editorState) {
    return
  }
  
  const selection = getCastSelection(editorState, getContentEditable(_this))
  
  let newEditorState: EditorState

  if(selection !== editorState.getSelection()) {
    newEditorState = editorState.acceptSelection(selection)    
    _this.sync(newEditorState)
  }
}

function getContentEditable(_this: Editor): ?HTMLElement {
  const container: ?HTMLElement = _this.editorContainer
  asserts(isHTMLElement(container), 'Container is invalid HTMLElement')
  
  return (container.firstChild: any)
}

function isHTMLElement(node: Element) {
  return true
}

module.exports = onSelect
