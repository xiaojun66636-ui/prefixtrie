class Node<T> {
  readonly children = new Map<string, Node<T>>();
  value: T | undefined = undefined;
  terminal = false;
}

/**
 * Prefix tree. Lookup of one key is O(length).
 * Deleting a leaf prunes empty nodes. Deleting a key that still has
 * children only clears that key's value.
 */
export class PrefixTrie<T> {
  private readonly root = new Node<T>();
  private count = 0;

  get size(): number {
    return this.count;
  }

  insert(key: string, value: T): void {
    if (value === undefined) throw new Error("undefined values are not stored");
    let node = this.root;
    for (const char of key) {
      let child = node.children.get(char);
      if (!child) {
        child = new Node<T>();
        node.children.set(char, child);
      }
      node = child;
    }
    if (!node.terminal) this.count += 1;
    node.terminal = true;
    node.value = value;
  }

  get(key: string): T | undefined {
    const node = this.walk(key);
    if (!node || !node.terminal) return undefined;
    return node.value;
  }

  /** True when some stored key equals `prefix` or starts with it. */
  hasPrefix(prefix: string): boolean {
    const node = this.walk(prefix);
    if (!node) return false;
    return node.terminal || node.children.size > 0;
  }

  /** Stored keys equal to `prefix` or starting with it, in lexicographic order. */
  keysWithPrefix(prefix: string): string[] {
    const node = this.walk(prefix);
    if (!node) return [];
    const out: string[] = [];
    this.collect(node, prefix, out);
    out.sort();
    return out;
  }

  delete(key: string): boolean {
    const removed = this.remove(this.root, key, 0);
    if (removed) this.count -= 1;
    return removed;
  }

  private walk(key: string): Node<T> | undefined {
    let node = this.root;
    for (const char of key) {
      const child = node.children.get(char);
      if (!child) return undefined;
      node = child;
    }
    return node;
  }

  private collect(node: Node<T>, path: string, out: string[]) {
    if (node.terminal) out.push(path);
    for (const [char, child] of node.children) this.collect(child, path + char, out);
  }

  private remove(node: Node<T>, key: string, index: number): boolean {
    if (index === key.length) {
      if (!node.terminal) return false;
      node.terminal = false;
      node.value = undefined;
      return true;
    }
    const char = key[index] as string;
    const child = node.children.get(char);
    if (!child) return false;
    const removed = this.remove(child, key, index + 1);
    if (removed && !child.terminal && child.children.size === 0) {
      node.children.delete(char);
    }
    return removed;
  }
}
