# Node Tree JS
A simple node Tree Javascript explorer, primarily designed for Files and Folders hierarchies.

`nodetreejs -v 1.1.0`

## How do I get it ?

TODO

## What is it for ?

node_tree.js will provide you with a simple interface to access and modify a hierarchical tree of nodes. An instance of such a tree is a files and directories tree :

```
- /
  - Documents/
    - hello.doc
    - world.doc
  - Images
    - tree.jpg
  - file.txt
```

NodeTree provides a class for you to use to move, rename, access any element in a given tree.
Hence you must provide the class with a javascript object. This object must have a specific structure. See the Data structure section for more information.

## This seems crispy, how do I use it ?

TODO

## Data structure

For a data structure sample, see `samples/tree/data.json`

A tree is defined as follow :
* An `Array` of `Objects` containing **one** _root_ object.
* A _root_ object, containing a `tree` property.
* A tree is an `Array` of nodes (`Objects`), described as follow :
  * A bunch of attributes (id, name, timestamps...)
  * An `is_dir` flag (`true`|`false`)
  * If the node **is a dir** then it must contain a `tree` property, itself embedding an array of nodes, which can either be tree nodes (`is_dir: true`) or leaf nodes (`is_dir: false`) and so on and so on.
  * If the node **is not a dir** then it must **not** contain a `tree` property.

Note that there are **two** types of nodes : leaf nodes and tree nodes. Tree nodes are nodes that can contain other (such as directories) whilst leaf nodes are at the end of a "branch", they can't contain other nodes but withhold information (such as files).

### Node attributes

#### Root node

```json
[{
    "root"          : true,
    "is_dir"        : <Boolean (1,0,true, false)>,
    "owner"         : <String>,
    "users"         : <String> (comma separated),
    "name"          : <String>,
    "_id"           : <String> | <Integer>,
    "created_at"    : <String> | <Date>,
    "last_modified" : <String> | <Date>,
    "tree"          : <Array of Tree nodes or Leaf nodes>
}]
```

#### Generic nodes

##### Leaf node

```json
    {
        "is_dir"        : 0,
        "_id"           : <String> | <Integer>,
        "name"          : <String>,
        "created_at"    : <String> | <Date>,
        "last_modified" : <String> | <Date>
    }
```

##### Tree node
```json
    {
        "is_dir"        : 1,
        "_id"           : 2,
        "name"          : "File 1",
        "created_at"    : <String> | <Date>,
        "last_modified" : <String> | <Date>,
        "tree"          : <Array of Tree nodes or Leaf nodes>
    }
```

## API

The NodeTree class provides a crispy interface for you to use.

### Attributes

| Name          | Description                                                    | \<Value Type\>                 |
| ------------- |:--------------------------------------------------------------:| ----------------------------:|
| tree          | The tree object you originaly passed to the constructor        | Object                       |
| count         | The number of nodes in the array                               | Integer                      |
| owner         | The current owner of the tree if set, otherwise "Anonymous"    | String                       |
| users         | A list of users previously set when defining the tree          | String (Comma separated)     |

### Methods

| Name          | Arguments         | Description                                                                 | \<Type\> Return value |
|:-------------:|-------------------|-----------------------------------------------------------------------------|-----------------------|
| get_owner     |                   | Gets the current owner of the tree if set, otherwise "Anonymous"            | \<String\> The owner  |
| get_path      | node_id           | Gets the path to a given node, using nodes name attributes (ex: "/dir1/dir2/leaf") | <String> The path to the node |
| delete_all    |                   | Delete all nodes in the root tree                                           | \<Boolean\> Success or Failure (True|False)  |
| count_nodes   |                   | Count all the nodes in the tree                                             | \<Integer\> The node count      |
| insert        | new_node, node_id | Inserts `new_node` in the tree node with id `node_id`                       | \<Nothing\>           |
| delete        | node_id           | Delete the node with `node_id` from the tree                                | \<Object\> The deleted node |
| move          | node_id, destination_id | Move the node with `node_id` into the tree node with `destination_id` | \<Boolean\> Success or Failure (True|False) |
| tree_contains | container_id, node_id | Checks if the tree node with `container_id` contains the node with `node_id` | <Boolean> True or False |
| fetch_node    | node_id           | Get the node with `node_id` from the tree                                   | \<Object\> The node |
| fetch_parent  | node_id           | Get the parent of the node with `node_id` from the tree                     | \<Object\> The node |
| toggle_user   | add, user_name, node_id | Add or remove a user from a node (param add : true to add a user, false to  remove it)                      | <Object> The node |
| name_exists   | name, node_id     | Checks if node name already exists in the node with `node_id`               | \<Boolean\> True or False  |
| node_exists   | node_id, parent_id | Checks if the node with `node_id` exists in the parent node `node_id`      | \<Boolean\> True or False  |
| to_string     |                   | Returns a string reprensentation of the tree hierarchy                      | \<String\> The tree  |
| to_html       |                   | Returns an HTML reprensentation of the tree hierarchy                       | \<String\> The tree  |

## Change logs

`v 1.1.0` ~ latest
* First Release
* Doc
* Fixes

`v 1.0.0` ~ 1 month ago
* Prototype based inheritance
* New functionalities (Move, Get path)

`v 0.1.0` ~ 2 years ago
* Tree.js basecode
