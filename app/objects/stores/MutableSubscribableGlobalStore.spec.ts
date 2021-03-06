// tslint:disable object-literal-sort-keys
import test
	from 'ava';
import {expect} from 'chai';
import * as sinon
	from 'sinon';
import {
	myContainer,
	myContainerLoadCustomStores
} from '../../../inversify.config';
import {
	CONTENT_ID,
	CONTENT_ID2,
	injectionWorks,
	TREE_ID
} from '../../testHelpers/testHelpers';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {
	CONTENT_TYPES,
	ContentPropertyNames,
	ContentUserPropertyNames,
	FieldMutationTypes,
	GlobalStoreObjectTypes,
	IContentData,
	IContentUserData,
	ICreateMutation,
	IIdProppedDatedMutation,
	IMutableSubscribableContentStore,
	IMutableSubscribableContentUserStore,
	IMutableSubscribableField,
	IMutableSubscribableGlobalStore,
	IMutableSubscribableTreeLocationStore,
	IMutableSubscribableTreeStore,
	ISubscribableContentStoreSource,
	ISubscribableContentUserStoreSource,
	ISubscribableTreeStoreSource,
	ITreeDataWithoutId,
	ITreeLocationData,
	ITypeIdProppedDatedMutation,
	STORE_MUTATION_TYPES,
	timestamp,
	TreePropertyNames,
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {MutableSubscribableStringSet} from '../set/MutableSubscribableStringSet';
import {TYPES} from '../types';
import {MutableSubscribableContentStore} from './content/MutableSubscribableContentStore';
import {MutableSubscribableContentUserStore} from './contentUser/MutableSubscribableContentUserStore';
import {
	MutableSubscribableGlobalStore,
	MutableSubscribableGlobalStoreArgs
} from './MutableSubscribableGlobalStore';
import {MutableSubscribableTreeStore} from './tree/MutableSubscribableTreeStore';
import {partialInject} from '../../testHelpers/partialInject';
import {log} from '../../core/log';
import {SyncableMutableSubscribableContentUser} from '../contentUser/SyncableMutableSubscribableContentUser';
import {createTreeId} from '../tree/TreeUtils';
import {SyncableMutableSubscribableTree} from '../tree/SyncableMutableSubscribableTree';
import {SyncableMutableSubscribableContent} from '../content/SyncableMutableSubscribableContent';
import {TAGS} from '../tags';
import {sampleTreeLocationData1} from '../treeLocation/treeLocationTestHelpers';

myContainerLoadCustomStores();
test('MutableSubscribableGlobalStore:::Dependency injection should set all properties in constructor', (t) => {
	const injects: boolean = injectionWorks<MutableSubscribableGlobalStoreArgs, IMutableSubscribableGlobalStore>({
		container: myContainer,
		argsType: TYPES.MutableSubscribableGlobalStoreArgs,
		interfaceType: TYPES.IMutableSubscribableGlobalStore
	});
	expect(injects).to.equal(true);
	t.pass();
});
test('MutableSubscribableGlobalStore:::adding a tree mutation should call treeStore.addMutation(mutationObj)'
	+ ' but without the objectType in mutationObj', (t) => {
	// log('MSGlobalStore adding tree mutation called')

	const contentId = new MutableSubscribableField<string>({field: CONTENT_ID2});
	const parentId = new MutableSubscribableField<string>({field: 'adf12356'});
	const children = new MutableSubscribableStringSet();
	const id = TREE_ID;
	const tree = new SyncableMutableSubscribableTree({
		id,
		contentId,
		parentId,
		children,
		updatesCallbacks: [],
	});

	const storeSource: ISubscribableTreeStoreSource
		= myContainer.getTagged<ISubscribableTreeStoreSource>
	(TYPES.ISubscribableTreeStoreSource, TAGS.MAIN_APP, true);
	storeSource.set(TREE_ID, tree);
	const treeStore: IMutableSubscribableTreeStore = new MutableSubscribableTreeStore({
		storeSource,
		updatesCallbacks: []
	});

	const globalStore: IMutableSubscribableGlobalStore = partialInject<MutableSubscribableGlobalStoreArgs>({
		konstructor: MutableSubscribableGlobalStore,
		constructorArgsType: TYPES.MutableSubscribableGlobalStoreArgs,
		injections: {treeStore},
		container: myContainer
	});

	const NEW_CONTENT_ID = 'def123';
	const objectType = GlobalStoreObjectTypes.TREE;
	const propertyName = TreePropertyNames.CONTENT_ID;
	const type = FieldMutationTypes.SET;
	const data = NEW_CONTENT_ID;
	const timestamp = Date.now();

	const storeMutation: IIdProppedDatedMutation<FieldMutationTypes, TreePropertyNames> = {
		data,
		id,
		propertyName,
		timestamp,
		type
	};

	const globalMutation: ITypeIdProppedDatedMutation<FieldMutationTypes> = {
		objectType,
		...storeMutation
	};
	const storeAddMutationSpy = sinon.spy(treeStore, 'addMutation');

	globalStore.addMutation(globalMutation);

	expect(storeAddMutationSpy.callCount).to.deep.equal(1);
	const calledWith = storeAddMutationSpy.getCall(0).args[0];
	expect(calledWith).to.deep.equal(storeMutation);
	t.pass();

});
test('MutableSubscribableGlobalStore:::adding a contentUser mutation should' +
	' call contentUserStore.addMutation(mutationObj)'
	+ ' but without the objectType in mutationObj', (t) => {

	// contentUserStore
	const contentId = CONTENT_ID;
	const userId = '1239857';
	const nextReviewTimeVal = Date.now() + 1000 * 60;
	const lastInteractionTimeVal = Date.now();
	const contentUserId = contentId + userId;
	const overdue = new MutableSubscribableField<boolean>({field: false});
	const lastRecordedStrength = new MutableSubscribableField<number>({field: 45});
	const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: PROFICIENCIES.TWO});
	const timer = new MutableSubscribableField<number>({field: 30});
	const lastInteractionTime: IMutableSubscribableField<timestamp> =
		new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal});
	const nextReviewTime: IMutableSubscribableField<timestamp> =
		new MutableSubscribableField<timestamp>({field: nextReviewTimeVal});
	const contentUser = new SyncableMutableSubscribableContentUser({
		id: contentUserId,
		lastEstimatedStrength: lastRecordedStrength,
		overdue,
		proficiency,
		timer,
		lastInteractionTime,
		nextReviewTime,
		updatesCallbacks: [],
	});
	const storeSource: ISubscribableContentUserStoreSource
		= myContainer.get<ISubscribableContentUserStoreSource>
	(TYPES.ISubscribableContentUserStoreSource);
	storeSource.set(contentId, contentUser);
	const contentUserStore: IMutableSubscribableContentUserStore = new MutableSubscribableContentUserStore({
		storeSource,
		updatesCallbacks: []
	});

	const globalStore: IMutableSubscribableGlobalStore = partialInject<MutableSubscribableGlobalStoreArgs>({
		konstructor: MutableSubscribableGlobalStore,
		constructorArgsType: TYPES.MutableSubscribableGlobalStoreArgs,
		injections: {contentUserStore},
		container: myContainer
	});
	const newProficiencyVal = PROFICIENCIES.THREE;
	const objectType = GlobalStoreObjectTypes.CONTENT_USER;
	const propertyName = ContentUserPropertyNames.PROFICIENCY;
	const type = FieldMutationTypes.SET;
	const data = newProficiencyVal;
	const timestamp = Date.now();

	const storeMutation: IIdProppedDatedMutation<FieldMutationTypes, ContentUserPropertyNames> = {
		data,
		id: contentId,
		propertyName,
		timestamp,
		type
	};

	const globalMutation: ITypeIdProppedDatedMutation<FieldMutationTypes> = {
		objectType,
		...storeMutation
	};
	const storeAddMutationSpy = sinon.spy(contentUserStore, 'addMutation');

	globalStore.addMutation(globalMutation);

	expect(storeAddMutationSpy.callCount).to.deep.equal(1);
	const calledWith = storeAddMutationSpy.getCall(0).args[0];
	expect(calledWith).to.deep.equal(storeMutation);
	t.pass();

});

