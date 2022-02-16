// @flow
'use strict';

const rangin = require('rangin')
const ContentState = require('ContentState')
const ContentBlock = require('ContentBlock')
const CharMeta = require('CharMeta')
const Decorator = require('Decorator')
const {Record, List, Repeat} = require('immutable')

type LeafRangeConfig = {
  start: ?number,
  end: ?number
}

const defaultLeaf: LeafRangeConfig= {
  start: null,
  end: null
}

const LeafRange = (Record(defaultLeaf):any)

type BlockRangeConfig = {
  start: ?number,
  end: ?number,
  decoratorKey: ?string,
  // $FlowFixMe[value-as-type]  
  leaves: ?List<LeafRange>
}

const defaultBlock: BlockRangeConfig = {
  start: null,
  end: null,
  decoratorKey: null,
  leaves: null
}

const BlockRange = (Record(defaultBlock):any)

function ranginBlock(decorations: List<string>, block: ContentBlock): List<BlockRange> {
  const charMetas = block.get('charMetas')
  let ranges = []
  
  rangin(decorations, equal, filter, (start, end) => {
    ranges.push(new BlockRange({
      start,
      end,
      decoratorKey: decorations.get('start'),
      leaves: ranginLeaf(charMetas.slice(start, end), start)
    }))
  })
  
  return List(ranges)
}

function ranginLeaf(charMetas: List<CharMeta>, offset: number): List<LeafRange> {
  const inlineStyles = charMetas.map(charMeta => charMeta.getStyle()).toList()
  let ranges = []
  
  rangin(inlineStyles, equal, filter, (start, end) => {
    ranges.push(new LeafRange({
      start: offset+start,
      end: offset+end
    }))
  })

  return List(ranges)
}

const equal = (a:any, b:any):boolean => a==b,
      filter = (a:any):boolean => !0;

const Tree = {
  createTree: (
    block: ContentBlock,
    /*content: ContentState,*/    
    decorator: ?Decorator
  ): List<BlockRange> => {
    const text = block.getText()

    if(!text.length) {
      return List.of(new BlockRange({
        start: 0,
        end: 0,
        decoratorKey: null,
        leaves: List.of(new LeafRange({start:0, end:0}))
      }))
    }

    const decorations = decorator ? decorator.getDecorations(block, /*content*/)
          : List(Repeat(null, text.length))

    return ranginBlock(decorations, block)
    
  }
}

module.exports = Tree
