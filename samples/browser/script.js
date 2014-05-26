/* Just trying part of the API */

function assert_eq(result, data) {
    console.log(result, data);
    console.log(_.isEqual(result, data));
}

var tree = new NodeTree(test_tree);

console.log(document.querySelector('body').innerHTML = tree.to_html());
console.log(tree.to_html());
/* Properties */
assert_eq(tree.root, test_tree[0])
assert_eq(tree.tree, test_tree)
assert_eq(tree.owner, "Gabriel Dehan")
assert_eq(tree.users, "Gabriel, John")
assert_eq(tree.count, 11)

/* Methods */
assert_eq(tree.count_nodes(), 11)

assert_eq(tree.get_owner(), "Gabriel Dehan")
assert_eq(tree.get_path(8), ["NodeTree", "Dir 2", "Subdir", "File 3"])


/* Insert */
tree.insert({
    "is_dir"        : 0,
    "_id"           : tree.count_nodes() + 1,
    "name"          : "Dir 3",
    "created_at"    : "2013-14-04",
    "last_modified" : "2012-14-04"
}, 4)

assert_eq(tree.count_nodes(), 12)

/* Delete */
tree.delete(12)
assert_eq(tree.count_nodes(), 11)

/* Delete all */
tree.delete_all()
assert_eq(tree.root.tree, [])
