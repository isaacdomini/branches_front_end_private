import {setToStringArray, stringArrayToSet} from '../../core/newUtils';
import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IHash, IMutableSubscribableTree, ITreeData, ITreeDataFromFirebase,
    ITreeDataWithoutId,
    ISyncableMutableSubscribableTree, ITree,
} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableTree} from '../../objects/tree/MutableSubscribableTree';
import {SyncableMutableSubscribableTree} from '../../objects/tree/SyncableMutableSubscribableTree';

export class TreeDeserializer {
   public static deserializeFromDB(
       {treeData, treeId}: {treeData: ITreeDataFromFirebase, treeId: string}
       ): ISyncableMutableSubscribableTree {
       const contentId = new MutableSubscribableField<string>({field: treeData.contentId})
       /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
        // TODO: figure out why DI puts in a bad IUpdatesCallback!
       */
       const parentId = new MutableSubscribableField<string>({field: treeData.parentId})
       const childrenSet: IHash<boolean> = treeData.children
       const children = new SubscribableMutableStringSet({set: childrenSet})
       const tree: ISyncableMutableSubscribableTree = new SyncableMutableSubscribableTree(
           {updatesCallbacks: [], id: treeId, contentId, parentId, children}
           )
       return tree
   }
    public static deserializeWithoutId(
        {treeDataWithoutId, treeId}: {treeDataWithoutId: ITreeDataWithoutId, treeId: string}
    ): ISyncableMutableSubscribableTree {
        const contentId = new MutableSubscribableField<string>({field: treeDataWithoutId.contentId})
        /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
         // TODO: figure out why DI puts in a bad IUpdatesCallback!
        */
        const parentId = new MutableSubscribableField<string>({field: treeDataWithoutId.parentId})
        const childrenArray: string[] = treeDataWithoutId.children || []
        const childrenSet: IHash<boolean> = stringArrayToSet(childrenArray)
        const children = new SubscribableMutableStringSet({set: childrenSet})
        const tree: ISyncableMutableSubscribableTree = new SyncableMutableSubscribableTree(
            {updatesCallbacks: [], id: treeId, contentId, parentId, children}
        )
        return tree
    }
    public static deserialize(
        {treeData, treeId}: {treeData: ITreeData, treeId: string}
    ): ISyncableMutableSubscribableTree {
        const contentId = new MutableSubscribableField<string>({field: treeData.contentId})
        /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
         // TODO: figure out why DI puts in a bad IUpdatesCallback!
        */
        const parentId = new MutableSubscribableField<string>({field: treeData.parentId})
        const childrenArray: string[] = treeData.children || []
        const childrenSet: IHash<boolean> = stringArrayToSet(childrenArray)
        const children = new SubscribableMutableStringSet({set: childrenSet})
        const tree: ISyncableMutableSubscribableTree = new SyncableMutableSubscribableTree(
            {updatesCallbacks: [], id: treeId, contentId, parentId, children}
        )
        return tree
    }
   public static convertSetsToArrays(
       {treeData, }: {treeData: ITreeDataFromFirebase, }
   ): ITreeDataWithoutId {
       const childrenArray = treeData.children ?
           setToStringArray(treeData.children) :
           []
       return {
           parentId: treeData.parentId,
           children: childrenArray,
           contentId: treeData.contentId,
       }
   }
}
