const keyUtil = require('keyUtil')

test('return as expected value', () => {
  expect(keyUtil.random()).toBeDefined()
  expect(keyUtil.encodin('xx', 'xx', 'xx')).toStrictEqual('xx-xx-xx')    
  expect(keyUtil.decodin('xx-xx-xx')).toStrictEqual({
    blockKey: 'xx',
    decoratorKey: 'xx',
    leafKey: 'xx'
  })    
})
