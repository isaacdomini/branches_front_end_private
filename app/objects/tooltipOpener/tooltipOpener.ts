import {
	inject,
	injectable, tagged
} from 'inversify';
import Vue
	from 'vue';
import {isMobile} from '../../core/utils';
import {TYPES} from '../types';
import {
	IMapStateManager,
	ISetCardOpenMutationArgs,
	ISigmaNode,
	IState,
	ITooltipConfigurer,
	ITooltipOpener
} from '../interfaces';
import {Store} from 'vuex';
import clonedeep = require('lodash.clonedeep');
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {TAGS} from '../tags'; // TODO: why didn't regular require syntax work?

export function escape(str) {
	if (!str) {
		return '';
	}
	return encodeURIComponent(JSON.stringify(str));
}

/* If we ever have a feature where someone can essentially masquerade
 as another user and open a tooltip with a different userId,
 we will have to instantiate another tooltipOpener object.
  with the way we currently have this set up */
@injectable()
export class TooltipOpener implements ITooltipOpener {
	// private getTooltips: () => any;
	private store: Store<IState>;
	// private tooltipsConfig: object;
	private tooltipConfigurer: ITooltipConfigurer;
	private mapStateManager: IMapStateManager;

	// private userId: string
	constructor(@inject(TYPES.TooltipOpenerArgs){store, tooltipConfigurer, mapStateManager}: TooltipOpenerArgs) {
		this.tooltipConfigurer = tooltipConfigurer;
		this.store = store;
		this.mapStateManager = mapStateManager;
		// const state: IState = store.state;
		// this.getTooltips = state.getTooltips; // TODO: big violations of Law of Demeter here
		// TODO: maybe set up this watch outside of constructor?
	}

	public openPrimaryTooltip(node: ISigmaNode) {
		// Make copy of singleton's config by value to avoid mutation
		const tooltipConfig = this.tooltipConfigurer.getTooltipsConfig();
		this._openTooltip(node, tooltipConfig)
		const setCardOpenMutationArgs: ISetCardOpenMutationArgs = {
			sigmaId: node.id
		}
		this.store.commit(MUTATION_NAMES.SET_CARD_OPEN, setCardOpenMutationArgs)
	}

	public openHoverTooltip(node: ISigmaNode) {
		// Make copy of singleton's config by value to avoid mutation
		const tooltipsConfig = this.tooltipConfigurer.getHovererTooltipsConfig();
		this._openTooltip(node, tooltipsConfig)
		// deliberately don't sed CARD OPEN flag, because the card really isn't open. . . just some hover icons are
	}

	public openEditTooltip(node: ISigmaNode) {
		// Make copy of singleton's config by value to avoid mutation
		console.log('openedit Tooltip called', node.id)
		const tooltipsConfig = this.tooltipConfigurer.getEditTooltipsConfig();
		this._openTooltip(node, tooltipsConfig)
		const setCardOpenMutationArgs: ISetCardOpenMutationArgs = {
			sigmaId: node.id
		}
		this.store.commit(MUTATION_NAMES.SET_CARD_OPEN, setCardOpenMutationArgs)
		// this.mapStateManager.enterDarkMode()
	}

	public openAddTooltip(node: ISigmaNode) {
		// Make copy of singleton's config by value to avoid mutation
		const tooltipsConfig = this.tooltipConfigurer.getAddTooltipsConfig();
		this._openTooltip(node, tooltipsConfig)
		const setCardOpenMutationArgs: ISetCardOpenMutationArgs = {
			sigmaId: node.id
		}
		this.store.commit(MUTATION_NAMES.SET_CARD_OPEN, setCardOpenMutationArgs)
		this.mapStateManager.enterDarkMode()
	}

	private _openTooltip(node: ISigmaNode, tooltipsConfig) {
		const configClone = clonedeep(tooltipsConfig);

		if (isMobile.any()) {
			this.store.commit(MUTATION_NAMES.OPEN_MOBILE_CARD) // TODO: some bad design coupling here
			// configClone.node[0].cssClass = configClone.node[0].cssClass + ' mobileAnswerTray';
		} else {
			const tooltips = this.store.state.getTooltips(); // TODO: fix LoD violation
			// TODO: may have to use renderer2
			tooltips.open(node, configClone.node[0], node['renderer1:x']
				|| node['renderer2:x'], node['renderer1:y'] || node['renderer2:y']);
			setTimeout(() => {
				if (this.store.state.tooltipVueInstance) {
					this.store.state.tooltipVueInstance.$destroy()
				}
				this.store.state.tooltipVueInstance = new Vue(
					{
						el: '#' + this.store.state['vueInstanceId'],//vue',
						store: this.store,
					}
				);
				/* push this bootstrap function to the end of the callstack
								so that it is called after mustace does the tooltip rendering */
			}, 0);

		}

	}
}

@injectable()
export class TooltipOpenerArgs {
	@inject(TYPES.ITooltipConfigurer) public tooltipConfigurer: ITooltipConfigurer;
	@inject(TYPES.BranchesStore) public store: Store<any>;
	@inject(TYPES.IMapStateManager)
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	public mapStateManager: IMapStateManager;
}
