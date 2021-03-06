import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';

const env = process.env.NODE_ENV || 'development';
let template = '';
if (env === 'test') {
	const register = require('ignore-styles').default || require('ignore-styles');
	register(['.html', '.less']);
} else {
	template = require('./mapChooser.html').default;
	require('./mapChooser.less');
}
// tslint:disable-next-line no-var-requires
export default {
	template, // '<div> {{movie}} this is the tree template</div>',
	data() {
		return {
			globalSelected: true,
			localSelected: false
		};
	},
	methods: {
		switchToGlobalMap() {
			this.globalSelected = true;
			this.localSelected = false;
			this.$store.commit(MUTATION_NAMES.SWITCH_TO_GLOBAL_MAP);
		},
		switchToPersonalMap() {
			this.localSelected = true;
			this.globalSelected = false;
			this.$store.commit(MUTATION_NAMES.SWITCH_TO_PERSONAL_MAP);
		},
	},
};
