import test
	from 'ava';
import {expect} from 'chai';
import 'reflect-metadata';
import {
	IMutableSubscribableTree,
	ITreeDataWithoutId
} from '../../objects/interfaces';
import {TreeDeserializer} from './TreeDeserializer';
import {myContainerLoadLoaders} from '../../../inversify.config';
import {
	getASampleTree1GivenTreeId,
	sampleTreeData1,
	sampleTreeData1FromDB
} from '../../objects/tree/treeTestHelpers';

myContainerLoadLoaders();
test('TreeDeserializer::: deserializeFromDB Should deserializeFromDB properly', (t) => {
	const treeId = '092384';

	const deserializedTree: IMutableSubscribableTree =
		TreeDeserializer.deserializeFromDB({
			treeDataFromDB: sampleTreeData1FromDB,
			treeId
		});
	expect(deserializedTree).to.deep.equal(getASampleTree1GivenTreeId({treeId}));
	t.pass();
});
test('TreeDeserializer::: convertFromDBToData should work', (t) => {
	const convertedTreeData: ITreeDataWithoutId =
		TreeDeserializer.convertFromDBToData({treeDataFromDB: sampleTreeData1FromDB});
	expect(convertedTreeData).to.deep.equal(sampleTreeData1);
	t.pass();
});
