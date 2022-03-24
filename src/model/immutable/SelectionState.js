// @flow
'use strict';

const {Record} = require('immutable')

type SelectionStateConfig = {
  anchorKey: ?string,
  anchorOffset: ?number,
  focusKey: ?string,
  focusOffset: ?number
  // backward
}

const defaultConfig: SelectionStateConfig = {
  anchorKey: null,
  anchorOffset: null,
  focusKey: null,
  focusOffset: null
}

const SelectionStateRecord = (Record(defaultConfig):any)

class SelectionState extends SelectionStateRecord {
  static createEmpty(key: string): SelectionState {
    return new SelectionState({
      anchorKey: key,
      anchorOffset: 0,
      focusKey: key,
      focusOffset: 0,
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

  collapsed(): boolean {
    return this.getAnchorKey() == this.getFocusKey() &&
      this.getAnchorOffset() == this.getFocusOffset()
  }

  // backward(): boolean {}
}

module.exports = SelectionState
