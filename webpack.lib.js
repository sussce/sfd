const path = require('path')
const r = (file)=>path.resolve(__dirname, file)

const externals = {
	react: {
		root: 'React',
		commonjs: 'react',
		commonjs2: 'react',
		amd: 'react'
	},
	'react-dom': {
		root: 'ReactDOM',
		commonjs: 'react-dom',
		commonjs2: 'react-dom',
		amd: 'react-dom'
	},
  immutable: {
    root: 'Immutable',
    commonjs: 'immutable',
    commonjs2: 'immutable',
    amd: 'immutable'
  }
};

const modules = [
  r('src'),
  r('src/core'),
  r('src/core/component'),
  r('src/core/event'),
  r('src/core/event/handlers'),
  r('src/core/event/commands'),
  r('src/core/selection'),
  r('src/model'),
  r('src/model/constants'),
  r('src/model/decorator'),
  r('src/model/entity'),
  r('src/model/immutable'),
  r('src/model/modifiers'),
  r('src/model/transaction'),
  r('src/model/types'),
  r('src/utils'),
	'node_modules'
]

module.exports = (env, argv) => {
	const config = {
		entry: {
			sfd: r('src/sfd.js')
		},    
		output: {
			path: r('lib'),
			filename: '[name].js',
			library: {
				name: 'sfd',
				type: 'umd'
			}
		},
		externals: externals,
		resolve: {
			extensions: ['.js'],
			modules: modules,
			alias: {
				'editor.css': r('src/model/constants/editor.css')
			},
			plugins: []
		},
		module: {
			rules: [{
				test: /\.js$/,
				exclude: [/node_modules/],
				loader: 'babel-loader',
			},{
				test: /\.css$/,
				use: ['style-loader','css-loader']
			}]
		},
    plugins: []
	}

	if(env.debug) {
		config.mode = 'development'
		config.devtool = 'source-map'
	} else {
    config.mode = 'production'
  }
	
	return config
}