test('MutableSubscribableGlobalStore:::adding a content mutation should call contentStore.addMutation(mutationObj)'
	+ ' but without the objectType in mutationObj', (t) => {

	// contentStore
	const contentId = CONTENT_ID;
	const type = new MutableSubscribableField<CONTENT_TYPES>({field: CONTENT_TYPES.FLASHCARD});
	const question = new MutableSubscribableField<string>({field: 'What is capital of Ohio?'});
	const answer = new MutableSubscribableField<string>({field: 'Columbus'});
	const title = new MutableSubscribableField<string>({field: ''});
	const content = new SyncableMutableSubscribableContent({
		type,
		question,
		answer,
		title,
		updatesCallbacks: [],
	});

	const storeSource: ISubscribableContentStoreSource
		= myContainer.get<ISubscribableContentStoreSource>
	(TYPES.ISubscribableContentStoreSource);
	storeSource.set(contentId, content);
	const contentStore: IMutableSubscribableContentStore = new MutableSubscribableContentStore({
		storeSource,
		updatesCallbacks: []
	});

	const globalStore: IMutableSubscribableGlobalStore = partialInject<MutableSubscribableGlobalStoreArgs>({
		konstructor: MutableSubscribableGlobalStore,
		constructorArgsType: TYPES.MutableSubscribableGlobalStoreArgs,
		injections: {contentStore},
		container: myContainer
	});
	const newQuestionVal = 'What is the capital of Iowa?';
	const objectType = GlobalStoreObjectTypes.CONTENT;
	const propertyName = ContentPropertyNames.QUESTION;
	const mutationType = FieldMutationTypes.SET;
	const data = newQuestionVal;
	const timestamp = Date.now();

	const storeMutation: IIdProppedDatedMutation<FieldMutationTypes, ContentPropertyNames> = {
		data,
		id: contentId,
		propertyName,
		timestamp,
		type: mutationType,
	};

	const globalMutation: ITypeIdProppedDatedMutation<FieldMutationTypes> = {
		objectType,
		...storeMutation
	};
	const storeAddMutationSpy = sinon.spy(contentStore, 'addMutation');

	globalStore.addMutation(globalMutation);

	expect(storeAddMutationSpy.callCount).to.deep.equal(1);
	const calledWith = storeAddMutationSpy.getCall(0).args[0];
	expect(calledWith).to.deep.equal(storeMutation);
	t.pass();
});

