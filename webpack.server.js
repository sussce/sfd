const path = require('path');
const html_plugin=require('html-webpack-plugin');
const r = (file)=>path.resolve(__dirname, file);

module.exports = (env, argv) => {
	const config = {
		mode: 'development',
		devtool: 'source-map',
    devServer: {
			port: 3000
		},    
		entry: {
			server: r('server/server.js')
		},    
		output: {
			path: r('build'),
			filename: '[name].js'
		},    
		resolve: {
			extensions: ['.js'],
			modules: [r('lib'),'node_modules']
		},    
		module: {
			rules: [{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: [/node_modules/, r('scratch')]
			}]
		},    
		plugins: [
			new html_plugin({
				hash: true,
				template: r('server/template.html'),
				filename: 'index.html',
				inject: 'body'
			})
		]
	};

	return config
}
