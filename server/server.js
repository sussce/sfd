// App.js
'use strict';

const sfd = require('sfd')
const React = require('react')
const {createRoot} = require('react-dom/client')

const {Editor, EditorState, Decorator, richUtil} = sfd
const {Stack} = require('immutable')
// const {Editor, EditorState, CompositeDecorator} = require('draft-js')

class App extends React.Component {
  constructor() {
    super();
    
    const decorator = new Decorator([{
      strategy: findHandle,
      component: Handle
    }, {
      strategy: findEntity,
      component: Link,
      props: {}
    }])
    
    this.state = {
      editorState: EditorState.
        createWithText('take @hm tak\nsome\ncomyyypo', decorator),
      showUrl: false,
      url: ''
    }
    
    this.onChange = (editorState)=>this.setState({editorState})
    this.focus = ()=>this.refs.editor.focus()
    
    this.urlChange = (e)=>this.setState({url: e.target.value})
    this.urlKeyDown = this.urlKeyDown.bind(this)
    this.confirmLink = this.confirmLink.bind(this)    
    this.link = this.link.bind(this)
    this.style = this.style.bind(this)
  }

  componentDidUpdate() {}
  
  style(e, tag) {
    e.preventDefault()

    const {editorState} = this.state
    const selection = editorState.getSelection()
    if (selection.getCollapsed()) return;

    this.setState({
      editorState: richUtil.applyStyle(editorState, selection, tag)
    }, () => {
      setTimeout(() => this.refs.editor.focus(), 0)
    })

  }
  
  link(e) {
    e.preventDefault()
    
    const {editorState} = this.state,
          selection = editorState.getSelection()
    
    if(selection.getCollapsed()) return;
    
    this.setState({
      showUrl: !this.state.showUrl
    }, () => {
      if (this.state.showUrl)
        setTimeout(() => this.refs.url.focus(), 0)
    })
  }
  
  confirmLink(e) {
    e.preventDefault()
    
    const {editorState} = this.state

    if (!this.state.url) {
      this.setState({
        editorState: richUtil.toggleLink(
          editorState,
          editorState.getSelection(),
          null
        ),
        showUrl: false,
        url: ''
      }, () => {
        setTimeout(() => this.refs.editor.focus(), 0)        
      })
    }
    else {
      const withEntity = editorState.getContent().createEntity(
        'LINK', 'MUTABLE', {url: this.state.url}
      )

      const newEditorState = EditorState.set(
        editorState,
        {content: withEntity}
      )
      
      this.setState({
        editorState: richUtil.toggleLink(
          newEditorState,
          newEditorState.getSelection(),
          withEntity.getEntityKey()
        ),
        showUrl: false,
        url: ''
      }, () => {
        setTimeout(() => this.refs.editor.focus(), 0)
      })
    }
  }
  
  urlKeyDown(e) {
    if(e.which === 13) {
      this.confirmLink(e)
    }
  }
  
  render() {
    let Styles = [], urlInput = null
    if(this.state.showUrl) {
      urlInput = (
        <div>
          <span>
            URL:<br/>
            <input type="text" ref="url"
              value={this.state.url}
              onChange={this.urlChange}
              onKeyDown={this.urlKeyDown}/>
          </span>
        </div>
      )
    }

    styleSet.map((obj, key) => {
      Styles.push(<Style key={key}
               onStyle={this.style}
               tag={obj.tag}
               value={obj.value}
               style={obj.style}/>)
    })
    
    return (
      <div className='editor-root' style={styles.root}>
        <div className='editor-panel' style={styles["editor-panel"]}>
          {Styles}
          <span style={styles.panel} onClick={this.link}>LINK</span>
          <span style={styles.panel}>QUOTE</span>
        </div>
        {urlInput}
        <div className='editor' style={styles.editor} onClick={this.onFocus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder="enter text"
            ref="editor"/>
        </div>
      </div>
    )
  }
}

class Style extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <span style={{...styles.panel, ...this.props.style}}
            onClick={e=>this.props.onStyle(e, this.props.tag)}>
        {this.props.value}
      </span>
    )
  }
}

function Handle(props) {
  return (
    <span style = {styles.handle} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  )
}

function Link(props) {
  const {url} = props.content.getEntity(props.entityKey).getData()

  return (
    <span>
      <a href={url} style={styles.link}>
        {props.children}
      </a>
    </span>
  )
}

function findEntity(block, callback, content) {
  block.findEntityRange(
    (charMeta: CharMeta) => {
      const entityKey = charMeta.getEntity()
      return entityKey !== null && content
        .getEntity(entityKey)
        .getType() === "LINK"
    },
    callback
  )
}

function findHandle(block, checker, content) {
  findRegex(block, checker, /@[\w]+/g)
}

function findRegex(block, checker, regex) {
  const text = block.getText(),
        charMetas = block.getCharMetas()

  let match, start = 0, end = 0;
  while((match = regex.exec(text)) != null ) {
    start = match.index;
    end = start + match[0].length;

    checker(start, end)
  }
}

const styles = {
  root: {
    fontFamily: "serif",
    fontSize: 14,
    padding: 0,
    width: 310
  },
  "editor-panel": {
    width: 310,
    wordWrap: 'break-word',
    marginBottom: '0.25rem'
  },
  editor: {
    border: "1px solid #ddd",
    cursor: "text",
    fontSize: 16,
    minHeight: 100,
    padding: 5
  },
  handle: {
    color: "blue"
  },
  panel: {
    fontSize: '14px',
    marginRight: '0.8rem',
    cursor: "pointer"
  },
  link: {
    color: 'blue',
    textDecoration: 'underline',
    cursor: "pointer"
  },
  bold: {}
}

const styleSet = [
  { tag: "BOLD", value: "B", style: {fontWeight: 'bold'} },
  { tag: "ITALIC", value: "I", style: {fontStyle: 'italic'} },
  { tag: "UNDERLINE", value: "U", style: {textDecoration: 'underline'} },
  { tag: "LINETHROUGH", value: "W", style: {textDecoration: 'line-through'} },
  { tag: "MONOSPACE", value: "<>", style: {fontFamily: 'monospace', wordWrap: 'break-word'} },
  { tag: "H1", value: "H1", style: {} },
  { tag: "H2", value: "H2", style: {} },
  { tag: "H3", value: "H3", style: {} },
  /*{ tag: "QUOTE", value: """", style: {} }*/
]

createRoot(
  document.getElementById('root')
).render(<App />)