test('MutableSubscribableGlobalStore:::adding a create contentuser' +
	' mutation should call contentUserStore addAndSubscribeToItemFromData', (t) => {
	const contentUserStore: IMutableSubscribableContentUserStore =
		myContainer.get<IMutableSubscribableContentUserStore>(TYPES.IMutableSubscribableContentUserStore);
	const overdue = true;
	const lastRecordedStrength = 50;
	const proficiency: PROFICIENCIES = PROFICIENCIES.THREE;
	const timer = 40;
	const contentUserId = 'abcde_12345';
	const id = contentUserId;
	const lastInteractionTime = Date.now();
	const nextReviewTime = Date.now() + 1000;
	// c`12;[]`
	const contentUserData: IContentUserData = {
		id,
		lastEstimatedStrength: lastRecordedStrength,
		overdue,
		proficiency,
		timer,
		lastInteractionTime,
		nextReviewTime,
	};
	const createMutation: ICreateMutation<IContentUserData> = {
		id,
		data: contentUserData,
		objectType: GlobalStoreObjectTypes.CONTENT_USER,
		type: STORE_MUTATION_TYPES.CREATE_ITEM,
	};

	const globalStore: IMutableSubscribableGlobalStore = partialInject<MutableSubscribableGlobalStoreArgs>({
		konstructor: MutableSubscribableGlobalStore,
		constructorArgsType: TYPES.MutableSubscribableGlobalStoreArgs,
		injections: {contentUserStore},
		container: myContainer
	});
	const contentUserStoreAddAndSubscribeToItemFromDataSpy
		= sinon.spy(contentUserStore, 'addAndSubscribeToItemFromData');

	globalStore.startPublishing();
	globalStore.addMutation(createMutation);

	expect(contentUserStoreAddAndSubscribeToItemFromDataSpy.callCount).to.deep.equal(1);
	const calledWith = contentUserStoreAddAndSubscribeToItemFromDataSpy.getCall(0).args[0];
	expect(calledWith).to.deep.equal({
		id,
		contentUserData
	});
	t.pass();
});
test('MutableSubscribableGlobalStore:::adding a create content mutation should call' +
	' contentStore addAndSubscribeToItemFromData', (t) => {
	const logAny: any = log;
	logAny.on = false;
	const contentStore: IMutableSubscribableContentStore =
		myContainer.get<IMutableSubscribableContentStore>(TYPES.IMutableSubscribableContentStore);
	const question = 'What is the capital of Ohio?';
	const answer = 'Columbus';
	const title = '';
	const type = CONTENT_TYPES.FLASHCARD;
	const contentData: IContentData = {
		question,
		answer,
		type,
		title
	};
	const createMutation: ICreateMutation<IContentData> = {
		data: contentData,
		objectType: GlobalStoreObjectTypes.CONTENT,
		type: STORE_MUTATION_TYPES.CREATE_ITEM,
	};

	const globalStore: IMutableSubscribableGlobalStore = partialInject<MutableSubscribableGlobalStoreArgs>({
		konstructor: MutableSubscribableGlobalStore,
		constructorArgsType: TYPES.MutableSubscribableGlobalStoreArgs,
		injections: {contentStore},
		container: myContainer
	});
	logAny.on = true;
	const contentStoreAddAndSubscribeToItemFromDataSpy
		= sinon.spy(contentStore, 'addAndSubscribeToItemFromData');

	globalStore.startPublishing();
	globalStore.addMutation(createMutation);
	logAny.on = false;

	expect(contentStoreAddAndSubscribeToItemFromDataSpy.callCount).to.deep.equal(1);
	const calledWith = contentStoreAddAndSubscribeToItemFromDataSpy.getCall(0).args[0];
	expect(calledWith.contentData).to.deep.equal(contentData);
	t.pass()
});

