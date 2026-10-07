# prefixtrie

A prefix tree. No dependencies.

`get` walks one character at a time. `keysWithPrefix` returns every stored key that equals the prefix or starts with it, sorted. `hasPrefix` is true when such a key exists, even if the prefix itself was never inserted.

Deleting a key that still has longer keys under it only clears that key. Deleting a leaf drops the nodes that no longer lead anywhere.

`undefined` is not a stored value, because `get` uses it for a miss. Replacing a key updates the value and does not change `size`.

## Use

```ts
import { PrefixTrie } from "./src/trie.ts";

const trie = new PrefixTrie<number>();
trie.insert("car", 1);
trie.insert("card", 2);
trie.keysWithPrefix("car"); // ["car", "card"]
trie.delete("car");
trie.get("card"); // 2
```

Iteration is by Unicode code point, which is what `for...of` does on a string.

## Test

```bash
node --experimental-strip-types --test test/*.test.ts
```

## License

MIT
