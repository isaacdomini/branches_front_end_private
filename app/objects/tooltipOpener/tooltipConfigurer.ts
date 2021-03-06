import {
	inject,
	injectable
} from 'inversify';
import {TYPES} from '../types';
import {
	ISigmaNodeData,
	ITooltipConfigurer
} from '../interfaces';
import {Store} from 'vuex';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {calculateCardWidth} from '../../../other_imports/sigma/renderers/canvas/cardDimensions';
import {DEFAULT_NODE_SIZE} from '../../core/globals';

export function escape(str) {
	if (!str) {
		return '';
	}
	return encodeURIComponent(JSON.stringify(str));
}

/* If we ever have a feature where someone can essentially masquerade
 as another user and open a tooltip with a different userId,
 we will have to instantiate another tooltipOpener branchesMap */
@injectable()
export class TooltipConfigurer implements ITooltipConfigurer {
	private store: Store<any>;

	constructor(@inject(TYPES.TooltipConfigurerArgs){store}: TooltipConfigurerArgs) {
		this.store = store;
		// TODO: maybe set up this watch outside of constructor?
	}

	public getTooltipsConfig() {
		const tooltipsConfig = {
			node: [
				{
					show: 'rightClickNode',
					cssClass: 'sigma-tooltip',
					position: 'card-center',
					template: '',
					renderer: this.renderer.bind(this)
				}],
		};
		return tooltipsConfig;
	}

	public getAddTooltipsConfig() {
		const tooltipsConfig = {
			node: [
				{
					show: 'rightClickNode',
					cssClass: 'sigma-tooltip',
					position: 'card-center',
					template: '',
					renderer: this.addRenderer.bind(this)
				}],
		};
		return tooltipsConfig;
	}

	public getEditTooltipsConfig() {
		const tooltipsConfig = {
			node: [
				{
					show: 'rightClickNode',
					cssClass: 'sigma-tooltip',
					position: 'card-center',
					template: '',
					renderer: this.editRenderer.bind(this)
				}],
		};
		return tooltipsConfig;
	}

	public getHovererTooltipsConfig() {
		const tooltipsConfig = {
			node: [
				{
					show: 'rightClickNode',
					cssClass: 'sigma-tooltip',
					position: 'center',
					template: '',
					renderer: this.hoverRenderer.bind(this)
				}],
		};
		return tooltipsConfig;
	}

	private userId(): string {
		return this.store.state.userId;
	}

	private renderer(node: ISigmaNodeData, template): string {
		const contentId = node.contentId;
		const userId = this.userId();
		const contentUserId = getContentUserId({
			contentId,
			userId
		});
		const contentString = JSON.stringify(node.content);
		const contentUserDataString = node.contentUserData ?
			JSON.stringify(node.contentUserData) : '';
		const resultElement = document.createElement('div');
		resultElement.setAttribute('id', 'vue');
		const card = document.createElement('card-main');
		const canvasRenderedSize = node['renderer1:size'] || node['renderer2:size'] || DEFAULT_NODE_SIZE;
		const width = calculateCardWidth(node, canvasRenderedSize); // TODO: change function call to new definition
		card.style.width = width + 'px;';
		card.setAttribute('id', node.id);
		card.setAttribute('content-id', node.contentId);
		card.setAttribute('content-user-id', contentUserId);
		resultElement.appendChild(card);
		const result: string = resultElement.outerHTML;

		return result;
	}

	private hoverRenderer(node: ISigmaNodeData, template): string {
		const contentId = node.contentId;
		const userId = this.userId();
		const contentUserId = getContentUserId({
			contentId,
			userId
		});
		const contentString = JSON.stringify(node.content);
		const contentUserDataString = node.contentUserData ?
			JSON.stringify(node.contentUserData) : '';
		const resultElement = document.createElement('div');
		resultElement.setAttribute('id', 'vue');
		const nodeHoverIcons = document.createElement('node-hover-icons');
		nodeHoverIcons.setAttribute('id', node.id);
		nodeHoverIcons.setAttribute('parent-id', node.parentId);
		nodeHoverIcons.setAttribute('content-id', node.contentId);
		nodeHoverIcons.setAttribute('content-string', contentString);
		nodeHoverIcons.setAttribute('content-user-id', contentUserId);
		nodeHoverIcons.setAttribute('content-user-data-string', contentUserDataString);
		nodeHoverIcons.setAttribute('node-size', node['renderer1:size'] || node['renderer2:size'])
		resultElement.appendChild(nodeHoverIcons);
		const result: string = resultElement.outerHTML;

		return result;
	}

	private addRenderer(node: ISigmaNodeData, template): string {
		const contentId = node.contentId;
		const userId = this.userId();
		const contentUserId = getContentUserId({
			contentId,
			userId
		});
		const contentString = JSON.stringify(node.content);
		const contentUserDataString = node.contentUserData ?
			JSON.stringify(node.contentUserData) : '';
		const resultElement = document.createElement('div');
		this.store.state['vueInstanceId'] = ""+Math.random()
		resultElement.setAttribute('id', this.store.state['vueInstanceId']);
		const addCard = document.createElement('card-add');
		// addCard.setAttribute('id', node.id);
		addCard.setAttribute('parent-id', node.id);
		// addCard.setAttribute('content-id', node.contentId);
		// addCard.setAttribute('content-string', contentString);
		// addCard.setAttribute('content-user-id', contentUserId);
		// addCard.setAttribute('content-user-data-string', contentUserDataString);
		resultElement.appendChild(addCard);
		const result: string = resultElement.outerHTML;

		return result;
	}

	private editRenderer(node: ISigmaNodeData, template): string {
		const contentId = node.contentId;
		const userId = this.userId();
		const contentUserId = getContentUserId({
			contentId,
			userId
		});
		const contentString = JSON.stringify(node.content);
		const contentUserDataString = node.contentUserData ?
			JSON.stringify(node.contentUserData) : '';
		const resultElement = document.createElement('div');

		this.store.state['vueInstanceId'] = "a"+Math.floor(Math.random()*10000000)
		resultElement.setAttribute('id', this.store.state['vueInstanceId']);
		// resultElement.setAttribute('id', 'vue');
		const editCard = document.createElement('card-edit');
		// editCard.setAttribute('id', node.id); // <<maybe this is causing dom issues which causes the input vlaue not displaying error because of let's say some chrome optimization
		editCard.setAttribute('parent-id', node.parentId);
		editCard.setAttribute('size', '' + node.size);
		editCard.setAttribute('rendered-size', '' + node['renderer1:size']);
		editCard.setAttribute('content-title', node.content.title);
		editCard.setAttribute('content-string', contentString);
		// editCard.setAttribute('content-user-id', contentUserId);
		editCard.setAttribute('content-id', node.contentId);
		editCard.setAttribute('content-type', node.content.type);
		editCard.setAttribute('content-question', node.content.question);
		editCard.setAttribute('content-answer', node.content.answer);
		// editCard.setAttribute('content-user-data-string', contentUserDataString);
		console.log("editCard is ", editCard)
		console.log("content-id is ", node.contentId)
		console.log("content String", contentString)
		console.log("content title", node.content.title)
		console.log("content type", node.content.type)
		resultElement.appendChild(editCard);
		const result: string = resultElement.outerHTML;

		return result;
	}
}

@injectable()
export class TooltipConfigurerArgs {
	@inject(TYPES.BranchesStore) public store;
}
