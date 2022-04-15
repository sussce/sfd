// @flow
'use strict';

import type {InlineStyle} from 'InlineStyle'
const asserts = require('asserts')
const isElement = require('isElement')
const isBRElement = require('isBRElement')
const setRawSelection = require('setRawSelection')
const TextNode = require('TextNode')
const styleMap = require('styleMap')
const Block = require('Block')
const SelectionState = require('SelectionState')
const React = require('react')

type Props = {
  offsetKey: string,
  text: string,
  inlineStyle: InlineStyle,
  start: number,
  block: Block,
  selection: SelectionState
}

class Leaf extends React.Component<Props> {
  leaf: ?HTMLElement;
  
  constructor(props:Props) {
    super(props)
  }

  componentDidMount(): void {
    console.log('didmount')
    this.setSelection()
  }

  componentDidUpdate(): void {
    console.log('didupdate')
    this.setSelection()
  }

  // shouldComponentUpdate(nextProps: Props): boolean {
  //   const leafNode = this.leaf
  //   const should = leafNode.textContent !== nextProps.text &&
  //         this.props.inlineStyle !== nextProps.inlineStyle

  //   return should
  // }
  
  render(): React.Node {
    const {offsetKey, text, inlineStyle} = this.props
    const style = inlineStyle.reduce((styles, style, _) => {
      const slice = styleMap[style]
      return Object.assign(styles, slice)
    }, {})
    
    return (
      <span
        key={offsetKey}
        data-offset-key={offsetKey}
        ref={node => (this.leaf = node)}
        style={style}>
        <TextNode>{text}</TextNode>
       </span>
     )
   }

  setSelection(): void {
    const {selection, start, block, text} = this.props,
          node = this.leaf          

    console.log('node:', node)
    
    asserts(isElement(node), 'Miss node')
    const child = node.firstChild
    asserts(isElement(child), 'Miss child node')

    let targetNode
    
    if(child.nodeType == Node.TEXT_NODE) {
      targetNode = child
    } else if(isBRElement(child)) {
      targetNode = node
    } else {
      targetNode = child.firstChild
    }
 
    const blockKey = block.getKey(),
          end = start + text.length
    
    setRawSelection(targetNode, selection, blockKey, start, end)
  }
}
               
module.exports = Leaf
