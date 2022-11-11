// @flow
'use strict';

const keyUtil = require('keyUtil')
const Block = require('Block')
const Tree = require('Tree')
const ContentState = require('ContentState')
const EditorState = require('EditorState')
const Editor = require('Editor')
const React = require('react')

type Props = {
  editor: Editor,
  editorState: EditorState
}

class Content extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    const prevEditorState = this.props.editorState,
          nextEditorState = nextProps.editorState;

    const prevContent = prevEditorState.getContent(),
          nextContent = nextEditorState.getContent();
    
    const prevDecorator = prevEditorState.getDecorator(),
          nextDecorator = nextEditorState.getDecorator();

    return (prevContent !== nextContent
            || prevDecorator !== nextDecorator);
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
    const trees = editorState.getTreeMap()
    const decorator = editorState.getDecorator(),
          selection = editorState.getSelection()
    
    let Blocks = [];

    const blockArray = content.getBlockArray()
    for(let i = 0; i < blockArray.length; i++) {
      const blockKey = blockArray[i][0],
            block = blockArray[i][1]
            // blockType = block.getType()

      const offsetKey = keyUtil.encodin(blockKey, 0, 0),
            tree = editorState.getTree(blockKey)

      const props = {
        offsetKey,
        blockKey,
        block,
        decorator,
        selection,
        tree,
        content
      }

      Blocks.push(<Block key={blockKey} {...props}/>)
    }
    
    return (
      <div data-content='true'>
        {Blocks}
      </div>
    )
  }
}

module.exports = Content
