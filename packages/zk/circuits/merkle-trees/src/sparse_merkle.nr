use crate::{MembershipProver, Modifier, NonMembershipProver, SMT_Creator};

mod tests;
mod tree;

pub struct SparseMerkleTree {
    root: Field,
    leaf_hasher: fn([Field; 3]) -> Field,
    hasher: fn([Field; 2]) -> Field,
}

impl SMT_Creator for SparseMerkleTree {
    fn default(
        root: Field,
        leaf_hasher: fn([Field; 3]) -> Field,
        hasher: fn([Field; 2]) -> Field,
    ) -> Self {
        Self { root, leaf_hasher, hasher }
    }
}

impl MembershipProver<(Field, Field), Field, Field> for SparseMerkleTree {
    fn membership<let N: u32>(self, entry: (Field, Field), indexes: Field, hash_path: [Field; N]) {
        let mut calculated_root: Field = 0;

        // membership proof: the root is calculated based on the entry, the siblings,
        // and the path determined by the key of entry through consecutive hashing
        calculated_root = self.calculate_root(entry, indexes, hash_path);

        assert(calculated_root == self.root);
    }
}

impl NonMembershipProver for SparseMerkleTree {
    fn non_membership(
        self,
        entry: (Field, Field),
        matching_entry: (Field, Field),
        siblings: [Field; 256],
    ) {
        if (self.root != 0) {
            // non-membership proof: the root is calculated based on the matching_entry, the siblings
            // and the path that is determined by the key of entry. This makes sure that matching_entry is in fact
            // a matching entry for entry meaning that it shares the same first bits as path
            let mut calculated_root = self.calculate_root(matching_entry, entry.0, siblings);
            assert(calculated_root == self.root);
        }
    }
}

impl Modifier<(Field, Field), Field, Field> for SparseMerkleTree {
    fn add<let N: u32>(
        &mut self,
        new_entry: (Field, Field),
        indexes: Field,
        hash_path: [Field; N],
    ) {
        // if the root node is zero the first leaf is added to the tree in which case
        // the new root equals H(k,v,1)
        // otherwise the correctness of the old root is validated based on the siblings after which
        // the new root is calculated and returned
        if (self.root == 0) {
            self.root = (self.leaf_hasher)([new_entry.0, new_entry.1, 1]);
        } else {
            let (old, new) = self.calculate_two_roots(new_entry, new_entry.0, hash_path);
            assert(old == self.root);
            self.root = new;
        }
    }

    fn delete<let N: u32>(&mut self, entry: (Field, Field), indexes: Field, hash_path: [Field; N]) {
        // proves membership of entry in the old root, then calculates and returns the new root
        let (new, old) = self.calculate_two_roots(entry, indexes, hash_path);
        assert(old == self.root);
        self.root = new;
    }

    fn update<let N: u32>(
        &mut self,
        new_value: Field,
        old_entry: (Field, Field),
        indexes: Field,
        hash_path: [Field; N],
    ) {
        let key = old_entry.0;
        let old_value = old_entry.1;
        // both the old entry and new entry share the same key that is used to calculate the path
        let path: [u1; N] = key.to_be_bits();

        // old_parent is a container to temporarily store the nodes that ultimately lead to the OLD root
        let mut old_parent: Field = (self.leaf_hasher)([key, old_value, 1]);
        // new_parent is a container to temporarily store the nodes that ultimately lead to the NEW root
        let mut new_parent: Field = (self.leaf_hasher)([key, new_value, 1]);
        // starting from the bottom of the tree, for each level it checks whether there is a sibling and if
        // that is the case, it hashes the two containers with the sibling and updates the containers with the
        // resulting hashes until the uppermost level is reached aka the root node
        for i in 0..hash_path.len() {
            let sibling = hash_path[i];
            if sibling != 0 {
                if path[i] == 0 {
                    new_parent = (self.hasher)([new_parent, sibling]);
                    old_parent = (self.hasher)([old_parent, sibling]);
                } else {
                    new_parent = (self.hasher)([sibling, new_parent]);
                    old_parent = (self.hasher)([sibling, old_parent]);
                }
            }
        }
        assert(old_parent == self.root);
        self.root = new_parent;
    }
}
