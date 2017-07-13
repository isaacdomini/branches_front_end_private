import {Trees} from './trees.js'
import {Tree} from './tree.js'
import {Facts} from './facts.js'
import {Globals} from './globals.js'
import {Redux} from './redux.js'
var initialized = false;
var s,
    g = {
        nodes: [],
        edges: []
    };
window.g = g
window.s = s;

var newNodeXOffset = -100,
    newNodeYOffset = 100,
    newChildTreeSuffix = "__newChildTree";

// Generate a random graph:

var numTreesLoaded = 0;
loadTreeAndSubTrees(1)
// Instantiate sigma:
function loadTreeAndSubTrees(treeId){
    console.log('L25: 0loadTreeAndSubTrees just called')
    numTreesLoaded++;
    console.log('L27: 1num trees loaded is ', numTreesLoaded)
    Trees.get(treeId, function(tree){
        console.log("L29:TREESGRAPH.JS: Trees.get callback tree is", tree)
        Facts.get(tree.factId, function(fact){
            console.log("L31:TREESGRAPH.JS: Facts.get callback is this. fact is", fact)
            const node = {
                id: tree.id,
                parentId: tree.parentId,
                x: tree.x,
                y: tree.y,
                children: tree.children,
                label: fact.question + "  " + fact.answer,
                size: 1,
                color: Globals.existingColor,
                type: 'tree'
            }
            console.log("L43:TREESGRAPH.JS: right before g.nodes.push node is", node)
            g.nodes.push(node);
            addShadowNodeToTree(node)
            console.log("L46:TREESGRAPH.js nodess is ", g.nodes)
            if (tree.parentId) {
                const edge = {
                    id: tree.parentId + "__" + tree.id,
                    source: tree.parentId,
                    target: tree.id,
                    size: 1,
                    color: Globals.existingColor
                };
                console.log('L55:TREESGRAPH.JS Edge before push is', edge)
                g.edges.push(edge);
            }
            //temporary hacky solution because not all nodes were showing?? and s.refresh wasn't working as expected
            if (numTreesLoaded > 2){
                console.log('L60:num treesloaded is ', numTreesLoaded)
                initSigma()
            }
        })
        tree.children && tree.children.forEach((childId) => {
            loadTreeAndSubTrees(childId)
        })
    })
}

function addShadowNodeToTree(tree){
    if (tree.children) {
        console.log('THE TREE', tree,'HAS CHILDREN', tree.children)
    }
    console.log("add shadow node to tree")
    const shadowNode = {
        id: tree.id + newChildTreeSuffix, //"_newChildTree",
        parentId: tree.id,
        x: parseInt(tree.x) + newNodeXOffset,
        y: parseInt(tree.y) + newNodeYOffset,
        label: 'Create a new Fact',
        size: 1,
        color: Globals.newColor,
        type: 'newChildTree'
    }
    const shadowEdge = {
        id: tree.id + "__" + shadowNode.id,
        source: tree.id,
        target: shadowNode.id,
        size: 1,
        color: Globals.newColor
    };
    console.log('g.nodes before push is ', g.nodes)
    if (!initialized) {
        g.nodes.push(shadowNode)
        g.edges.push(shadowEdge)
    } else {
       s.graph.addNode(shadowNode)
       s.graph.addEdge(shadowEdge)
    }
    console.log('g.nodes after push is ', g.nodes)
    if (initialized){
        s.refresh()
    }
}
function initSigma(){
    if (!initialized){
        sigma.renderers.def = sigma.renderers.canvas
        s = new sigma({
            graph: g,
            container: 'graph-container'
        });
        window.s = s;
        var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
        s.refresh();

        s.bind('clickNode', function(e) {
            console.log('event is e', e)
            console.log(e.type, e.data.node, e.data.node.label, e.data.captor);
            let parentId = e.data.node.parentId;
            console.log('new line')
            console.log('new line')
            console.log('new line')
            if (e.data.node.type == 'tree'){

            }
            // let parentTreeId = e.data.node.id.substring(0,e.data.node.id.indexOf("_"));
            console.log('parent tree id selected was', parentId)
            document.querySelector("#parentTreeId").value = parentId
            Globals.currentTreeSelected = parentId;
            console.log('g nodes is', g.nodes)
        });
        initialized = true;
    }
}

//returns sigma tree node
export function addTreeToGraph(parentTreeId, fact) {
    //1. delete current addNewNode button
    var currentNewChildTree = s.graph.nodes(parentTreeId + newChildTreeSuffix);
    console.log('currentNewChildTree is', currentNewChildTree)
    var newChildTreeX = currentNewChildTree.x;
    var newChildTreeY = currentNewChildTree.y;
    var tree = new Tree(fact.id, parentTreeId)
    //2. add new node to parent tree
    const newTree = {
        id: tree.id,
        parentId: parentTreeId,
        x: parseInt(currentNewChildTree.x),
        y: parseInt(currentNewChildTree.y),
        children: tree.children,
        label: fact.question + ' ' + fact.answer,
        size: 1,
        color: Globals.existingColor,
        type: 'tree'
    }

    s.graph.dropNode(currentNewChildTree.id)
    s.graph.addNode(newTree);
    //3. add edge between new node and parent tree
    const newEdge = {
        id: parentTreeId + "__" + newTree.id,
        source: parentTreeId,
        target: newTree.id,
        size: 1,
        color: Globals.existingColor
    }
    s.graph.addEdge(newEdge)
    //4. add shadow node
    console.log('num nodes bfor add shadow node is ', s.graph.nodes())
    addShadowNodeToTree(newTree)
    Trees.get(parentTreeId, function(parentTree){
        addShadowNodeToTree(parentTree)
    })
    console.log('num nodes after add shadow node is ', s.graph.nodes())
    s.refresh();
    return newTree;
}