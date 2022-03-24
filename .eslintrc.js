module.exports = {
  'parser': '@babel/eslint-parser',
  'parserOptions': {
	  'sourceType': 'module'
  },
  'extends': ['prettier'],
  'plugins': ['react', 'prettier'],
  'rules': {
	  'prettier/prettier': ['error']
  }
};
