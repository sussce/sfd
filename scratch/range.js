unit test

text -> content -> treeMap((decorator, charmetas) -> blockrange leafrange)
render

content.getBlockMap().map((block, key)=>{
  decorations = decorator? decorator.getDecorations()
                : List(Repeat(null, block.getText().length))
  charmetas = block.getCharMetas()           

  return ranginBlock(decorations)
}).toOrderedMap()

ranginBlock(decorations) {
  let blockRanges=[]
  rangin(
    decorations,
    ()=>!0
    filter,
    (start, end)=>{
      blockRanges.push(new BlockRange({
        start,
        end,
        decoratorKey: decorations.get('start'),
        leaves: ranginLeaf(charmetas.slice(start, end), start)
      }))
    }
  )
  return List(blockRanges)
}

ranginLeaf(charmetas, offset) {}

rangin(list, equal, filter, callback) {}

this.state = {
  editorState: EditorState.createEmpty(new Decorator([
    {strategy: findHash, component: Hash, props: {}},
    {strategy: findMention, component: Link, props: {}}
  ]))
}

charMeta.get('entityKey')
  style
  entityKey
}

range.get('start')

