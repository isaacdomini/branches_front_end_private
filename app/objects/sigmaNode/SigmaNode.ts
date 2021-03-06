// tslint:disable max-classes-per-file
import {
	inject,
	injectable
} from 'inversify';
import {ContentItemUtils} from '../contentData/ContentDataUtils';
import {ContentUserDataUtils} from '../contentUser/ContentUserDataUtils';
import {
	CONTENT_TYPES,
	IColorSlice,
	IContentData,
	IContentUserData,
	ICoordinate,
	IProficiencyStats,
	ISigmaNode,
	ITreeDataWithoutId,
	ITreeLocationData,
	ITreeUserData,
	timestamp
} from '../interfaces';
import {TYPES} from '../types';
import {SigmaNodeUtils} from './SigmaNodeUtils';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {DEFAULT_NODE_SIZE} from '../../core/globals';
import {calculateSecondsTilCriticalReviewTime} from '../../forgettingCurve';

/**
 * This class is really used for UI only.
 * Used for the SigmaJs Canvas library
 */
@injectable()
export class SigmaNode implements ISigmaNode {

	public id: string;
	public parentId: string;
	public contentId: string;
	public contentUserId: string;
	public children: string[];
	public x: number;
	public y: number;
	public level: number;
	public treeLocationData: ITreeLocationData;
	public aggregationTimer: number;
	public content: IContentData;
	public contentUserData: IContentUserData;
	public label: string;
	public size: number;
	public colorSlices: IColorSlice[];
	public proficiencyStats: IProficiencyStats;
	public proficiency: PROFICIENCIES;
	public overdue: boolean;
	public nextReviewTime: timestamp;
	public highlighted: boolean;
	private constantlyRecalculatingColors: boolean;
	private recalculateIntervalId: number;

	constructor(@inject(TYPES.SigmaNodeArgs)
								{
									id,
									parentId,
									contentId,
									children,
									x,
									y,
									level,
									treeLocationData,
									content,
									contentUserData,
									label,
									proficiencyStats,
									size,
									aggregationTimer,
									colorSlices,
									overdue,
									nextReviewTime,
									highlighted,
									constantlyRecalculatingColors,
									recalculateIntervalId,
								}: SigmaNodeArgs = {
		id: undefined,
		parentId: undefined,
		contentId: undefined,
		children: undefined,
		x: undefined,
		y: undefined,
		treeLocationData: undefined,
		level: undefined,
		content: undefined,
		contentUserData: undefined,
		proficiencyStats: undefined,
		label: undefined,
		size: undefined,
		aggregationTimer: undefined,
		colorSlices: undefined,
		overdue: undefined,
		nextReviewTime: undefined,
		highlighted: undefined,
		constantlyRecalculatingColors: false,
		recalculateIntervalId: undefined,
	}) {
		this.id = id;
		this.parentId = parentId;
		this.contentId = contentId;
		this.children = children;
		this.x = x;
		this.y = y;
		this.level = level;
		this.treeLocationData = treeLocationData;
		this.proficiencyStats = proficiencyStats;
		this.aggregationTimer = aggregationTimer;
		this.content = content || {
			type: CONTENT_TYPES.LOADING,
			title: 'loading . . .',
			// '' // can't be simply undefined or else sigmajs will have trouble rendering a prope
		};
		this.contentUserData = contentUserData;
		this.label = label || 'Default Node Label';
		this.size = size || DEFAULT_NODE_SIZE;
		this.colorSlices = colorSlices;
		this.overdue = overdue;
		this.highlighted = highlighted;
		this.nextReviewTime = nextReviewTime;

		this.constantlyRecalculatingColors = constantlyRecalculatingColors
		this.recalculateIntervalId = recalculateIntervalId
	}

	public receiveNewTreeData(tree: ITreeDataWithoutId) {
		this.parentId = tree.parentId;
		this.contentId = tree.contentId;
		this.children = tree.children;
	}

