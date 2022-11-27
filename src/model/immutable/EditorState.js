// @flow
'use strict';

import type {KeyCommand} from 'KeyCommand'
import type {InlineStyle} from 'InlineStyle'
const ContentState = require('ContentState')
const SelectionState = require('SelectionState')
const Decorator = require('Decorator')
const ContentBlock = require('ContentBlock')
const Tree = require('Tree')
const {List, OrderedMap, Record, Stack} = require('immutable')

type EditorStateConfig = {
  content: ?ContentState,
  selection: ?SelectionState,
  forceSelection: boolean,
  decorator: ?Decorator,
  treeMap: ?OrderedMap<string, List<any>>,
  changeType?: ?string,   
  undo: Stack, //selectionBefore beforeinput changeType
  redo: Stack
}

type EditorStateBaseConfig = {
  content?: ?ContentState,
  selection?: ?SelectionState,
  forceSelection?: boolean,
  decorator?: ?Decorator,
  treeMap?: ?OrderedMap<string, List<any>>,
  changeType: ?string  
}

type EditorStateCreateConfig = {
  ...EditorStateBaseConfig,
  content: ContentState
}

type EditorStateChangeConfig = {
  ...EditorStateBaseConfig
}

const defaultConfig: EditorStateConfig = {
  content: null,
  selection: null,
  decorator: null,
  treeMap: null,
  undo: Stack(),
  redo: Stack()
}

const EditorStateRecord = (Record(defaultConfig):any)

class EditorState {
  _immu: EditorStateRecord

  constructor(immu: EditorStateRecord) {
    this._immu = immu
  }
  
  static create(config: EditorStateCreateConfig): EditorState {
    const {content, decorator} = config
    const withConfig = {
      ...config,
      treeMap: newTreeMap(content, decorator)
    }

    return new EditorState(EditorStateRecord(withConfig))
  }
  
  static createWithText(text: string, decorator?: Decorator): EditorState {
    const content = ContentState.createWithText(text),
          key = content.getBlockMap().first().getKey()

    return EditorState.create({
      content: content,
      selection: SelectionState.createEmpty(key),
      decorator: decorator || null
    })
  }

  static createEmpty(decorator?: Decorator): EditorState {
    return EditorState.createWithText('', decorator)
  }

  // static createWithContent(content: Contentstate): EditorState {}

  static set(
    editorState: EditorState,
    options: EditorStateChangeConfig
  ): EditorState {
    const record = editorState.immu.withMutations(map => {
      const {selection} = options
      
      const content = options.content || map.get('content'),
            existDecorator = map.get('decorator')
      let decorator = existDecorator

      if (options.decorator) {
        decorator = options.decorator
      }
      else if (options.decorator === null) {
        decorator = null
      }
      
      if (decorator !== existDecorator) {
        let newTreeMap
        if(decorator) {
          // newTreeMap = newTreeMapWithDecorator()
        }
        else {
          // newTreemap = newTreeMap()
        }
        // return map.merge
      }
      if (content !== editorState.getContent()) {
        map.merge({
          treeMap: newTreeMapWithBlock(
            editorState,
            content,
            decorator
          )
        })
      }     
      map.merge(options)
    })
 
    return new EditorState(record)
  }

  static push(
    editorState: EditorState,
    newContent: ContentState,
    changeType: KeyCommand,
    forceSelection: boolean = true,
  ): EditorState {
    const content = editorState.getContent()
    let undoStack = editorState.getUndo()
    
    if (newContent == editorState.getContent()) {
      return editorState
    }

    const selection = editorState.getSelection()

    if (selection !== content.getSelectionAfter()) {
      undoStack = undoStack.push(content)
      newContent = newContent.set('selectionBefore', selection)
    }
    else if(changeType == 'insert-chars') {
      newContent = newContent.set(
        'selectionBefore',
        content.getSelectionBefore()
      )
    }
    
    const options = {
      content: newContent,
      selection: newContent.getSelectionAfter(),
      forceSelection,
      changeType,
      undo: undoStack
    }
    
    return EditorState.set(editorState, options)  
  }

