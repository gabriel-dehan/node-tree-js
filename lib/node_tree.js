/**
 * Tree class, a tree shall be constructed with an array of objects like this :
 * TODO: Give details
 * [{
         root          : true,
         is_dir        : 1,
         owner         : name.capitalize(),
         users         : [name.capitalize()],
         name          : 'Project name, Directory Name'
         _id           : 1,
         created_at    : `timestamp`,
         last_modified : `timestamp`,
         tree          : [
                             {
                                 is_dir        : 0,
                                 _id           : 2,
                                 name          : 'leaf1',
                                 created_at    : `timestamp`,
                                 last_modified : `timestamp`,
                             },
                             {
                                 is_dir        : 1,
                                 _id           : 3,
                                 name          : 'branch1',
                                 created_at    : `timestamp`,
                                 last_modified : `timestamp`,
                                 tree          : [ { ... } ]
                             },
                             { ... }
                         ]
    }]
 * @type {*}

 */
var NodeTree = function(tree) {
    this.tree = tree;
    this.root = this.tree[0]
    this.count = this.count_nodes(0);
    this.owner = this.get_owner();
    this.users = this.root.users;
};

/**
 * Get tree owner
 * @param tree
 */
NodeTree.prototype.get_owner = function() {
    var first = this.tree[0];
    // If first element of tree is root (we are on a regular DocumentTree)
    if ( first.root ) {
        return first.owner;
        // Else there is no real owner
    } else {
        return 'Anonymous';
    }
};


/**
 * Get the path to a current Node
 * @param node_id
 * @param tree
 * @return {string} path
 */
NodeTree.prototype.get_path = function(node_id, tree){
    var that = this,
        node = that.fetch_node(node_id),
        path = [node.name];

    while (node.root === undefined) {
        node = that.fetch_parent(node._id)
        path.push(node.name);
    }

    path = _.filter(path, Boolean).reverse()

    return path;
};

/**
 * Delete all nodes of root
 * @return {Boolean}
 */
NodeTree.prototype.delete_all = function() {
    var first = this.tree[0];
    if ( first.root ) {
        first.tree = [];
        return true;
    } else {
        return false;
    }
};

/**
 * Count recursively the nodes of a tree
 * @param {number} count
 * @param {object} tree
 */
NodeTree.prototype.count_nodes = function(count, tree) {
    var that = this;
    if ( tree === undefined ) tree = that.tree;
    if ( count === undefined ) count = 0;

    _.each(tree, function(node){
        if ( node.is_dir ) {
            count = that.count_nodes( count, node.tree );
        }
        count++;
    });
        return count;
};

/**
 * Insert a node into the tree
 * @param node_to_insert
 * @param node_id
 * @param tree
 */
NodeTree.prototype.insert = function(node_to_insert, node_id, tree){
    var that = this;
    if ( tree === undefined ) tree = that.tree;

    _.each(tree, function(node){
        if ( node.is_dir ) {
            /* No strict equality as node_id can be a string */
            if ( node_id == node._id ) {
                node.tree.push( node_to_insert );
            } else if ( node.is_dir ) {
                that.insert( node_to_insert, node_id, node.tree );
            }
        }
    });
};

/**
 * Delete a node from the tree
 * @param node_id
 * @param tree
 * @return {object} deleted The deleted node
 */
NodeTree.prototype.delete = function(node_id, tree){
    var that = this;
    var deleted = null;
    if ( tree === undefined ) tree = that.tree;

    _.each(tree, function(node, i){
        /* No strict equality as node_id can be a string */
        if ( node_id == node._id ) {
            console.log(tree);
            that._arrayRm(tree, i);
            deleted = node;
        }
        if ( node.is_dir ) {
            /* If deleted has already been defined, we stop the recursion and return the result */
            deleted = deleted ? deleted : that.delete( node_id, node.tree );
        }
    });

    return deleted;
};

NodeTree.prototype._arrayRm = function(arr, from, to) {
    var rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = from < 0 ? arr.length + from : from;
    return arr.push.apply(arr, rest);
};

/**
 * Move a node
 * @param node_id
 * @param destination_id
 * @return {Boolean}
 */
NodeTree.prototype.move = function(node_id, destination_id){
    /* We check if the node is the same as the destination node,
     * and if we are trying to move a node inside one of it's own directories
     */
    if ( node_id !== destination_id && !this.tree_contains(node_id, destination_id) ) {
        this.insert( this.delete(node_id), destination_id );
        return true;
    } else {
        return false;
    }
};

/**
 * Check if a node is inside a tree or a subtree
 * @param container_id
 * @param node_id
 * @return {Boolean}
 */
NodeTree.prototype.tree_contains = function(container_id, node_id){
    var container = this.fetch_node(container_id);

    // If the container has a tree (is a directory)
    if ( container.tree ) {
        // If we find the node in the container tree
        if( this.fetch_node( node_id, container.tree ) )
            return true
    }
    return false;
};

