import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {ISigmaUpdater} from '../interfaces';
// import GraphData = SigmaJs.GraphData;
// import SigmaConfigs = SigmaJs.SigmaConfigs;
// import Sigma = SigmaJs.Sigma;
// import Graph = SigmaJs.Graph;
// import Node = SigmaJs.Node
import {log, error} from '../../core/log'
import BranchesStore, {MUTATION_NAMES} from '../../core/store2';
// import {SigmaJs} from 'sigmajs';

@injectable()
export class SigmaUpdater implements ISigmaUpdater {
    private store // : BranchesStore // : Graph
    // private refresh: () => void
    // private focusNode: (node: Node) => void
    constructor(@inject(TYPES.SigmaUpdaterArgs){store}: SigmaUpdaterArgs) {
        this.store = store
        // this.refresh = refresh
        // this.graph = graph
        // this.focusNode = focusNode
    }
    public addNode(node: Node): void {
        this.store.commit(MUTATION_NAMES.ADD_NODE, node)
        /* TODO: LOL. DO i even need this class any more? seems like maybe an uncessary level of indirection.
         unless i actually am going to use the stuff I am commenting out
          */
        // this.graph.addNode(node)
        // this.focusNode(node)
        // this.refresh()
    }

}

@injectable()
export class SigmaUpdaterArgs {
    // @inject(TYPES.Function) public refresh: () => void
    // @inject(TYPES.Function) public focusNode: (node: Node) => void
    @inject(TYPES.Object) public store // : Graph
}

// function focusNode(camera, node) {
//     const cameraCoord = {
//         x: node['read_cam0:x'],
//         y: node['read_cam0:y'],
//         ratio: 0.20
//     };
//     camera.goTo(cameraCoord);
// }
