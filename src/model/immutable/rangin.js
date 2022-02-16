// @flow
'use strict';

const {List} = require('immutable')

function rangin(
  list: List<any>,
  equal: (a:any, b:any)=>boolean,
  filter: (a:any)=>boolean,
  callback: (start:number, end:number)=>void
):void {
  if(list.isEmpty()) {
    return
  }

  let cursor=0
  list.reduce((value, nextValue, nextIndex)=>{
    if(!equal(value, nextValue)) {
      if(filter(value)) {
        callback(cursor, nextIndex)
      }
      cursor = nextIndex
    }
    return nextValue
  })
  
  if(filter(list.last())) {
    callback(cursor, list.count())
  }
}

module.exports = rangin
