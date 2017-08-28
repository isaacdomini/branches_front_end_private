import md5 from 'md5';
import user from './user'
import firebase from './firebaseService'
import {Trees} from './trees'
import merge from 'lodash.merge'
import ContentItem from './contentItem'// from './firebaseService'
export class Fact extends ContentItem {
  //constructor is used when LOADING facts from db or when CREATING facts from Facts.create
  constructor (args /*= {question, answer, id, userTimeMap, initialParentTreeId}*/){
      // if (initialParentTreeId){
      //     super({initialParentTreeId})
      // } else {
      //     super()
      // }
    super(args)
    this.type = 'fact'
    this.question = args.question && args.question.trim();
    this.answer = args.answer && args.answer.trim();
    this.id = args.id || md5(JSON.stringify({question: this.question, answer: this.answer}));

    if(window.facts && !window.facts[id]) window.facts[id] = this; //TODO: john figure out what this does

    super.init()
  }

  //bc certain properties used in the local js object in memory, shouldn't be stored in the db

    getURIAddition(){
      return "/" +encodeURIComponent(this.question + ":" + this.answer)
    }
    getDBRepresentation(){
        var baseRep = super.getDBRepresentation()

        return merge(baseRep,
         {
            id: this.id,
            question: this.question,
            answer: this.answer,
            type: this.type,
         }
        )
    }
}
