// @flow
'use strict';

const keyUtil = require('keyUtil')
const Block = require('Block')
const Tree = require('Tree')
const ContentState = require('ContentState')
const EditorState = require('EditorState')
const React = require('react')

type Props = {
  editor: Editor,
  editorState: EditorState
}

class Content extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }
  
  render(): React.Node {
    const {editor, editorState} = this.props
    const content = editorState.getContent()
    
    return (
      <div className='editor-content'>
          {this.renderChildren(editorState, content)}
      </div>
    )
  }

  renderChildren(
    editorState: EditorState,
    content: ContentState
  ): React.Node {
    const trees = editorState.getTreeMap(),
          decorator = editorState.getDecorator()
    let Blocks = [];

    //blockArray = content.getBlockArray
    trees.map((tree, key) => {
      const offsetKey = keyUtil.encodin(key, 0, 0),
            block = content.getBlockForKey(key),
            props = {
              offsetKey,
              blockKey: key,
              block,
              tree,
              decorator
            }

      Blocks.push(<Block key={key} {...props}/>)
    })
    
    return (
      <div data-content='true'>
        {Blocks}
      </div>
    )
  }
}

module.exports = Content
