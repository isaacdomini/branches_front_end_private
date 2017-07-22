import {Fact} from './fact.js'
import getFirebase from './firebaseService.js'
//TODO Replace a lot of this with the Trees.js or Tree.js ORM
function writeNewFact(fact) {
    const firebase = getFirebase();
    var updates = {};
    updates['/facts/' + fact.id] = fact;
    firebase.database().ref().update(updates);
}
export function newFact(question, answer, treeId){
    var fact = new Fact(question, answer, treeId)
    writeNewFact(fact)
    return fact;
}