/**
 * Fetch a node
 * @param node_id
 * @param tree
 */
NodeTree.prototype.fetch_node = function(node_id, tree) {
    var that = this;
    var _node = null;
    if ( tree === undefined ) tree = that.tree;

    _.each(tree, function(node){

        /* No strict equality as node_id can be a string */
        if ( node_id == node._id ) {
            _node = node;
        }
        if ( node.is_dir ) {
            /* If deleted has already been defined, we stop the recursion and return the result */
            _node = _node ? _node : that.fetch_node( node_id, node.tree );
        }
    });

    return _node;
};

/**
 * Fetch parent for a node
 * @param node_id
 * @return {Boolean}
 */
NodeTree.prototype.fetch_parent = function(node_id, container){
    var that   = this,
    parent = null;
    // TODO: Don't user that.tree[0] because we want to handle other root trees
    if ( container === undefined ) container = that;

    _.each(container.tree, function(node) {
        if ( node_id == node._id ) {
            parent = container;
        }
        if ( node.is_dir )
            parent = parent ? parent : that.fetch_parent( node_id, node );
    });

    return parent;
};

/**
 * Add or remove a user recursively to a node or directories and subdirectories
 * @param {Boolean} true for add, false for remove
 * @param user_name
 * @param node_id
 * @param tree
 */
NodeTree.prototype.toggle_user = function(add, user_name, node_id, tree) {
    var that = this;
    if ( node_id ) {
        _node = this.fetch_node(node_id);
        that.user_toggle(add, _node, user_name);
        var is_dir = _node.is_dir;
    } else {
        var is_dir = true;
    }

    if ( is_dir ){
        if ( tree === undefined ) tree = _node.tree;
        _.each(tree, function(node){
            that.user_toggle(add, node, user_name);
            if ( node.is_dir ) {
                that.toggle_user(add, user_name, null, node.tree);
            }
        });
    }
};

NodeTree.prototype.user_toggle =  function(add, node, user_name) {
    if( add && !_.contains(node.users, user_name) ) {
        node.users.push(user_name);
    } else if ( !add ) {
        node.users = _.without(node.users, user_name);
    }
};

/**
 * Checks if node name already exists in the chosen node
 * @param name
 * @param node_id
 */
NodeTree.prototype.name_exists = function(node_or_id, parent_id) {
    var _node;
    if ( typeof node_or_id === 'object' )
        _node = node_or_id;
    else
        _node = this.fetch_node( node_or_id );

    var name  = _node.name,
    is_dir    = _node.is_dir,
    directory = this.fetch_node( parent_id ),
    exists    = false;

    if ( directory.is_dir ) {
        _.each(directory.tree, function(node){
            if( ( name === node.name) && ( is_dir == node.is_dir )) {
                    exists = true;
                return;
            }
        });
    }
    return exists;
};

NodeTree.prototype.node_exists = function(node_id, parent_id){
    var directory = this.fetch_node( parent_id );
    var exists    = false;
    if ( directory.is_dir ) {
        _.each(directory.tree, function(node){
            if( node._id == node_id ) {
                exists = true;
                return;
            }
        });
    }
    return exists;
};

/**
 * Text display for a tree
 * @param depth
 * @param tree
 */
NodeTree.prototype.to_string = function(padding, depth, tree, result){
    var name = '';
    var that = this;
    if ( tree === undefined ) tree = that.tree;
    if ( padding === undefined ) padding = 2;
    if ( depth === undefined ) depth = 0;
    if ( result === undefined ) result = '';

    if ( depth === 0 ) {
        result += '/'
    }

    _.each(tree, function(node){
        name = '';
        if ( depth > 0 )
            name += that._str_times(' ', depth * padding );

        name += node.name;

        if ( node.is_dir ) {
            name += '/';
        }

        result += name + "\n";
        if ( node.is_dir ) {
            result += that.to_string( padding, depth + 1, node.tree );
        }
    });

    return result;
};

NodeTree.prototype._str_times = function(str, n) {
    return (new Array(n+1)).join(str);
};

/**
 * Returns a HTML string representing the tree
 * @param depth
 * @param tree
 * @param result
 * @return {string} result HTML Representation of tree
 */
NodeTree.prototype.to_html = function(depth, tree, result){
    var that = this;
    if ( tree   === undefined ) tree = that.tree;
    if ( result === undefined ) result = '<ul id="root">';

    _.each(tree, function(node){
        result += '<li>';

        if ( node.is_dir ) {
            result += '<span class="dir-name">' + node.name + '/</span>';
            result += '<ul class="dir">';
            result = that.to_html( depth + 1, node.tree, result );
            result += '</ul>';
        } else {
            result += '<span class="file-name">' + node.name + '</span>';
        }
        result += '</li>';
    });

    if (depth == 0)
        return result + '</ul>';
    else
        return result + '</li>';
};
