// @flow
'use strict';

const {Record} = require('immutable')

type SelectionStateConfig = {
  anchorKey: ?string,
  anchorOffset: ?number,
  focusKey: ?string,
  focusOffset: ?number,
  collapsed: boolean,
  focused: boolean,
  backward: boolean
}

const defaultConfig: SelectionStateConfig = {
  anchorKey: null,
  anchorOffset: 0,
  focusKey: null,
  focusOffset: 0,
  collapsed: true,
  focused: false,
  backward: false
}

const SelectionStateRecord = (Record(defaultConfig):any)

class SelectionState extends SelectionStateRecord {
  static createEmpty(key: string): SelectionState {
    return new SelectionState({
      anchorKey: key,
      anchorOffset: 0,
      focusKey: key,
      focusOffset: 0
    })
  }

  getAnchorKey(): string {
    return this.get('anchorKey')
  }

  getAnchorOffset(): number {
    return this.get('anchorOffset')
  }

  getFocusKey(): string {
    return this.get('focusKey')
  }

  getFocusOffset(): number {
    return this.get('focusOffset')
  }

  getCollapsed(): boolean {
    return this.get('collapsed')
  }
  
  getFocused(): boolean {
    return this.get('focused')
  }

  getBackward(): boolean {
    return this.get('backward')
  }
}

module.exports = SelectionState
