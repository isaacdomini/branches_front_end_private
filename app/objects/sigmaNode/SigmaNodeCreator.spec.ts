import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {injectionWorks, TREE_ID} from '../../testHelpers/testHelpers';
import {
     ISigmaNodeCreator, ISigmaNodeCreatorCaller, ISigmaNodeCreatorCore,
    ITreeDataWithoutId, ObjectDataTypes
} from '../interfaces';
import {TYPES} from '../types';
import {SigmaNodeCreator, SigmaNodeCreatorArgs, SigmaNodeCreatorCallerArgs} from './SigmaNodeCreator';

describe('SigmaNodeCreator', () => {
    it('DI constructor should work', () => {
        const injects = injectionWorks<SigmaNodeCreatorArgs, ISigmaNodeCreator>({
            container: myContainer,
            argsType: TYPES.SigmaNodeCreatorArgs,
            classType: TYPES.ISigmaNodeCreator,
        })
        expect(injects).to.equal(true)
    })
    it('receiveUpdate', () => {
        const sigmaId = TREE_ID
        const treeData: ITreeDataWithoutId = {
            contentId: '543534',
            parentId: '4234325',
            children: ['234', '5435']
        }
        const sigmaNodeCreatorCore: ISigmaNodeCreatorCore
            = myContainer.get<ISigmaNodeCreatorCore>(TYPES.ISigmaNodeCreatorCore)
        const sigmaNodeCreator: ISigmaNodeCreator = new SigmaNodeCreator({sigmaNodeCreatorCore})

        const sigmaNodeCreatorCoreReceiveNewTreeDataSpy = sinon.spy(sigmaNodeCreatorCore, 'receiveNewTreeData')
        const expectedCalledWith = {treeId: sigmaId, treeData}

        expect(sigmaNodeCreatorCoreReceiveNewTreeDataSpy.callCount).to.equal(0)
        sigmaNodeCreator.receiveUpdate({type: ObjectDataTypes.TREE_DATA, id: sigmaId, val: treeData})
        expect(sigmaNodeCreatorCoreReceiveNewTreeDataSpy.callCount).to.equal(1)
        const calledWith = sigmaNodeCreatorCoreReceiveNewTreeDataSpy.getCall(0).args[0]
        expect(calledWith).to.deep.equal(expectedCalledWith)

    })
})
describe('SigmaNodeCreatorCaller', () => {
    it('DI constructor should work', () => {
        const injects = injectionWorks<SigmaNodeCreatorCallerArgs, ISigmaNodeCreatorCaller>({
            container: myContainer,
            argsType: TYPES.SigmaNodeCreatorCallerArgs,
            classType: TYPES.ISigmaNodeCreatorCaller,
        })
        expect(injects).to.equal(true)
    })
})
