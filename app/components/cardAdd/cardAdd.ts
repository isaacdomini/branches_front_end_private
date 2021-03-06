import {
	CONTENT_TYPES,
	IContentData,
	ITreeLocationData,
} from '../../objects/interfaces';
import Vue
	from 'vue';
import './cardAdd.less';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {INewChildTreeMutationArgs} from '../../core/store/store_interfaces';

const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
	const register = require('ignore-styles').default || require('ignore-styles');
	register(['.html', '.less']);
}

let template = require('./cardAdd.html').default || require('./cardAdd.html');

const selectedTypeButtonStyle = `
font-size: 24px;
border-bottom-width: 4px;
border-bottom-color: #18008e;
`;
export default {
	template,
	props: ['parentId', 'parentX', 'parentY', 'primaryparenttreecontenturi'],
	created() {
		console.log('cardAdd created', this.parentId)
		switch (this.type) {
			case CONTENT_TYPES.CATEGORY:
				this.setTypeToCategoryUILogic();
				break;
			case CONTENT_TYPES.FLASHCARD:
				this.setTypeToFlashcardUILogic();
				break;
		}

	},
	data() {
		return {
			question: '',
			answer: '',
			title: '',
			type: CONTENT_TYPES.FLASHCARD
		}
	},
	computed: {
		parentLocation(): ITreeLocationData {
			return this.$store.getters.treeLocationData(this.parentId);
		},
		categorySelectorStyle() {
			return this.contentIsCategory ?
				selectedTypeButtonStyle : ''; // classes weren't working so im inline CSS-ing it
		},
		factSelectorStyle() {
			return this.contentIsFact ?
				selectedTypeButtonStyle : ''; // classes weren't working so im inline CSS-ing it
		},
		skillSelectorStyle() {
			return this.contentIsSkill ?
				selectedTypeButtonStyle : ''; // classes weren't working so im inline CSS-ing it
		},
		contentIsFact() {
			return this.type === CONTENT_TYPES.FLASHCARD; // 'fact'
		},
		contentIsCategory() {
			return this.type === CONTENT_TYPES.CATEGORY; // 'category'
		},
		contentIsSkill() {
			return this.type === CONTENT_TYPES.SKILL; // 'skill'
		},
	},
	methods: {
		createNewTree(
			{question, answer, title, type}: IContentData
				= {
				question: '',
				answer: '',
				title: '',
				type: CONTENT_TYPES.FLASHCARD
			}) {
			const newChildTreeArgs: INewChildTreeMutationArgs = {
				parentTreeId: this.parentId,
				timestamp: Date.now(),
				contentType: type,
				question,
				answer,
				title,
				parentLocation: this.parentLocation,
			};
			this.$store.commit(MUTATION_NAMES.NEW_CHILD_TREE, newChildTreeArgs);
		},
		submitForm() {
			const newContentData: IContentData = {
				question: this.question,
				answer: this.answer,
				title: this.title,
				type: this.type
			};
			if (!newContentDataValid(newContentData)) {
				return;
			}
			this.createNewTree(newContentData);
			// clear form
			this.question = '';
			this.answer = '';
			this.title = '';
			// focus cursor
			switch (this.type) {
				case CONTENT_TYPES.FLASHCARD:
					this.$refs.question.focus();
					break;
				case CONTENT_TYPES.CATEGORY:
					this.$refs.category.focus();
					break;
			}
		},
		async setTypeToCategory() {
			this.type = CONTENT_TYPES.CATEGORY;
			this.setTypeToCategoryUILogic();
		},
		async setTypeToFlashcard() {
			this.type = CONTENT_TYPES.FLASHCARD;
			await this.setTypeToFlashcardUILogic()
		},
		async setTypeToAnythingLogic() {
			await Vue.nextTick;
		},
		async setTypeToFlashcardUILogic() {
			await this.setTypeToAnythingLogic();
			this.$refs.question.focus();
		},
		async setTypeToCategoryUILogic() {
			await this.setTypeToAnythingLogic();
			this.$refs.category.focus();
		},
		setTypeToSkill() {
			this.type = CONTENT_TYPES.SKILL;
		}
	}
};

export function newContentDataValid(contentData: IContentData): boolean {
	return !!(contentData &&
		(contentData.title ||
			(contentData.question && contentData.answer)
		)
	);

}
