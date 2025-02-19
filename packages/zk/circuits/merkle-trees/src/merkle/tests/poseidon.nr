use crate::merkle::MerkleTree;
use dep::std::hash::poseidon::bn254::hash_2;

fn poseidon_hasher(leaves: [Field; 2]) -> Field {
    hash_2([leaves[0], leaves[1]])
}

#[test]
fn test_merkle_tree_membership() {
    let root = 0x1910f234d14bea7c640841c9fd0d765e8599a4cd527285590e4159e66b912be1;
    let mt = MerkleTree::from(root, poseidon_hasher);

    let leaf = 0x00;
    let paths = [0x01, 0x26059ac500f935d65bf50b096f757fe1dcb3568822d4e4cb7a8dc95f7bbd24f7, 0x04];

    mt.membership(leaf, 0x00, paths);
}

#[test]
fn test_merkle_tree_add() {
    let old_root = 0x1910f234d14bea7c640841c9fd0d765e8599a4cd527285590e4159e66b912be1;
    let mut mt = MerkleTree::from(old_root, poseidon_hasher);

    let leaf = 0x26059ac500f935d65bf50b096f757fe1dcb3568822d4e4cb7a8dc95f7bbd24f7;
    let paths = [0x1910f234d14bea7c640841c9fd0d765e8599a4cd527285590e4159e66b912be1];
    mt.add(leaf, 0x01, paths);
}

#[test]
fn test_merkle_tree_delete() {
    let old_root = 0x1e994ad2e1d1d8a4da2aed653184349f089ad06d16849b156c23634d2888a377;
    let mut mt = MerkleTree::from(old_root, poseidon_hasher);

    let leaf = 0x26059ac500f935d65bf50b096f757fe1dcb3568822d4e4cb7a8dc95f7bbd24f7;
    let paths = [0x1910f234d14bea7c640841c9fd0d765e8599a4cd527285590e4159e66b912be1];
    mt.delete(leaf, 0x00, paths);

    assert(mt.root == 0x1910f234d14bea7c640841c9fd0d765e8599a4cd527285590e4159e66b912be1);
}

#[test]
fn test_merkle_tree_update() {
    let old_root = 0x1e994ad2e1d1d8a4da2aed653184349f089ad06d16849b156c23634d2888a377;
    let mut mt = MerkleTree::from(old_root, poseidon_hasher);

    let old_leaf = 0x26059ac500f935d65bf50b096f757fe1dcb3568822d4e4cb7a8dc95f7bbd24f7;
    let leaf = 0xd98561fb02ca04d00801dfdc118b2a24cea0351963587712a28d368041370e1;
    let paths = [0x1910f234d14bea7c640841c9fd0d765e8599a4cd527285590e4159e66b912be1];
    mt.update(leaf, old_leaf, 0x00, paths);

    assert(
        mt.root
            == poseidon_hasher([
                0xd98561fb02ca04d00801dfdc118b2a24cea0351963587712a28d368041370e1,
                0x1910f234d14bea7c640841c9fd0d765e8599a4cd527285590e4159e66b912be1,
            ]),
    );
}
