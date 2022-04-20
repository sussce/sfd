// App.js
'use strict';

const sfd = require('sfd')
const React = require('react')
const ReactDOM = require('react-dom')

const {Editor, EditorState, Decorator} = sfd
// const {Editor, EditorState, CompositeDecorator} = require('draft-js')

class App extends React.Component {
  constructor() {
    super()

    const options = [{
      strategy: findHandle,
      component: Handle
    }]

    const decorator = new Decorator(options)
     
    this.state = {
      editorState: EditorState.createWithText('take @hm tak\nsome\ncompo', decorator),
      onChange: (state)=>this.setState({editorState: state})
    }   
  }
  
  render() {
    return (
      <div className='editor-root' style={styles.root}>
        <div className='editor' style={styles.editor}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.state.onChange}/>
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
    //border: "1px solid #eee",
    fontFamily: "'Georgia', serif",
    fontSize: 14,
    padding: 0,
    width: 300
  },
  editor: {
    border: "1px solid #ddd",
    cursor: "text",
    fontSize: 16,
    //marginTop: 20,
    minHeight: 100,
    padding: 5
  },
  handle: {
    color: "blue",
    cursor: "pointer"
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
