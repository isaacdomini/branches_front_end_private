// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {injectable} from 'inversify';
import {
	IDbValable,
	IDetailedUpdates,
	IHash,
	ISubscribable,
	ISyncableMutableSubscribableContentUser,
} from '../interfaces';
import {MutableSubscribableContentUser} from './MutableSubscribableContentUser';

@injectable()
export class SyncableMutableSubscribableContentUser
	extends MutableSubscribableContentUser implements ISyncableMutableSubscribableContentUser {
	public getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IDbValable> {
		return {
			// TODO: change the property names from being harded coded to more like CONTENT_USER_PROPERTY_NAMES.OVERDUE
			overdue: this.overdue,
			timer: this.timer,
			lastRecordedStrength: this.lastEstimatedStrength,
			proficiency: this.proficiency,
			lastInteractionTime: this.lastInteractionTime,
			nextReviewTime: this.nextReviewTime,
		};
	}

	// TODO: should the below three objects be private?
}
