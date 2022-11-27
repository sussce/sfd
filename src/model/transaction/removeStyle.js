//@flow
'use strict';

const CharMeta = require('CharMeta')
const ContentBlock = require('ContentBlock')

function removeStyle(
  block: ContentBlock,
  style: string,
  start: number,
  end: number
): ContentBlock {
  let charMetas = block.getCharMetas()
  
  while (start < end) {
    charMetas = charMetas.set(
      start,
      CharMeta.removeStyle(charMetas.get(start), style)
    )
    start++;
  }
  return block.set('charMetas', charMetas)
}

module.exports = removeStyle
