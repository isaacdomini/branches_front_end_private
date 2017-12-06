// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    ISubscribableTreeLocation, ISubscribableUndoableMutablePoint,
    ITreeLocationData,
    IValUpdates,
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types'

@injectable()
class SubscribableTreeLocation extends Subscribable<IValUpdates> implements ISubscribableTreeLocation {
    private publishing = false
    public point: ISubscribableUndoableMutablePoint

    // TODO: should the below three objects be private?
    public val(): ITreeLocationData {
        return {
            point: this.point.val()
        }
    }
    constructor(@inject(TYPES.SubscribableTreeLocationArgs) {
        updatesCallbacks, point,
    }) {
        super({updatesCallbacks})
        this.point = point
    }
    // TODO: make IValUpdates a generic that takes for example ITreeLocationData
    protected callbackArguments(): IValUpdates {
        return this.val()
    }
    public startPublishing() {
        if (this.publishing) {
            return
        }
        this.publishing = true
        const boundCallCallbacks = this.callCallbacks.bind(this)
        this.point.onUpdate(boundCallCallbacks)
    }
}

@injectable()
class SubscribableTreeLocationArgs {
    @inject(TYPES.Array) public updatesCallbacks
    @inject(TYPES.ISubscribableUndoableMutablePoint) public point: ISubscribableUndoableMutablePoint
}

export {SubscribableTreeLocation, SubscribableTreeLocationArgs}
