// @flow
'use strict';

const asserts = require('asserts')
const isHTMLElement = require('isHTMLElement')
const keyMap = require('keyMap')
const eventHandler = require('eventHandler')
const Content = require('Content')
const EditorState = require('EditorState')
const React = require('react')

type Props = {
  editorState: EditorState,
  onChange: (editorState: EditorState)=>void,
  readOnly: boolean,
  spellCheck: string,
  autoCorrect: string,
  keyMap: Function,
  placeholder?: string,
  styleMap?: Object,
  ...
}

type DefaultProps = {
  readOnly: boolean,
  spellCheck: string,
  autoCorrect: string,
  keyMap: Function,
  ...
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
    const { editor, editorState } = this.props
    editor._latestEditorState = editorState
    editor._blockSelectEvent = true
  }
}

class Editor extends React.Component<Props> {
  static defaultProps: DefaultPropss = {
    readOnly: false,
    autoCorrect: "false",
    spellCheck: "false",
    keyMap: keyMap
  }

  editor: ?HTMLElement
  editorContainer: ?HTMLElement
  refContainer: (node: ?HTMLElement) => void = (node) => {
    this.editorContainer = node
    this.editor = node != null ? (node: any).firstChild : null
  }
  _blockSelectEvent: boolean
  _latestEditorState: EditorState
  _committedEditorState: EditorState
  _pendingEditorState: ?EditorState
  onFocus: Function
  onBlur: Function
  onKeyDown: Function
  onBeforeInput: Function
  onInput: Function
  onSelect: Function
  
  constructor(props: Props) {
    super(props)

    this._blockSelectEvent = false
    this._latestEditorState = props.editorState
    this._committedEditorState = props.editorState

    this.onFocus = this.buildHandler('onFocus')
    this.onBlur = this.buildHandler('onBlur')
    this.onKeyDown = this.buildHandler('onKeyDown')
    this.onBeforeInput = this.buildHandler('onBeforeInput')
    this.onInput = this.buildHandler('onInput')
    this.onSelect = this.buildHandler('onSelect')
    // this.onKeyUp = this.buildHandler('onKeyUp')
    // this.onMouseUp = this.buildHandler('onMouseUp')
  }

  componentDidMount(): void {
    this._blockSelectEvent = false
  }
  
  componentDidUpdate(): void {
    this._latestEditorState = this.props.editorState
    this._committedEditorState = this.props.editorState
    this._blockSelectEvent = false
  }

  render(): React.Node {
    const {editorState} = this.props
    const style = {
      outline: 'none',
      userSelect: 'text', /* fix parent-draggable Safari bug. #1326 */
      WebkitUserSelect: 'text',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    }

    return (
      <div className='editor-paren'>
        {this.renderPlaceholder()}
        <div className='editor-container'
             ref={this.refContainer}>
          <div className='editor'
               style={style}
               onFocus={this.onFocus}
               onBlur={this.onBlur}
               onKeyDown={this.onKeyDown}
               onBeforeInput={this.onBeforeInput}
               onInput={this.onInput}
               onSelect={this.onSelect}
               contentEditable={!this.props.readOnly}
               autoCorrect={this.props.autoCorrect}
               spellCheck={this.props.spellCheck}
               suppressContentEditableWarning>
            <UpdateEditor editor={this} editorState={editorState}/>
            <Content editor={this} editorState={editorState}/>
          </div>
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

  buildHandler(event: string): Function {
    return e => {
      const handler = eventHandler[event]
      return handler(this, e)
    }
  }

  focus(): void {
    const editorNode = this.editor
    asserts(isHTMLElement(editorNode), 'editorNode is invalid HTMLElement')   
    editorNode.focus()
  }

  blur(): void {
    const editorNode = this.editor
    asserts(isHTMLElement(editorNode), 'editorNode is invalid HTMLElement')
    editorNode.blur()
  }
}

module.exports = Editor
