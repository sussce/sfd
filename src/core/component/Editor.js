// @flow
'use strict';

const Content = require('Content')
const EditorState = require('EditorState')
const React = require('react')

type Props = {
  editorState: EditorState,
  onChange: (editorState: EditorState)=>void,
  readOnly: boolean
}

type DefaultProps = {
  readOnly: boolean
}

class UpdateEditor extends React.Component<{
  editor: Editor,
  editorState: EditorState
}> {
  componentDidMount() {
    this.sync()
  }

  componentDidUpdate() {
    this.sync()
  }

  render(): React.Node {
    return null
  }

  sync() {
    const {editor, editorState} = this.props
    editor._latestEditorState = editorState
  }
}

class Editor extends React.Component<Props> {
  static defaultProps: DefaultPropss = {
    readOnly: false
  }

  editor: ?HTMLElement
  refCallback: (node: ?HTMLElement)=>void = (node)=>this.editor=node
  _latestEditorState: EditorState
  
  constructor(props: Props) {
    super(props)

    this._latestEditorState = this.props.editorState
  }

  componentDidUpdate(): void {
    this._latestEditor = this.props.editorState
  }

  render(): React.Node {
    const {editorState, readOnly} = this.props

    const style = {
      outline: 'none',
      // fix parent-draggable Safari bug. #1326
      userSelect: 'text',
      WebkitUserSelect: 'text',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    }

    return (
      <div className='editor-paren'>
        {this.renderPlaceholder()}
        
        <div className='editor'
             style={style}
             ref={this.refCallback}
             contentEditable={!readOnly}
             suppressContentEditableWarning>
          <UpdateEditor editor={this} editorState={editorState}/>
          <Content editor={this.editor} editorState={editorState}/>
        </div>
      </div>
    )
  }

  renderPlaceholder(): React.Node {
    const {editorState, placeHolder} = this.props
    const withHolder = placeHolder && !!placeHolder.toString().trim(),
          withContent = editorState.getContent().getBlockMap()
          .some(block=>!!block.getText().length)

    return withHolder && !withContent ? (
      <div className='editor-placeholder'>
        {placeHolder}
      </div>
    ) : null
  }

  sync(editorState: EditorState): void {
    this._latestEditorState = editorState
    this.props.onChange(editorState)
  }
}

module.exports = Editor
