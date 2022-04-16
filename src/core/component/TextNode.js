// @flow
'use strict';

const asserts = require('asserts')
const isElement = require('isElement')
const React = require('react')

type Props = { children: string }

class TextNode extends React.Component<Props> {
  _node: ?HTMLElement
  
  constructor(props: Props) {
    super(props)
  }

  // shouldComponentUpdate(nextProps: Props): boolean {
  //   const node = this._node
  //   asserts(isElement(node), 'Miss node')
  //   const elementNode: Element = (node: any)
  //   return elementNode.textContent !== nextProps.children
  // }
  
  render(): React.Node {
    const newLine = this.props.children === ''

    return newLine ? (
      <br data-text='true'/>
    ) : (
      <span
        data-text='true'
        ref={node => (this._node = node)}>
        {this.props.children}
      </span>
    )

  }
}

module.exports = TextNode
