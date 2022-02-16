'use strict';

const sfd = require('sfd')
const React = require('react')
const ReactDOM = require('react-dom')

const {Editor, EditorState} = sfd

class App extends React.Component {
  state = {
    editorState: EditorState.createWithText('text'),
    onChange: (state)=>this.setState({editorState: state})
  }

  render() {
    return (
      <div className='editor-root'
        style={{border: '1px solid black', width: 100, minHeight: 50}}>
        <Editor
        editorState={this.state.editorState}
        onChange={this.state.onChange}/>
      </div>
    )
  }
  
}

ReactDOM.render(
    <App />,
	document.getElementById('root')
)
