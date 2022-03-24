const React = require('react')
const asserts = require('asserts')

test('assertion throw an error', () => {
  const falsy = (a, b) => {
    asserts(a==b, "%s aint %s", a, b)
  }

  expect(() => falsy(1, 2)).toThrowError("1 aint 2")
})
