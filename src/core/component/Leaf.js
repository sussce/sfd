// @flow
'use strict';

import type {InlineStyle} from 'InlineStyle'
const TextNode = require('TextNode')
const styleMap = require('styleMap')
const React = require('react')

type Props = {
  offsetKey: string,
  text: string,
  inlineStyle: InlineStyle
}

class Leaf extends React.Component<Props> {
  constructor(props:Props) {
    super(props)
  }
  
  render(): React.Node {
    const {offsetKey, text, inlineStyle} = this.props
    const style = inlineStyle.reduce((styles, style, _)=>{
      const slice = styleMap[style]
      return Object.assign(styles, slice)
    }, {})
    
    return (
      <span
        key={offsetKey}
        data-offset-key={offsetKey}
        style={style}>
        <TextNode>{text}</TextNode>
      </span>
    )
  }
}

module.exports = Leaf