test('MutableSubscribableGlobalStore: adding a create treeLocation Mutation' +
	' should call treeLocationStore addAndSubscribeToItemFromData with the correct args', (t) => {
	const treeLocationStore: IMutableSubscribableTreeLocationStore =
		myContainer.get<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore);
	const treeId = 'abababa14141';
	const treeLocationData: ITreeLocationData = sampleTreeLocationData1;
	const id = treeId;
	const createMutation: ICreateMutation<ITreeLocationData> = {
		id,
		data: treeLocationData,
		objectType: GlobalStoreObjectTypes.TREE_LOCATION,
		type: STORE_MUTATION_TYPES.CREATE_ITEM,
	};

	const globalStore: IMutableSubscribableGlobalStore = partialInject<MutableSubscribableGlobalStoreArgs>({
		konstructor: MutableSubscribableGlobalStore,
		constructorArgsType: TYPES.MutableSubscribableGlobalStoreArgs,
		injections: {treeLocationStore},
		container: myContainer
	});
	const treeLocationStoreAddAndSubscribeToItemFromDataSpy
		= sinon.spy(treeLocationStore, 'addAndSubscribeToItemFromData');

	globalStore.startPublishing();
	globalStore.addMutation(createMutation);

	expect(treeLocationStoreAddAndSubscribeToItemFromDataSpy.callCount).to.deep.equal(1);
	const calledWith = treeLocationStoreAddAndSubscribeToItemFromDataSpy.getCall(0).args[0];
	expect(calledWith).to.deep.equal({
		id,
		treeLocationData
	});
	t.pass();

});

