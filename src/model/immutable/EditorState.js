// @flow
'use strict';

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
      treeMap: createTreeMap(content, decorator)
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

function createTreeMap(
  content: ContentState,
  decorator: ?Decorator
): OrderedMap<string, List<any>> {
  return content
    .getBlockMap()
    .map((block, key) => Tree.createTree(block, decorator))
    .toOrderedMap()
}

module.exports = EditorState
