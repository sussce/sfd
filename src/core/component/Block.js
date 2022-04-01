// @flow
'use strict';

const SelectionState = require('SelectionState')
const keyUtil = require('keyUtil')
const Leaf = require('Leaf')
const Decorator = require('Decorator')
const ContentBlock = require('ContentBlock')
const EditorState = require('EditorState')
const React = require('react')
const {List} = require('immutable')

type Props = {
  offsetKey: ?string,
  blockKey: string,
  block: ContentBlock,
  decorator: Decorator,
  selection: SelectionState,
  tree: List<any>
}

class Block extends React.Component<Props> {
  constructor(props:Props) {
    super(props)
  }

  render(): React.Node {
    const {blockKey, offsetKey} = this.props
    
    return (
      <div className='editor-block'
        key={blockKey}
        data-offset-key={offsetKey}>
        {this.renderChildren()}
      </div>
    )
  }

  renderChildren(): React.Node[] {
    const { blockKey, block, tree, decorator, selection, editor } = this.props
    const text = block.getText()

    return tree.map((blockRange, key1) => {
      const decoratorKey = blockRange.get('decoratorKey'),
            leaves = blockRange.get('leaves'),
            start = blockRange.get('start'),
            end = blockRange.get('end')

      if(leaves.size == 0) {
        return null
      }

      const Leaves = leaves.map((leafRange, key2) => {
        const offsetKey = keyUtil.encodin(blockKey, key1, key2),
              start = leafRange.get('start'),
              end = leafRange.get('end')

        const leafProps = {
          offsetKey,
          text: text.slice(start, end),
          inlineStyle: block.getStyleAt(start),          
          start,
          block,
          selection
        }
        
        return <Leaf key={offsetKey} {...leafProps}/>
      }).toArray()
      
      if(decoratorKey == null || !decorator) {
        return Leaves
      }

      const decoratorOffsetKey = keyUtil.encodin(blockKey, key1, 0)
      const DecoratorComponent = decorator.getComponentForKey(decoratorKey),
            decoratorProps = decorator.getPropsForKey(decoratorKey),
            decoratorProps1 = {
              offsetKey: decoratorOffsetKey,
              blockKey,
              start: leaves.first().get('start'),
              end: leaves.first().get('end'),
              text: text.slice(start, end)
              // entityKey: content.getEntityAt()
            }

      return (
        <DecoratorComponent key = {decoratorOffsetKey} {...decoratorProps1} {...decoratorProps}>
          {Leaves}
        </DecoratorComponent>
      )
    }).toArray()
  }
}

module.exports = Block
