// @flow
'use strict';

const enumMutability = {
  MUTABLE: true,
  IMMUTABLE: true,
  SEGMENTED: true
}

export type Mutability = $Keys<typeof enumMutability>
