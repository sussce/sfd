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
  decorator: ?Decorator,
  treeMap: ?OrderedMap<string, List<any>>
  // undo: Stack, selectionBefore beforeinput changeType
  // redo: Stack
}

type EditorStateBaseConfig = {
  content?: ?ContentState,
  selection?: ?SelectionState,
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
      const { selection, decorator } = options
      
      const content = options.content || editorState.getContent()

      // ?new treeMap with decorator
      
      if(content != editorState.getContent()) {
        map.merge({
          treeMap: renewTreeMap(editorState, content, decorator)
        })
      }
      
      map.merge(options)
    })
 
    return new EditorState(record)
  }

  // static push
  
  acceptSelection(selection: SelectionState): EditorState {
    return  EditorState.set(this, { selection: selection })
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

  getTree(key: string): List<any> {
    return this.getTreeMap().get(key)
  }
  
  getInlineStyle(): InlineStyle {
    const selection = this.getSelection(),
          content = this.getContent()
    
    // if(selection.isCollapsed())
    return this.getInlineStyleCollapsed(content, selection)
  }

  getInlineStyleCollapsed(
    content: ContentState,
    selection: SelectionState
  ): InlineStyle {
    const block = content.getBlockForKey(selection.getAnchorKey())
    return block.getStyleAt(selection.getAnchorOffset()-1)
  }

  // getInlinestyleNonCollapsed
  
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

function renewTreeMap(
  editorState,
  content,
  decorator
): OrderedMap<string, List<any>> {
  const oldContent = editorState.getContent(),
        oldBlockMap = oldContent.getBlockMap(),
        newBlockMap = content.getBlockMap()
   
  return editorState.getTreeMap().merge(
    newBlockMap
      .toSeq()
      .filter((block, key) => block != oldBlockMap.get(key))
      .map(block => Tree.new(block, content, decorator))
  )
}

module.exports = EditorState
