import '../components/treesGraph'
import Vue from 'vue'
import Header from '../components/header/branchesHeader'
import ReviewSchedule from '../components/reviewAlgorithm/reviewSchedule'
import ContentList from '../components/contentList/contentList'
import ExerciseCreator from '../components/exerciseCreator/exerciseCreator'
import NewExercise from '../components/exerciseCreator/newExercise'
import ExerciseList from '../components/exerciseList/exerciseList'
import Tree from '../components/tree/tree'
import NewTree from '../components/newTree/newtreecomponent'
import Toolbar from '../components/toolbar/toolbar'
Vue.component('branchesHeader', Header)
Vue.component('reviewSchedule', ReviewSchedule)
Vue.component('contentList', ContentList)
Vue.component('exerciseCreator', ExerciseCreator)
Vue.component('exerciseList', ExerciseList)
Vue.component('newExercise', NewExercise)
Vue.component('tree', Tree)
Vue.component('newtree', NewTree)
Vue.component('toolbar', Toolbar)
