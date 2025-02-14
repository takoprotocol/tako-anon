# Merkle Trees Library

This Noir library provides a Merkle Tree (MT) and a Sparse Merkle Tree (SMT) implementation.

A Sparse Merkle Tree is not too different from a Merkle Tree, but the index of each leaf is determined by its key value. This makes the SMT quite useful, for example, for nullifier trees, as it allows for easy non-membership proofs.

## Usage

To use these trees in your project, add the lib to its `Nargo.toml` file. For example:

```toml
[dependencies]
trees = { git = "https://github.com/privacy-scaling-explorations/zk-kit.noir", tag = "main", directory = "packages/merkle-trees" }
```

And import it in your file. You need to provide a hasher, which is a function that accepts a slice of Fields and returns a Field.
For merkle trees you also need to make `siblings` into a tuple `(Field, [Field])`, for the indexes and hash_path, respectively.

### Examples

A Merkle Tree:

```rust
use dep::trees::merkle::MerkleTree;
use dep::std::hash::pedersen_hash_slice;

fn hasher(leaves: [Field]) -> Field {
    pedersen_hash_slice(leaves)
}

fn main(
    entry: Field,
    paths: (Field, [Field; 1]))
{
    let mut mt = MerkleTree::new(hasher);

    let siblings = (paths.0, paths.1.as_slice());
    mt.add(entry, siblings);
    mt.membership(entry, siblings);
}
```

A Sparse Merkle Tree:

```rust
use dep::trees::sparse_merkle::SparseMerkleTree;
use dep::std::hash::pedersen_hash_slice;

fn hasher(leaves: [Field]) -> Field {
    pedersen_hash_slice(leaves)
}

fn main(entry: (Field, Field), siblings: [Field; 256]) {
    let mut tree2 = SparseMerkleTree::new(pedersen_hash_slice);

    tree2.non_membership(entry, (0, 0), [0; 256].as_slice());

    tree2.add(entry, siblings.as_slice());
    tree2.membership(entry, siblings.as_slice());
}
```

## Tests

This repository provides tests using pedersen, poseidon and poseidon2 hashes. To test them, `cd` into the folder and run `nargo test`.
