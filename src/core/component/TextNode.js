// @flow
'use strict';

const React = require('react')

type Props = {children: string}

class TextNode extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  render(): React.Node {
    const newLine = this.props.children == ''

    return newLine ? (
      <br data-text='true'/>
    ) : (
      <span data-text='true'>
        {this.props.children}
      </span>
    )

  }
}

module.exports = TextNode