	public receiveNewTreeUserData(treeUserData: ITreeUserData) {
		this.colorSlices = SigmaNodeUtils.getColorSlicesFromProficiencyStats(treeUserData.proficiencyStats);
		this.aggregationTimer = treeUserData.aggregationTimer;
		this.proficiencyStats = treeUserData.proficiencyStats;
	}

	public receiveNewContentData(contentData: IContentData) {
		this.label = ContentItemUtils.getLabelFromContent(contentData);
		this.content = contentData;
	}

	public receiveNewContentUserData(contentUserData: IContentUserData) {
		this.stopConstantlyRecalculatingColors();
		this.contentUserId = contentUserData.id;
		this.overdue = contentUserData.overdue;
		this.nextReviewTime = contentUserData.nextReviewTime;
		this.size = ContentUserDataUtils.getSizeFromContentUserData(contentUserData);
		this.contentUserData = contentUserData;
		this.proficiency = contentUserData.proficiency;
		this.recalculateColors()

		if (!this.constantlyRecalculatingColors) {
			this.startConstantlyRecalculatingColors()
		}
	}

	public receiveNewTreeLocationData(treeLocationData: ITreeLocationData) {
		const pointVal: ICoordinate = treeLocationData.point;
		this.x = pointVal.x;
		this.y = pointVal.y;
		this.level = treeLocationData.level;
		this.treeLocationData = treeLocationData;
	}

	public highlight() {
		this.highlighted = true;
	}

	public unhighlight() {
		this.highlighted = false;
	}

	private stopConstantlyRecalculatingColors() {
		this.constantlyRecalculatingColors = false
		;(window as any).clearInterval(this.recalculateIntervalId)

	}

	private startConstantlyRecalculatingColors() {
		this.constantlyRecalculatingColors = true
		const NUM_RECALCULATE_PERIODS_BETWEEN_LAST_REVIEW_AND_OVERDUE = 4
		const secondsTilRecalculate = calculateSecondsTilCriticalReviewTime(
			this.contentUserData.lastEstimatedStrength
		) / NUM_RECALCULATE_PERIODS_BETWEEN_LAST_REVIEW_AND_OVERDUE
		this.recalculateIntervalId = (window as any).setInterval(() => {
			this.recalculateColors()
		}, secondsTilRecalculate * 1000)

	}

	/* TODO: this class shouldn't have a reference to sigma instance.
	 But whatever class (SigmaNodesHandlers?) that has acccess to the instance
		of this class should call sigmaInstance.refresh() after an update is called on this class
		*/

	private recalculateColors() {
		this.colorSlices = SigmaNodeUtils.getColorSlicesFromProficiencyAndForgettingCurve({
			proficiency: this.proficiency,
			lastReviewTime: this.contentUserData.lastInteractionTime,
			lastEstimatedStrength: this.contentUserData.lastEstimatedStrength,
			now: Date.now()
		});
	}
}

@injectable()
export class SigmaNodeArgs {
	@inject(TYPES.String) public id: string;
	@inject(TYPES.String) public parentId: string;
	@inject(TYPES.String) public contentId: string;
	@inject(TYPES.Array) public children: string[];
	@inject(TYPES.Number) public x: number;
	@inject(TYPES.Number) public y: number;
	@inject(TYPES.Number) public level: number;
	@inject(TYPES.ITreeLocationData) public treeLocationData: ITreeLocationData;
	@inject(TYPES.String) public label: string;
	@inject(TYPES.Number) public size: number;
	@inject(TYPES.IContentData) public content: IContentData;
	@inject(TYPES.IContentUserData) public contentUserData: IContentUserData;
	@inject(TYPES.Number) public aggregationTimer: number;
	@inject(TYPES.IProficiencyStats) public proficiencyStats: IProficiencyStats;
	@inject(TYPES.IColorSlice) public colorSlices: IColorSlice[];
	@inject(TYPES.Boolean) public overdue: boolean;
	@inject(TYPES.Number) public nextReviewTime: number;
	@inject(TYPES.Boolean) public highlighted: boolean;
	@inject(TYPES.Boolean) public constantlyRecalculatingColors: boolean;
	@inject(TYPES.Number) public recalculateIntervalId: number;
}
