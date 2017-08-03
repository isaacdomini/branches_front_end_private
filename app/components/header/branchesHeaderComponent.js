import {newTree} from '../../objects/newTree.js'
import {Config} from '../../core/config'
import {login} from '../../core/login'
import user from '../../objects/user'
import PubSub from 'pubsub-js'
//temporary hacky solution for controller
export default {
    template: require('./branches-header.html'),
    created () {
        const self = this
        self.loggedIn = false
        self.user = {}
        self.username = ''
        PubSub.subscribe('login', () => {
            console.log('login detected inside branchesheader')
            self.loggedIn = true
            self.user = user
            self.username = user.fbData.displayName
            console.log('branches header loggedIn is now', self.loggedIn)
        })
    },
    data () {
        return {
            version: Config.version,
            user: this.user,
            loggedIn: this.loggedIn,
            username: this.username
        }
    },
    methods: {
        login () {
            this.loggedIn=true
            login()
        }
    }
}
