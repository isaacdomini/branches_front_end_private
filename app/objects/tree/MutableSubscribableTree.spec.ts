import test
	from 'ava';
import {expect} from 'chai';
import * as sinon
	from 'sinon';
import {
	CONTENT_ID3,
	TREE_ID3
} from '../../testHelpers/testHelpers';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {
	FieldMutationTypes,
	IDatedMutation,
	IProppedDatedMutation,
	TreePropertyNames
} from '../interfaces';
import {MutableSubscribableStringSet} from '../set/MutableSubscribableStringSet';
import {MutableSubscribableTree} from './MutableSubscribableTree';
import {SubscribableTree} from './SubscribableTree';
import {sampleDatedFieldMutation} from '../mutations/mutationTestHelpers';

test('MutableSubscribableTree:::a mutation in one of the subscribable properties' +
	' should publish an update of the entire tree\'s value '
	+ ' after startPublishing has been called', (t) => {

	const contentId = new MutableSubscribableField<string>();
	const parentId = new MutableSubscribableField<string>();
	const children = new MutableSubscribableStringSet();
	const TREE_ID = 'efa123';
	const tree = new MutableSubscribableTree({
		updatesCallbacks: [],
		id: TREE_ID,
		contentId,
		parentId,
		children
	});
	tree.startPublishing();

	const callback = sinon.spy();
	tree.onUpdate(callback);

	const sampleMutation = sampleDatedFieldMutation;
	contentId.addMutation(sampleMutation);
	const newTreeDataValue = tree.val();
	const calledWith = callback.getCall(0).args[0];
	expect(callback.callCount).to.equal(1);
	expect(calledWith).to.deep.equal(newTreeDataValue);
	t.pass();
});
test('MutableSubscribableTree:::a mutation in one of the subscribable properties' +
	' should NOT publish an update of the entire branchesMap\'s value'
	+ ' before startPublishing has been called', (t) => {

	const contentId = new MutableSubscribableField<string>();
	const parentId = new MutableSubscribableField<string>();
	const children = new MutableSubscribableStringSet();
	const TREE_ID = 'efa123';
	const tree = new SubscribableTree({
		updatesCallbacks: [],
		id: TREE_ID,
		contentId,
		parentId,
		children
	});

	const callback = sinon.spy();
	tree.onUpdate(callback);

	const sampleMutation = sampleDatedFieldMutation;
	contentId.addMutation(sampleMutation);
	expect(callback.callCount).to.equal(0);
	t.pass();
});
test('MutableSubscribableTree:::addMutation ' +
	' should call addMutation on the appropriate descendant property' +
	'and that mutation called on the descendant property should no longer have the propertyName on it', (t) => {

	const contentId = new MutableSubscribableField<string>();
	const parentId = new MutableSubscribableField<string>();
	const children = new MutableSubscribableStringSet();
	const TREE_ID = TREE_ID3;
	const tree = new MutableSubscribableTree({
		updatesCallbacks: [],
		id: TREE_ID,
		contentId,
		parentId,
		children
	});
	const contentIdAddMutationSpy = sinon.spy(contentId, 'addMutation');

	// tslint:disable variable-name
	// TODO: create that mu
	const mutationWithoutPropName: IDatedMutation<FieldMutationTypes> = {
		data: {
			id: CONTENT_ID3,
		},
		timestamp: Date.now(),
		type: FieldMutationTypes.SET
	};
	const mutation: IProppedDatedMutation<FieldMutationTypes, TreePropertyNames> = {
		...mutationWithoutPropName,
		propertyName: TreePropertyNames.CONTENT_ID,
	};

	tree.addMutation(mutation);
	expect(contentIdAddMutationSpy.callCount).to.equal(1);
	const calledWith = contentIdAddMutationSpy.getCall(0).args[0];
	expect(calledWith).to.deep.equal(mutationWithoutPropName);
	t.pass();
});
