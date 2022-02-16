// @flow
'use strict';

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
  tree: List<any>,
  decorator: Decorator
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
    const {blockKey, block, tree, decorator} = this.props
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
          inlineStyle: block.getStyleAt(start)
        }
        
        return <Leaf key={offsetKey} {...leafProps}/>
      })
      
      if(decoratorKey == null || !decorator) {
        return Leaves
      }

      const DecoratorComponent = decorator.getComponentForKey(decoratorKey),
            decoratorProps = decorator.getPropsForKey(decoratorKey),
            decoratorProps1 = {
              offsetKey: keyUtil.encoding(blockKey, key1, 0),
              blockKey,
              start: leaves.first().get('start'),
              end: leaves.first().get('end'),
              text: text.slice(start, end),
              //entityKey: content.getEntityAt()
            }            

      return <DecoratorComponent {...decoratorProps1} {...decoratorProps}/>
    }).toArray()
  }
}

module.exports = Block
