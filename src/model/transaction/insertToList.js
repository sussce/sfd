// @flow
'use strict';

const {List} = require('immutable')

function insertToList(
  list: List<T>,
  partial: List<T>,
  offset: number
): List<T> {
  let _list = list

  if(offset == 0) {
    partial.reverse().forEach(e => {
      _list = _list.unshift(e)
    })
  } else if(offset == list.count()) {
    partial.forEach(e => {
      _list = _list.push(e)
    })
  } else {
    let before = list.slice(0, offset),
        after = list.slice(offset)

    _list = before.concat(partial, after)
  }
  
  return _list
}

module.exports = insertToList
