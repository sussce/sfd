// Content.js

render() {
  return (
    <div className='content' data-content='true'/>
      {renderChildren(content, treeMap)}
    </div>
  )
}

renderChildren(content, treeMap): React.Node[] {
  const decorator = this.props.editorState.getDecorator()
  let Blocks = []

  treeMap.map((tree, key)=>{
    const offsetKey = keyUtil.encodin(key, 0, 0)
    const blockProps = {
      offsetKey,
      blockKey: key,
      block,
      tree,
      decorator
    }
    
    Blocks.push(
        <Block key={key} {...blockProps}/>
    )
  })

  return Blocks
}

// Block.js
render() {
  const {offsetKey, blockKey, block, tree, decorator} = this.props

  return (
    <div className='block' data-offset-key={offsetKey}>
      {renderChildren()}
    </div>
  )
}

renderChildren() {

}

<div class='block' data-offset-key=''>
  <Leaf />
</div>
