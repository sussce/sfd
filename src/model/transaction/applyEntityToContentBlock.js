// @flow
'use strict';

const ContentBlock = require('ContentBlock')
const CharMeta = require('CharMeta')

function applyEntityToContentBlock(
  block: ContentBlock,
  entityKey: string,
  start: number,
  end: number
): ContentBlock {
  let charMetas = block.getCharMetas()
  while(start < end) {
    const charMeta = charMetas.get(start)
    charMetas = charMetas.set(
      start,
      CharMeta.applyEntity(charMetas.get(start), entityKey)
    )
    start++
  }
  return block.set('charMetas', charMetas)
}

module.exports = applyEntityToContentBlock
