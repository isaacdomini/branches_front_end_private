import Vuex, {Store} from 'vuex'
import {ROOT_ID} from './globals';
import {log} from './log'

export const MUTATION_NAMES = {
    INITIALIZE_SIGMA_INSTANCE: 'initializeSigmaInstance',
    JUMP_TO: 'jump_to'
}
const state = {
    uri: null,
    centeredTreeId: ROOT_ID
};

const getters = {
}
const mutations = {
    initializeSigmaInstance() {

    }
}
mutations[MUTATION_NAMES.JUMP_TO] = (state, treeId) => {
    state.jumpToId = treeId

}
const actions = {}

export default class BranchesStore {
    constructor() {
        return new Vuex.Store({
            state,
            mutations,
            actions,
            getters,
        } ) as Store<any>
    }
}
