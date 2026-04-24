const processData = (data) => {
    let invalid_entries = [];
    let duplicate_edges = [];
    let valid_edges = [];
    
    const regex = /^([A-Z])->([A-Z])$/;
    let seenEdges = new Set();
    
    // 1. Validate Input & Handle Duplicates
    for (let item of data) {
        if (typeof item !== 'string') {
            invalid_entries.push(item);
            continue;
        }

        const trimmed = item.replace(/\s+/g, '');
        const match = trimmed.match(regex);
        
        if (!match) {
            invalid_entries.push(item);
            continue;
        }
        
        const u = match[1];
        const v = match[2];
        
        if (u === v) {
            invalid_entries.push(item); // Reject self-loops
            continue;
        }
        
        let canonical = `${u}->${v}`;
        if (seenEdges.has(canonical)) {
            duplicate_edges.push(item);
            continue;
        }
        
        seenEdges.add(canonical);
        valid_edges.push({ u, v, original: item });
    }
    
    // 2. Construct Hierarchical Trees & Detect roots
    let nodes = new Set();
    let adj = {}; 
    let parentMap = {}; 
    
    for (const { u, v } of valid_edges) {
        nodes.add(u);
        nodes.add(v);
        if (!adj[u]) adj[u] = [];
        
        // If multiple parents, keep only the first valid parent
        if (parentMap[v] && parentMap[v] !== u) {
            continue;
        }
        
        parentMap[v] = u;
        adj[u].push(v);
    }
    
    // Find absolute roots (Nodes that never appear as children)
    let roots = [];
    for (let node of nodes) {
        if (!parentMap[node]) {
            roots.push(node);
        }
    }
    
    // 3. Process Trees, DFS Cycle Detection, Calculate Depths
    let total_trees = 0;
    let total_cycles = 0;
    let largest_tree_root = null;
    let max_depth = 0;
    let hierarchies = [];
    let visitedNodes = new Set();

    function buildTreeAndCheckCycle(startNode) {
        let visiting = new Set();
        let hasCycle = false;
        
        function dfs(node) {
            if (visiting.has(node)) {
                hasCycle = true;
                return { tree: {}, depth: 0 };
            }
            if (visitedNodes.has(node)) {
                return { tree: {}, depth: 0 }; // Handle edge overlaps cleanly
            }
            
            visiting.add(node);
            visitedNodes.add(node);
            
            let subtree = {};
            let maxChildDepth = 0;
            
            if (adj[node]) {
                for (let child of adj[node]) {
                    let childResult = dfs(child);
                    if (hasCycle) return { tree: {}, depth: 0 }; // Short-circuit propagation
                    
                    subtree[child] = childResult.tree;
                    maxChildDepth = Math.max(maxChildDepth, childResult.depth);
                }
            }
            
            visiting.delete(node);
            return { tree: subtree, depth: maxChildDepth + 1 };
        }
        
        let res = dfs(startNode);
        return { 
            tree: hasCycle ? {} : { [startNode]: res.tree }, 
            hasCycle, 
            depth: res.depth 
        };
    }

    // Process all identified roots
    for (let root of roots) {
        let { tree, hasCycle, depth } = buildTreeAndCheckCycle(root);
        
        if (hasCycle) {
            total_cycles++;
            hierarchies.push({ tree: {}, has_cycle: true });
        } else {
            total_trees++;
            hierarchies.push({ tree, depth });
            
            // Track largest tree root based on max depth and lexicographical order
            if (depth > max_depth || 
               (depth === max_depth && largest_tree_root && root < largest_tree_root) || 
               (depth === max_depth && !largest_tree_root)) {
                max_depth = depth;
                largest_tree_root = root;
            }
        }
    }
    
    // 4. Checking for isolated cycles (Components with no roots)
    let unvisitedNodes = Array.from(nodes).filter(n => !visitedNodes.has(n));
    while (unvisitedNodes.length > 0) {
        let start = unvisitedNodes[0];
        
        total_cycles++;
        hierarchies.push({ tree: {}, has_cycle: true });
        
        let componentStack = [start];
        while (componentStack.length > 0) {
            let curr = componentStack.pop();
            visitedNodes.add(curr);
            if (adj[curr]) {
                adj[curr].forEach(child => {
                    if (!visitedNodes.has(child)) componentStack.push(child);
                });
            }
        }
        
        unvisitedNodes = Array.from(nodes).filter(n => !visitedNodes.has(n));
    }

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
};

module.exports = { processData };