test('MutableSubscribableGlobalStore: adding a create' +
	' tree Mutation should call tree addAndSubscribeToItemFromData with the correct args', (t) => {
	const treeStore: IMutableSubscribableTreeStore =
		myContainer.get<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore);
	const contentId = 'contentIdacbacacb159815987';
	const parentId = 'parentIdbbdefabadef1324';
	const children = [];
	const treeDataWithoutId: ITreeDataWithoutId = {
		contentId,
		parentId,
		children
	};

	const treeId = createTreeId(treeDataWithoutId);
	const id = treeId;

	// const id = treeId
	const createMutation: ICreateMutation<ITreeDataWithoutId> = {
		data: treeDataWithoutId,
		objectType: GlobalStoreObjectTypes.TREE,
		type: STORE_MUTATION_TYPES.CREATE_ITEM,
	};

	const globalStore: IMutableSubscribableGlobalStore = partialInject<MutableSubscribableGlobalStoreArgs>({
		konstructor: MutableSubscribableGlobalStore,
		constructorArgsType: TYPES.MutableSubscribableGlobalStoreArgs,
		injections: {treeStore},
		container: myContainer
	});
	const treeStoreAddAndSubscribeToItemFromDataSpy
		= sinon.spy(treeStore, 'addAndSubscribeToItemFromData');

	globalStore.startPublishing();
	globalStore.addMutation(createMutation);

	expect(treeStoreAddAndSubscribeToItemFromDataSpy.callCount).to.deep.equal(1);
	const calledWith = treeStoreAddAndSubscribeToItemFromDataSpy.getCall(0).args[0];
	expect(calledWith).to.deep.equal({
		id,
		treeDataWithoutId
	});
	t.pass();

});

test('MutableSubscribableGlobalStore: adding a create' +
	' tree user Mutation should call tree user addAndSubscribeToItemFromData with the correct args', (t) => {
	// const logAny: any = log
	// logAny.on = false
	// const treeStore: IMutableSubscribableTreeUserStore =
	//     myContainer.get<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore)
	//
	// const proficiencyStatsVal: IProficiencyStats = {
	//     UNKNOWN: 3,
	//     ONE: 2,
	//     TWO: 3,
	//     THREE: 4,
	//     FOUR: 2,
	// }
	// const aggregationTimerVal = 54
	// const proficiencyStats = new MutableSubscribableField<IProficiencyStats>({field: proficiencyStatsVal})
	// const aggregationTimer = new MutableSubscribableField<number>({field: aggregationTimerVal})
	// const expectedTreeUserData: ITreeUserData = {
	//     proficiencyStats: proficiencyStatsVal,
	//     aggregationTimer: aggregationTimerVal,
	// }
	//
	// const treeId = createTreeId(treeDataWithoutId)
	// const id = treeId
	//
	// // const id = treeId
	// const createMutation: ICreateMutation<ITreeDataWithoutId> = {
	//     data: treeDataWithoutId,
	//     objectType: GlobalStoreObjectTypes.TREE,
	//     type: STORE_MUTATION_TYPES.CREATE_ITEM,
	// }
	//
	// const globalStore: IMutableSubscribableGlobalStore = partialInject<MutableSubscribableGlobalStoreArgs>({
	//     konstructor: MutableSubscribableGlobalStore,
	//     constructorArgsType: TYPES.MutableSubscribableGlobalStoreArgs,
	//     injections: {treeStore},
	//     container: myContainer
	// })
	// logAny.on = true
	// const treeStoreAddAndSubscribeToItemFromDataSpy
	//     = sinon.spy(treeStore, 'addAndSubscribeToItemFromData')
	//
	// globalStore.startPublishing()
	// globalStore.addMutation(createMutation)
	// logAny.on = false
	//
	// expect(treeStoreAddAndSubscribeToItemFromDataSpy.callCount).to.deep.equal(1)
	// const calledWith = treeStoreAddAndSubscribeToItemFromDataSpy.getCall(0).args[0]
	// expect(calledWith).to.deep.equal({id, treeDataWithoutId})
	// t.pass()

	t.pass();
});
