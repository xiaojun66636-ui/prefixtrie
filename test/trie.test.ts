import assert from "node:assert/strict";
import { test } from "node:test";
import { PrefixTrie } from "../src/trie.ts";

test("lists every key under a prefix", () => {
  const trie = new PrefixTrie<number>();
  trie.insert("cat", 1);
  trie.insert("car", 2);
  trie.insert("card", 3);
  trie.insert("dog", 4);
  assert.deepEqual(trie.keysWithPrefix("car"), ["car", "card"]);
  assert.equal(trie.hasPrefix("ca"), true);
  assert.equal(trie.hasPrefix("zz"), false);
  assert.equal(trie.get("card"), 3);
  assert.equal(trie.get("cab"), undefined);
});

test("deleting a middle key keeps the longer key", () => {
  const trie = new PrefixTrie<number>();
  trie.insert("car", 1);
  trie.insert("card", 2);
  assert.equal(trie.delete("car"), true);
  assert.equal(trie.get("car"), undefined);
  assert.equal(trie.get("card"), 2);
  assert.deepEqual(trie.keysWithPrefix("car"), ["card"]);
  assert.equal(trie.size, 1);
});

test("deleting a leaf prunes it", () => {
  const trie = new PrefixTrie<string>();
  trie.insert("a", "one");
  trie.insert("ab", "two");
  assert.equal(trie.delete("ab"), true);
  assert.equal(trie.delete("ab"), false);
  assert.deepEqual(trie.keysWithPrefix(""), ["a"]);
  assert.equal(trie.hasPrefix("ab"), false);
});

test("replacing a key does not grow size", () => {
  const trie = new PrefixTrie<number>();
  trie.insert("k", 1);
  trie.insert("k", 2);
  assert.equal(trie.size, 1);
  assert.equal(trie.get("k"), 2);
});

test("rejects undefined values", () => {
  const trie = new PrefixTrie<number | undefined>();
  assert.throws(() => trie.insert("k", undefined));
});