  static undo(editorState: EditorState): EditorState {
    const undoStack = editorState.getUndo(),
          undoContent = undoStack.peek()

    if (!undoContent) return editorState;

    const redoStack = editorState.getRedo(),
          currentContent = editorState.getContent()

    return EditorState.set(editorState, {
      content: undoContent,
      selection: currentContent.getSelectionBefore(),
      undo: undoStack.shift(),
      redo: redoStack.push(currentContent),
      forceSelection: true,
      changeType: 'undo'
    })
  }

  static redo(editorState: EditorState): EditorState {
    const redoStack = editorState.getRedo(),
          redoContent = redoStack.peek()

    if (!redoContent) return editorState;
    console.log(redoStack.toJS())

    const undoStack = editorState.getUndo(),
          currentContent = editorState.getContent()
    
    return EditorState.set(editorState, {
      content: redoContent,
      selection: redoContent.getSelectionAfter(),
      undo: undoStack.push(currentContent),
      redo: redoStack.shift(),
      forceSelection: true,
      changeType: 'redo'
    })
  }
  
  acceptSelection(selection: SelectionState): EditorState {
    return  EditorState.set(this, { selection: selection })
  }

  forceSelection(selection: SelectionState): EditorState {
    if(!selection.getFocused()) {
      selection = selection.merge({ focused: true })
    }
    
    return EditorState.set(this, {
      selection: selection,
      forceSelection: true
    })
  }

  getUndo(): Stack {
    return this.immu.get('undo')
  }

  getRedo(): Stack {
    return this.immu.get('redo')
  }
  
  getInlineStyle(): InlineStyle {
    const selection = this.getSelection(),
          content = this.getContent()
    
    if(selection.getCollapsed()) {
      return this.getInlineStyleCollapsed(content, selection)
    }
    return this.getInlineStyleNonCollapsed(content, selection)
  }

  getInlineStyleCollapsed(
    content: ContentState,
    selection: SelectionState
  ): InlineStyle {
    const startKey = selection.getStartKey(),
          startOffset = selection.getStartOffset(),
          block = content.getBlockForKey(startKey)

    if(startOffset < block.getLength()) {
      return block.getStyleAt(startOffset)
    }
    if(block.getLength()) {
      return block.getStyleAt(startOffset - 1)
    }
    return block.getStyleAt(0)
    // return findInlineStyleUpward
  }

  getInlineStyleNonCollapsed(
    content: ContentState,
    selection: SelectionState
  ): InlineStyle {
    const startKey = selection.getStartKey(),
          startOffset = selection.getStartOffset,
          block = content.getBlockForKey(startKey)

    if(startOffset < block.getLength()) {
      return block.getStyleAt(startOffset)
    }
    if(block.getLength()) {
      return block.getStyleAt(startOffset - 1)
    }
    return block.getStyleAt(0)
    // return findInlineStyleUpward
  }
  
  getContent(): ContentState {
    return this.immu.get('content')
  }

  getSelection(): SelectionState {
    return this.immu.get('selection')
  }

  getDecorator(): Decorator {
    return this.immu.get('decorator')
  }

  getTree(key: string): List<any> {
    return this.getTreeMap().get(key)
  }

  getTreeMap(): OrderedMap<string, List<any>> {
    return this.immu.get('treeMap')
  }

  get immu(): EditorStateRecord {
    return this._immu
  }
}

function newTreeMap(
  content: ContentState,
  decorator: ?Decorator
): OrderedMap<string, List<any>> {
  return content
    .getBlockMap()
    .map((block, key) => Tree.new(block, content, decorator))
    .toOrderedMap()
}

function newTreeMapWithBlock(
  editorState: EditorState,
  newContent: ContentState,
  decorator: Decorator
): OrderedMap<string, List<any>> {
  const oldContent = editorState.getContent(),
        oldBlockMap = oldContent.getBlockMap(),
        newBlockMap = newContent.getBlockMap()
  
  const newBlocks = newBlockMap
        .toSeq()
        .filter((block, key) => block !== oldBlockMap.get(key))
        .map(block => Tree.new(block, newContent, decorator))

  const keys = newBlockMap.keySeq()
  return editorState
    .getTreeMap()
    .filter((_, key) => keys.includes(key))
    .merge(newBlocks)
}

// function newTreeMapWithDecorator() {}
// function findInlineStyleUpward() {}

module.exports = EditorState
