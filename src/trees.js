import {getAllFacts, getFact} from './facts.js'
import {Tree} from './tree.js'
const offlineDevMode = true;
console.log('trees.js imported')
const trees = {
}
getAllFacts((facts) => {
   Object.keys(facts).forEach((factId) => {
       console.log('factId ' + factId + ' has obj of ' + facts[factId])
    const tree = new Tree(factId, null)
       trees[tree.id] = tree;
   })
})
export function getAllTrees(success){
    if (offlineDevMode){
        success(trees)
    }
}
export class Trees {
    static getAll(success){
        console.log("TREES.JS: Trees.getAll called")
        if (offlineDevMode){
            success(trees)
        }
    }
    static get(treeId, success){
        success(treeId)
    }
}