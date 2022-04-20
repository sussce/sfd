// @flow
'use strict';

import type {InlineStyle} from 'InlineStyle'
const ContentState = require('ContentState')
const SelectionState = require('SelectionState')
const Decorator = require('Decorator')
const ContentBlock = require('ContentBlock')
const Tree = require('Tree')
const {List, OrderedMap, Record} = require('immutable')

type EditorStateConfig = {
  content: ?ContentState,
  selection: ?SelectionState,
  //forceSelection: boolean,
  decorator: ?Decorator,
  treeMap: ?OrderedMap<string, List<any>>
  // undo: Stack, selectionBefore beforeinput changeType
  // redo: Stack
}

type EditorStateBaseConfig = {
  content?: ?ContentState,
  selection?: ?SelectionState,
  //forceSelection?: boolean,
  // changeType: ?string,
  decorator?: ?Decorator,
  treeMap?: ?OrderedMap<string, List<any>>
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
  treeMap: null
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

      if(options.decorator) {
        decorator = options.decorator
      } else if(options.decorator === null) {
        decorator = null
      }
      
      if(decorator !== existDecorator) {
        let newTreeMap
        
        if(decorator) {
          // newTreeMap = newTreeMapWithDecorator()
        } else {
          // newTreemap = newTreeMap()
        }

        // return map.merge
      }

      if(content !== editorState.getContent()) {
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
    changeType: string,
    forceSelection: boolean = true,
  ): EditorState {
    const content = editorState.getContent()
    
    if(newContent == editorState.getContent()) {
      return editorState
    }

    const selection = editorState.getSelection()

    if(selection !== content.getSelectionAfter()) {
      // undoStack = undoStack.push(content)
      newContent = newContent.set('selectionBefore', selection)
    } else if(changeType == 'insert-chars') {
      newContent = newContent.set('selectionBefore', content.getSelectionBefore())
    }
    
    const options = {
      content: newContent,
      selection: newContent.getSelectionAfter(),
      forceSelection: forceSelection,
      changetype: changeType
      // undo: undoStack
    }
    
    return EditorState.set(editorState, options)  
  }

  // getUndo
  
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
  
  getTree(key: string): List<any> {
    return this.getTreeMap().get(key)
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
  editorState,
  content,
  decorator
): OrderedMap<string, List<any>> {
  const oldContent = editorState.getContent(),
        oldBlockMap = oldContent.getBlockMap(),
        newBlockMap = content.getBlockMap()

  // console.log('oldBlockmap', oldBlockMap.toJS(), '\nnewBLockMap:', newBlockMap.toJS())
  
  const filter = newBlockMap
        .toSeq()
        .filter((block, key) => block !== oldBlockMap.get(key))

  const newBlocks = filter.map(block => {
    const _tree = Tree.new(block, content, decorator)
    return _tree
  })

  const keys = newBlockMap.keySeq()
  const _map = editorState.getTreeMap()
        .filter((_, key) => keys.includes(key))
        .merge(
    newBlocks
  )

  return _map
}

// function newTreeMapWithDecorator() {}
// function findInlineStyleUpward() {}

module.exports = EditorState
