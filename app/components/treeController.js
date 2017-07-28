import {newTree} from '../objects/newTree.js';
import {removeTreeFromGraph} from "./treesGraph"
import {Trees} from '../objects/trees.js'
//import {Facts} from '../objects/facts.js'
import {ContentItem} from "../objects/contentItem";
import {Fact} from "../objects/fact";
import {toggleVisibility} from "../core/utils"

//hacky controller solution for now - as i haven't yet figured out how to (or tried to ) place an angular component inside of a sigmajs/linkurious rendered template on the HTML5 canvas
const treeCtrl = {
    editFactOnTreeFromEvent : function (event) {
        const treeNewFactDom = event.target.parentNode;
        var question = treeNewFactDom.querySelector('.tree-new-fact-question').value;
        var answer = treeNewFactDom.querySelector('.tree-new-fact-answer').value;
        var treeId = treeNewFactDom.querySelector('.tree-id').value;
        //1. create new fact
        var fact=
            ContentItem.create(new Fact(
                question,
                answer
                )
            );
        //2.link new fact with current tree
        fact.addTree(treeId);
        Trees.get(treeId).then( tree => tree.changeTreeContent(fact.id, fact.type));

        //3.update UI source for question and fact
        var sigmaNode = s.graph.nodes().find(node => node.id == treeId)
        sigmaNode.fact = fact;
        s.refresh();

        //4. close the edit functionality
        const treeFactDom = treeNewFactDom.parentNode
        window.treeCtrl.toggleEditGivenTreeFactDom(treeFactDom)

        //5. ^^3 and 4 don't seem to be working. Workaround below:

        alert('Fact updated. Refresh the page to see changes')
    },
    toggleEditGivenTreeFactDom: function(treeFactDom){
        let treeCurrentFactDom = treeFactDom.querySelector('.tree-current-fact');
        let treeNewFactDom = treeFactDom.querySelector('.tree-new-fact');
        toggleVisibility(treeCurrentFactDom)
        toggleVisibility(treeNewFactDom)
    },
    toggleEdit: function(event){
        const factEditDom = event.target.parentNode;
        window.treeCtrl.toggleEditGivenTreeFactDom(factEditDom);
    },
    continueTimer: function(event){
        let factDom = event.target.parentNode;
        let factId = factDom.querySelector('.tree-current-fact-id').value;
        ContentItem.get(factId).then(fact => {
            if (fact.contentType === 'fact') {
                let content = window.facts[fact.id] || new Fact(fact.question, fact.answer, fact.id);
                content.continueTimer();
            }
        });
    },
    pauseTimer: function(event) {
        let factDom = event.target.parentNode;
        let factId = factDom.querySelector('.tree-current-fact-id').value;
        ContentItem.get(factId).then(fact => {
            if (fact.contentType === 'fact') {
                let content = window.facts[fact.id] || new Fact(fact.question, fact.answer, fact.id);
                content.pauseTimer();
            }
        });
    },
        deleteTree : function (event) {
        let deleteTreeForm = event.target.parentNode;
        let treeId = deleteTreeForm.querySelector('.tree-id').value;
        //1.Remove Tree and subtrees from graph
        removeTreeFromGraph(treeId).then(() => s.refresh());
        //2. remove the tree's current parent from being its parent
        Trees.get(treeId).then(tree => {
            tree.unlinkFromParent()
        })
    }
}
//accessible in Mustache template via window
window.treeCtrl = treeCtrl
