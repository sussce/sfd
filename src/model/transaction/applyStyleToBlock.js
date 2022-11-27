// @flow
'use strict';

const ContentBlock = require('ContentBlock')
const CharMeta = require('CharMeta')

function applyStyleToBlock(
  block: ContentBlock,
  style: string,
  start: number,
  end: number
): ContentBlock {  
  let charMetas = block.getCharMetas()
  while (start < end) {
    charMetas = charMetas.set(
      start,
      CharMeta.applyStyle(charMetas.get(start), style)
    )
    start++
  }
  return block.set('charMetas', charMetas)
}

module.exports = applyStyleToBlock
