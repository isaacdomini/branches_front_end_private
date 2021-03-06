import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {
	ICreateUserWithEmailMutationArgs,
	ILoginWithEmailMutationArgs,
	IState
} from '../../objects/interfaces';
import smoothscroll from 'smoothscroll-polyfill';

// kick off the polyfill!
// smoothscroll.polyfill();

const env = process.env.NODE_ENV || 'development';
let template;

if (env === 'test') {
	let register = require('ignore-styles').default || require('ignore-styles');
	register(['.html, .less']);
} else {
	let style = require('./auth.less').default || require('./auth.less');
	template = require('./auth.html').default || require('./auth.html');
}
// tslint:disable-next-line no-var-requires
export default {
	template, // '<div> {{movie}} this is the tree template</div>',
	data() {
		return {
			signUpMode: true
		}
	},
	computed: {
		loggedIn() {
			return this.$store.getters.loggedIn;
		},
		hasAccess() {
			return false;
			// return await this.$store.getters.hasAccess;
		},
		signUpWithEmailErrorMessage() {
			const state: IState = this.$store.state
			return state.signUpWithEmailErrorMessage
		},
		loginWithEmailErrorMessage() {
			const state: IState = this.$store.state
			return state.loginWithEmailErrorMessage
		}
	},
	// TODO: loggedIn getter
	methods: {
		jumpDown() {
			const el = document.querySelector('#more')
			el.scrollIntoView({behavior: 'smooth'});
		}
		// createUserWithEmail() {
		// 	console.log("create with email called vue")
		// 	const email = this.$refs.emailCreate.value
		// 	const password = this.$refs.passwordCreate.value
		// 	const passwordConfirm = this.$refs.passwordCreateConfirm.value
		// 	if (password !== passwordConfirm) {
		// 		return this.showPasswordError()
		// 	}
		// 	const mutationArgs: ICreateUserWithEmailMutationArgs = {
		// 		email,
		// 		password
		// 	}
		// 	this.$store.commit(MUTATION_NAMES.CREATE_USER_WITH_EMAIL, mutationArgs);
		// },
		// showPasswordError() {
		// 	this.signUpWithEmailErrorMessage()
		// },
		// removePasswordError() {
		//
		// },
		// loginWithFacebook() {
		// 	this.$store.commit(MUTATION_NAMES.LOGIN_WITH_FACEBOOK);
		// }

	}
};
