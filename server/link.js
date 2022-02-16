/*
 * Link App 
 */

'use strict'

const React = require('react')
const EditorState = require('EditorState')
const ContentState = require('ContentState')

class Link extends React.Component {
	constructor(props) {
		super(props)
		
		const text = "Find a form of association that will bring whole common force to bear on defending and protecting associate's person and goods,\n doing in such a way that each of them, while uniting himself with all, still obeys only himself and remains as free as before.",

		const editorState = EditorState.createWithText(text, decorator)

		this.state = {
			editorState: editorState
			url: '',
			hint: false
		}

		this.hintLink = this.hintLink.bind(this)
		this.confirmLink = this.confirmLink.bind(this)
		this.confirmOnly = this.confirmOnly.bind(this)
		this.urlChange = this.urlChange.bind(this)
	}
	onChange(state) {
    this.setState({editorState: state})
	}
	hintLink(e) {
		e.preventDefault()
		this.setState(
			{hint: true},
			setTimeOut(()=>this.refs.hint.focus(), 0)
		)
	}
	confirmLink(e) {
		e.preventDefault()
		//...
		const {editorState, url} = this.state
		const content = editorState.content(),
					withEntity = content.createEntity({
						type: 'LINK',
						mutability: 'MUTABLE',
						data: {url: url}
					})

		editorState = toggleLink()
		
		this.setState({
			editorState,
			hint: false,
			url: ''
		})
	}
	confirmOnly(e) {
		if(e.which==13)
			this.confirmLink(e)
	}
	urlChange(e) {
		this.setState({url: e.target.value})
	}
	render() {
		const style = {
			root:	{
				width: '20rem',
				padding: '0.5rem',
				border: '0.1px solid #ccc'
			}
		}
		return (
			<div className='toolbar'>
	  		<input
					type='button'
					value='link'
					onMouseDown={hintLink}/>
				this.state.hint
				? (<input
						 type='text'
						 value={this.state.url}
						 ref='hint'
						 onChange={this.urlChange}
						 onKeyDown={this.confirmOnly}/>)
				: null
			</div>
	   	<div className='editor-root' style={style.root}>
				<Editor
          style
			    editorState={editorState}
			    onChange={this.onChange}/>
		  </div>
		)
	}

}

module.exports = Link
