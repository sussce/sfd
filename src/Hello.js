//@flow

'use strict'

const React = require('react')
const ReactDOM = require('react-dom')

type Props = {
	message: string
}

class Hello extends React.Component<Props> {
	constructor(props: Props) {
		super(props)
	}
	
	render():React.Node {
		const message = this.props.message || 'empty'
		
		return (
			<div style={{border: '1px solid black', width: 200, minHeight: 50, padding: 2}}>
				{message}
			</div>
		)
	}
}

module.exports = Hello
