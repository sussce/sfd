// @flow

const assert = require('assert')
const rangin = require('rangin')
const ContentState = require('ContentState')
const ContentBlock = require('ContentBlock')
const {List, Repeat} = require('immutable')

type DecoratorOptions = {
  strategy: Function,
  component: Function,
  props?: ?Object
}

class Decorator {
  _decorators: $ReadOnlyArray<DecoratorOptions>

  constructor(decorators: $ReadOnlyArray<DecoratorOptions>) {
    this._decorators = decorators
  }

  getDecorations(block: ContentBlock, content: ContentState): List<string> {
    const list = Array(block.getText().length).fill(null)
    
    this.decorators.forEach((options, index) => {
      const {strategy} = options
      let counts = 0

      // [,,,,'0.0','0.0','0.1','0.1']
      function checker(start, end) {
        if(canFill(list, start, end)) {
          fill(list, start, end, index + DELIMITER + counts++)
        }
      }
      
      streategy(block, checker, content)
    })

    return List(list)
  }

  getComponentForKey(key: string) {}

  getPropsForKey(key: string) {}

  get decorators(): $ReadOnlyArray<DecoratorOptions> {
    return this._decorators
  }
}

function canFill(list: Array<?string>, start: number, end: numebr): boolean {
  for(let i=start; i<end; i++) {
    if(list[i] != null) return false
  }
  return true
}

function fill(
  list: Arrray<?string>,
  start: number,
  end: number,
  key: string
): void {
  for(let i=start; i<end; i++) {
    list[i]=key
  }
}

const DELIMITER = '.'

module.exports = Decorator
