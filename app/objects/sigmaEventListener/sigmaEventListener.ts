import {
	inject,
	injectable,
	tagged
} from 'inversify';
import {TYPES} from '../types';
import {
	CONTENT_TYPES,
	IBindable,
	IFamilyLoader,
	ISetCardOpenMutationArgs,
	ISigma,
	ISigmaEventListener,
	ISigmaNodeData,
	ISwitchToMapMutationArgs,
	ITooltipOpener,
} from '../interfaces';
import {CustomSigmaEventNames} from './customSigmaEvents';
import {TAGS} from '../tags';
import {Store} from 'vuex';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {IMoveTreeCoordinateMutationArgs} from '../../core/store/store_interfaces';
import {SIGMA_EVENT_NAMES} from './sigmaEventNames';

@injectable()
export class SigmaEventListener implements ISigmaEventListener {
	private tooltipOpener: ITooltipOpener;
	private sigmaInstance: ISigma;
	private familyLoader: IFamilyLoader;
	private dragListener: IBindable;
	private store: Store<any>;
	// private cardOpen: boolean

	constructor(@inject(TYPES.SigmaEventListenerArgs){
		tooltipOpener,
		sigmaInstance,
		familyLoader,
		dragListener,
		store
	}: SigmaEventListenerArgs) {
		this.tooltipOpener = tooltipOpener;
		this.sigmaInstance = sigmaInstance;
		this.familyLoader = familyLoader;
		this.dragListener = dragListener;
		this.store = store;
		// this.cardOpen = false
	}

	public startListening() {
		let doubleClickPromise
		let currentClickedNodeId = null
		this.sigmaInstance.bind(SIGMA_EVENT_NAMES.DOUBLE_CLICK_NODE, (event) => {
			const nodeId = event && event.data &&
				event.data.node && event.data.node.id;
			// console.log("nodeId is ", nodeId)
			if (!nodeId) {
				return;
			}
			console.log('double click node called', nodeId)
			doubleClickPromise(true)
			const sigmaNode = this.sigmaInstance.graph.nodes(nodeId);
			this.tooltipOpener.openEditTooltip(sigmaNode)
		})
		this.sigmaInstance.bind(SIGMA_EVENT_NAMES.CLICK_NODE, async (event) => {
			const nodeId = event && event.data &&
				event.data.node && event.data.node.id;
			// console.log("nodeId is ", nodeId)
			if (!nodeId) {
				return;
			}
			// if (nodeId === currentClickedNodeId) {
			// 	return
			// }
			// console.log('single click node called', nodeId)
			// currentClickedNodeId = nodeId
			// const isDoubleClick = await new Promise((resolve, reject) => {
			// 	doubleClickPromise = resolve
			// 	setTimeout(() => {
			// 		resolve(false)
			// 		console.log('resolving promise false')
			// 		currentClickedNodeId = null
			// 	} ,1800);
			// })
			// if (isDoubleClick) {
			// 	return
			// }
			const sigmaNode = this.sigmaInstance.graph.nodes(nodeId);
			this.tooltipOpener.openEditTooltip(sigmaNode);
			//
			// const setCardOpenMutationArgs: ISetCardOpenMutationArgs = {sigmaId: nodeId}
			// this.store.commit(MUTATION_NAMES.SET_CARD_OPEN, setCardOpenMutationArgs);


			const nodeData: ISigmaNodeData = event.data.node;
			const contentType: CONTENT_TYPES = event.data.node.content.type;
			switch (contentType) {
				case CONTENT_TYPES.MAP: {
					const branchesMapId = nodeId;
					const switchToMapMutationArgs: ISwitchToMapMutationArgs = {
						branchesMapId
					};
					this.store.commit(MUTATION_NAMES.SWITCH_TO_MAP, switchToMapMutationArgs);
				}
			}

		});
		// debugger;
		this.sigmaInstance.bind(SIGMA_EVENT_NAMES.OVER_NODE, (event) => {
			if (this.store.state.cardOpen) {
				// can't open up a node via hovering when a card is already open. this leads to an annoying UX
				return
			}
			const nodeId = event && event.data &&
				event.data.node && event.data.node.id;
			if (!nodeId) {
				return;
			}
			this.familyLoader.loadFamilyIfNotLoaded(nodeId);
			const sigmaNode = this.sigmaInstance.graph.nodes(nodeId);
			this.tooltipOpener.openHoverTooltip(sigmaNode)
			// this.tooltipOpener.openEditTooltip(sigmaNode)
			// setTimeout(() => {
			// 	this.store.commit(MUTATION_NAMES.REFRESH); // needed to get rid of label disappearing bug
			// }, 0)
		});
		this.sigmaInstance.bind(SIGMA_EVENT_NAMES.CLICK_STAGE, (event) => {
			const nodeId = event && event.data &&
				event.data.node && event.data.node.id;
			/** explicitly close any current open flashcards.
			 * Sometimes after the user has clicked the play button before, sigmaJS tooltips plugin
			 * won't natively close the card,
			 * so we must do it manually through this mutation
			 */
			this.store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD);
			// this.store.commit(MUTATION_NAMES.REFRESH);
		});
		this.dragListener.bind(SIGMA_EVENT_NAMES.DRAG_END, (event) => {
			const node = event && event.data && event.data.node;
			const nodeId = node.id;
			const mutationArgs: IMoveTreeCoordinateMutationArgs = {
				treeId: nodeId,
				point: {
					x: node.x,
					y: node.y
				}
			};
			this.store.commit(MUTATION_NAMES.MOVE_TREE_COORDINATE, mutationArgs);
		});
		// debugger;
		this.sigmaInstance.renderers[0].bind(CustomSigmaEventNames.CENTERED_NODE, (event) => {
			const nodeId = event && event.data &&
				event.data.centeredNodeId;
			if (!nodeId) {
				return;
			}
			this.familyLoader.loadFamilyIfNotLoaded(nodeId);
		});
	}
}

export class SigmaEventListenerArgs {
	@inject(TYPES.ITooltipOpener) public tooltipOpener: ITooltipOpener;
	@inject(TYPES.ISigma) public sigmaInstance: ISigma;
	@inject(TYPES.IFamilyLoader) public familyLoader: IFamilyLoader;
	@inject(TYPES.BranchesStore) public store: Store<any>;
	@inject(TYPES.IBindable)
	@tagged(TAGS.DRAG_LISTENER, true)
	public dragListener: IBindable;
}
