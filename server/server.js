// App.js
'use strict';

const sfd = require('sfd')
const React = require('react')
const {createRoot} = require('react-dom/client')

const {Editor, EditorState, Decorator, Entity, EntityUtil, richUtil} = sfd
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
        createWithText('take @hm tak\nsome\ncompo', decorator),
      showUrl: false,
      url: ''
    }

    this.onChange = (editorState)=>this.setState({editorState})
    this.focus = ()=>this.refs.editor.focus()
    
    this.urlChange = (e)=>this.setState({url: e.target.value})
    this.urlKeyDown = this.urlKeyDown.bind(this)
    this.confirmLink = this.confirmLink.bind(this)    
    this.link = this.link.bind(this)
  }

  style(e, str) {
    console.log('style')
  }
  
  link(e) {
    console.log('link')
    e.preventDefault()
    
    const {editorState} = this.state,
          selection = editorState.getSelection()
    
    if(!selection.getCollapsed()) {
      console.log(editorState.getSelection().toJS())
      
      this.setState({
        showUrl: !this.state.showUrl
      }, () => {
        if (this.state.showUrl)
          setTimeout(() => this.refs.url.focus(), 0)
      })
    }
  }
  
  confirmLink(e) {
    console.log('confirmlink')
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
      const withEntity = editorState
            .getContent()
            .createEntity('LINK', 'MUTABLE', {url: this.state.url})

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
    let urlInput = null
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
          <button onMouseDown={this.confirmLink}>confirm</button>
        </div>
      )
    }
    
    return (
      <div className='editor-root' style={styles.root}>
        <div className='editor-panel'>
          <span style={styles.panel}>H</span>       
          <span style={styles.panel}>BOLD</span>
          <span style={styles.panel}>ITALIC</span>
          <span style={styles.panel}>UNDERLINE</span>
          <span style={styles.panel} onClick={this.link}>LINK</span>          
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
    width: 300
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
    marginRight: '10px',
    cursor: "pointer"
  },
  link: {
    color: 'blue',
    textDecoration: 'underline',
    cursor: "pointer"
  },
  bold: {}
}

createRoot(
  document.getElementById('root')
).render(<App />)
