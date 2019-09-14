// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import 'reflect-metadata';
import {
	ISigmaNodeData,
	IState,
} from '../../objects/interfaces';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
// tslint:disable-next-line no-var-requires
// const template = require('./knawledgeMap.html').default
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import './cardConfidenceButtons2.less';
import {calculateCardWidth} from '../../../other_imports/sigma/renderers/canvas/cardDimensions';
import {
	calcHeight,
	calculateTextSizeFromNodeSize
} from '../../../other_imports/sigma/renderers/canvas/getDimensions';
import {log} from '../../core/log';

const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
	const register = require('ignore-styles').default;
	register(['.html', '.less']);
}

const template = require('./cardConfidenceButtons2.html').default;

export default {
	template,
	created() {
		console.log('ccb2 created', this.cardId)
	},
	mounted() {
		console.log('ccb2 mounted', this.cardId)
	},
	props: {
		cardId: String,
	},
	data() {
		return {
			cardId: '123'
		};
	},
	watch: {
	},
	computed: {
		node(): ISigmaNodeData {
			const state: IState = this.$store.state
			return state.graph.nodes(this.cardId)
		},
		cardBottom() {
			if (this.node) {
				const bottom = this.cardCenter.y + this.cardHeight / 2
				return bottom
			}
		},
		cardCenter() {
			if (this.node) {
				return {
					x: this.node['renderer1:x'],
					y: this.node['renderer1:y'],
				}
			}
		},
		left() {
			if (this.node) {
				const left = this.cardCenter.x - this.cardWidth / 2
				console.log('cardConfidenceButtons2 left called', left, this.cardCenter.x, this.cardWidth)
				return left
			}
			// this.node()
		},
		cardWidth() {
			if (this.node) {
				const width = calculateCardWidth(null, Number.parseInt(this.renderedSize))
				console.log('cardConfidenceButtons2 cardWidth called', this.renderedSize, width)
				return width
			}
		},
		cardHeight() {
			if (!this.node) {
				return
			}
			const height = calcHeight(this.node)
			console.log('cardConfidenceButtons2 cardHeight called', this.renderedSize, height)
			return height
		},
		renderedSize() {
			if (this.node) {
				return this.node['renderer1:size']
			}
		},
		fontSize() {
			return calculateTextSizeFromNodeSize(this.renderedSize)
		},
		contentUserId() {
			return this.node.contentUserId
		},
		contentUserDataLoaded() {
			return this.contentUserData && Object.keys(this.contentUserData).length;
		},
		contentUserData() {
			const contentUserData = this.$store.getters.contentUserData(this.contentUserId) || {};
			// this.proficiencyInput = contentUserData.proficiency || PROFICIENCIES.UNKNOWN;
			return contentUserData;
		},
	},
	methods: {
		clickProficiencyOne() {
			this.proficiencyClicked(PROFICIENCIES.ONE)
		},
		clickProficiencyTwo() {
			this.proficiencyClicked(PROFICIENCIES.TWO)
		},
		clickProficiencyThree() {
			this.proficiencyClicked(PROFICIENCIES.THREE)
		},
		clickProficiencyFour() {
			this.proficiencyClicked(PROFICIENCIES.FOUR)
		},
		proficiencyClicked(proficiency: PROFICIENCIES) {
			const contentUserId = this.contentUserId;
			const currentTime = Date.now();
			log('cardMain proficiency clicked')
			if (!this.contentUserDataLoaded) {
				log(
					'ADD CONTENT INTERACTION IF NO CONTENT USER DATA ABOUT TO BE CALLED'
				);
				const contentUserData = this.$store.commit(
					MUTATION_NAMES.ADD_CONTENT_INTERACTION_IF_NO_CONTENT_USER_DATA,
					{
						contentUserId,
						proficiency,
						timestamp: currentTime,
					}
				);
			} else {
				log(
					'ADD CONTENT INTERACTION ABOUT TO BE CALLED '
				);
				this.$store.commit(MUTATION_NAMES.ADD_CONTENT_INTERACTION, {
					contentUserId,
					proficiency,
					timestamp: currentTime
				});
			}
			this.$store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD);
			this.$store.commit(MUTATION_NAMES.JUMP_TO_NEXT_FLASHCARD_IF_IN_PLAYING_MODE);
			this.$store.commit(MUTATION_NAMES.REFRESH); // needed to get rid of label disappearing bug

		}
	}
};
