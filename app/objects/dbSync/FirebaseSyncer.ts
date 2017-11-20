import {ISubscribable} from '../ISubscribable';
import {IDbSyncable} from './IDbSyncable';
import {IFirebaseRef} from './IFirebaseRef';
import {IUpdates} from './IUpdates';

class FirebaseSyncer implements IDbSyncable {
    private firebaseRef: IFirebaseRef
    constructor({firebaseRef}) {
        this.firebaseRef = firebaseRef
    }
    public save(updates: IUpdates) {
        this.firebaseRef.update(updates.updates)
        const pushes = updates.push
        for (const [arrayName, pushedValue] of Object.entries(pushes)) {
            this.firebaseRef
                .child(arrayName)
                .push(pushedValue) // TODO: fix violation of Law of Demeter
        }
    }

    public subscribe(obj: ISubscribable) {
        const me = this
        obj.onUpdate(updates => {
            me.save(updates)
        })
    }
}
