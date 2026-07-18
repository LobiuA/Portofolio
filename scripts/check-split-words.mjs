// scripts/check-split-words.mjs
import assert from 'node:assert'
import { splitWords } from '../lib/split-words.ts'

assert.deepEqual(splitWords('TRI MUHAMMAD JIDAN'), ['TRI', 'MUHAMMAD', 'JIDAN'])
assert.deepEqual(splitWords('  '), [])
assert.equal(splitWords('one two three').length, 3)
assert.deepEqual(splitWords('halo dunia'), ['halo', 'dunia'])
console.log('split-words OK')
