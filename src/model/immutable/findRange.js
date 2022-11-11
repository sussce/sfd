// @flow
'use strict';

const {List} = require('immutable')

function findRange(
  list: List<any>,
  equal: (a: any, b: any) => boolean,
  filter: (a: any) => boolean,
  callback: (start: number, end: number) => void
): void {
  if(list.isEmpty()) {
    return
  }

  let cursor=0
  
  // reduce(function(total, currentValue, currentIndex, arr), initialValue)
  list.reduce((total, currentValue, currentIndex) => {
    if(!equal(total, currentValue)) {
      if(filter(total)) {
        callback(cursor, currentIndex)
      }
      cursor = currentIndex
    }
    return currentValue
  })
  
  if(filter(list.last())) {
    callback(cursor, list.count())
  }
}

module.exports = findRange
