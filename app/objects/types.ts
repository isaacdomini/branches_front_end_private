const TYPES = {
    Any: Symbol('Any'),
    AppArgs: Symbol('AppArgs'),
    Array: Symbol('Array'),
    Boolean: Symbol('Boolean'),
    ContentUserDataArgs: Symbol('ContentUserDataArgs'),
    CanvasUI: Symbol('CanvasUI'),
    CanvasUIArgs: Symbol('CanvasUIArgs'),
    DBSubscriberToTreeArgs: Symbol('DBSubscriberToTreeArgs'),
    DBSubscriberToTreeUserArgs: Symbol('DBSubscriberToTreeUserArgs'),
    DBSubscriberToTreeLocationArgs: Symbol('DBSubscriberToTreeLocationArgs'),
    Firebase: Symbol('Firbase'),
    FirebaseSaverArgs: Symbol('FirebaseSaverArgs'),
    FirebaseSyncerArgs: Symbol('SyncToDBArgs'),
    IActivatableDatedMutation: Symbol('IActivatableDatedMutation'),
    IActivatableDatedMutationArr: Symbol('IActivatableDatedMutationArr'),
    IApp: Symbol('IApp'),
    ICanvasUI: Symbol('ICanvasUI'),
    IColorSlice: Symbol('IColorSlice'),
    IContentIdSigmaIdMap: Symbol('IContentIdSigmaIdMap'),
    IContentUserData: Symbol('IContentUserData'),
    IDatabaseSyncer: Symbol('IDatabaseSyncer'),
    IDatedMutation: Symbol('IDatedMutation'),
    IFirebaseRef: Symbol('IFirebaseRef'),
    IManagedSigmaNodeCreatorCore: Symbol('IManagedSigmaNodeCreatorCore'),
    IMutableId: Symbol('IMutableField'),
    IMutableStringSet: Symbol('IMutableStringSet'),
    IMutableSubscribableTree: Symbol('IMutableSubscribableTree'),
    IMutableSubscribableTreeStore: Symbol('IMutableSubscribableTreeStore'),
    IMutableSubscribableTreeUserStore: Symbol('IMutableSubscribableTreeUserStore'),
    IMutableSubscribableTreeLocation: Symbol('IMutableSubscribableTreeLocation'),
    IMutableSubscribableTreeLocationStore: Symbol('IMutableSubscribableTreeLocationStore'),
    IMutableSubscribableContentUserStore: Symbol('IMutableSubscribableContentUserStore'),
    IMutableSubscribableContentStore: Symbol('IMutableSubscribableContentStore'),
    IMutableSubscribableGlobalStore: Symbol('IMutableSubscribableGlobalStore'),
    IProficiencyStats: Symbol('IProficiencyStats'),
    IProppedDatedMutation: Symbol('IProppedDatedMutation'),
    IRenderedNodesManager: Symbol('IRenderedNodesManager'),
    IRenderedNodesManagerCore: Symbol('IRenderedNodesManagerCore'),
    ISaveUpdatesToDBFunction: Symbol('ISaveUpdatesToDBFunction'),
    ISigmaNode: Symbol('ISigmaNode'),
    ISigmaNodeCreator: Symbol('ISigmaNodeCreator'),
    ISigmaNodeCreatorCore: Symbol('ISigmaNodeCreatorCore'),
    ISigmaNodeCreatorCaller: Symbol('ISigmaNodeCreatorCaller'),
    ISigmaNodeData: Symbol('ISigmaNodeData'),
    ISigmaNodesUpdater: Symbol('ISigmaNodesUpdater'),
    ISigmaRenderManager: Symbol('ISigmaRenderManager'),
    ISubscribableContent: Symbol('ISubscribableContent'),
    ISubscribableContentStore: Symbol('ISubscribableContentStore'),
    ISubscribableContentStoreSource: Symbol('ISubscribableContentStoreSource'),
    ISubscribableContentUser: Symbol('ISubscribableContentUser'),
    ISubscribableContentUserStore: Symbol('ISubscribableContentUserStore'),
    ISubscribableContentUserStoreSource: Symbol('ISubscribableContentUserStoreSource'),
    ISubscribableGlobalStore: Symbol('ISubscribableGlobalStore'),
    ISubscribableMutableBoolean: Symbol('ISubscribableMutableBoolean'),
    ISubscribableMutableField: Symbol('ISubscribableMutableField'),
    ISubscribableMutableNumber: Symbol('ISubscribableMutableNumber'),
    ISubscribableMutableContentType: Symbol('ISubscribableMutableContentType'),
    ISubscribableMutableProficiency: Symbol('ISubscribableMutableProficiency'),
    ISubscribableMutableProficiencyStats: Symbol('ISubscribableMutableProficiencyStats'),
    ISubscribableMutableString: Symbol('ISubscribableMutableString'),
    ISubscribableMutableStringSet: Symbol('ISubscribableMutableStringSet'),
    ISubscribableStore_ISubscribableTreeCore: Symbol('ISubscribableStore_ISubscribableTreeCore'),
    ISubscribableStoreSource: Symbol('ISubscribableStoreSource'),
    ISubscribableTree: Symbol('ISubscribableTreeCore'),
    ISubscribableTreeStoreSource: Symbol('ISubscribableTreeStoreSource'),
    ISubscribableTreeLocationStore: Symbol('ISubscribableTreeLocationStore'),
    ISubscribableTreeLocationStoreSource: Symbol('ISubscribableTreeLocationStoreSource'),
    ISubscribableTreeUser: Symbol('ISubscribableTreeUser'),
    ISubscribableTreeUserStore: Symbol('ISubscribableTreeUserStore'),
    ISubscribableTreeUserStoreSource: Symbol('ISubscribableTreeUserStoreSource'),
    ISubscribableTreeStore: Symbol('ISubscribableTreeStore'),
    IMutableSubscribablePoint: Symbol('IMutableSubscribablePoint'),
    ISubscriber_ITypeAndIdAndValUpdates_Array: Symbol('ISubscriber_ITypeAndIdAndValUpdates_Array'),
    ITree: Symbol('ITree'),
    ManagedSigmaNodeCreatorCoreArgs: Symbol('ManagedSigmaNodeCreatorCoreArgs'),
    MutableSubscribableGlobalStoreArgs: Symbol('MutableSubscribableGlobalStoreArgs'),
    Number: Symbol('Number'),
    Object: Symbol('Object'),
    ObjectDataTypes: Symbol('ObjectDataTypes'),
    PROFICIENCIES: Symbol('PROFICIENCIES'),
    RenderedNodesManagerArgs: Symbol('RenderedNodesManagerArgs'),
    RenderedNodesManagerCoreArgs: Symbol('RenderedNodesManagerCoreArgs'),
    SigmaNodeArgs: Symbol('SigmaNodeArgs'),
    SigmaNodeCreatorCoreArgs: Symbol('SigmaNodeCreatorCoreArgs'),
    SigmaNodeCreatorArgs: Symbol('SigmaNodeCreatorArgs'),
    SigmaNodeCreatorCallerArgs: Symbol('SigmaNodeCreatorCallerArgs'),
    SigmaNodesUpdaterArgs: Symbol('SigmaNodesUpdaterArgs'),
    SigmaRenderManager: Symbol('SigmaRenderManager'),
    SigmaRenderManagerArgs: Symbol('SigmaRenderManagerArgs'),
    String: Symbol('String'),
    Subscribable: Symbol('Subscribable'),
    SubscribableArgs: Symbol('SubscribableArgs'),
    SubscribableContentArgs: Symbol('SubscribableContentArgs'),
    SubscribableContentStoreArgs: Symbol('SubscribableContentStoreArgs'),
    SubscribableContentStoreSourceArgs: Symbol('SubscribableContentStoreSourceArgs'),
    SubscribableContentUserArgs: Symbol('SubscribableContentUserArgs'),
    SubscribableContentUserStoreArgs: Symbol('SubscribableContentUserStoreArgs'),
    SubscribableContentUserStoreSourceArgs: Symbol('SubscribableContentUserStoreSourceArgs'),
    SubscribableStoreArgs: Symbol('SubscribableStoreArgs'),
    SubscribableStoreSourceArgs: Symbol('SubscribableStoreSourceArgs'),
    SubscribableGlobalStoreArgs: Symbol('SubscribableGlobalStoreArgs'),
    SubscribableMutableFieldArgs: Symbol('ISubscribableMutableFieldArgs'),
    SubscribableMutableStringSetArgs: Symbol('SubscribableMutableStringSetArgs'),
    SubscribableMutablePointArgs: Symbol('SubscribableMutablePointArgs'),
    SubscribableTreeArgs: Symbol('SubscribableTreeArgs'),
    SubscribableTreeStoreArgs: Symbol('SubscribableTreeStoreArgs'),
    SubscribableTreeUserArgs: Symbol('SubscribableTreeUserArgs'),
    SubscribableTreeUserStoreArgs: Symbol('SubscribableTreeUserStoreArgs'),
    SubscribableTreeUserStoreSourceArgs: Symbol('SubscribableTreeUserStoreSourceArgs'),
    SubscribableTreeLocationArgs: Symbol('SubscribableTreeLocationArgs'),
    SubscribableTreeLocationStoreArgs: Symbol('SubscribableTreeLocationStoreArgs'),
    SubscribableTreeLocationStoreSourceArgs: Symbol('SubscribableTreeLocationStoreSourceArgs'),
    SubscribableTreeStoreSourceArgs: Symbol('SubscribableTreeStoreSourceArgs'),
    SyncToDBArgs: Symbol('SyncToDBArgs'),
    SyncToFirebaseArgs: Symbol('SyncToDBArgs'),
    TreeLocationLoaderArgs: Symbol('TreeLocationLoaderArgs'),
    UIColor: Symbol('UIColor'),
    fGetSigmaIdsForContentId: Symbol('fGetSigmaIdsForContentId'),
    radian: Symbol('radian'),
}

export {TYPES}
