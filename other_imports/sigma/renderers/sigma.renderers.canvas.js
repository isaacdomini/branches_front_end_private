import conrad from '../conrad'
import sigma from '../sigma.core'
import {CustomSigmaEventNames} from "../../../app/objects/sigmaEventListener/customSigmaEvents";

let xCenter
let yCenter

function determineCenterCoord() {
    var w = window,
        d = document,
        e = d.documentElement,
        b = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || b.clientWidth,
        y = w.innerHeight || e.clientHeight || b.clientHeight;
    xCenter = x / 2
    yCenter = y / 2
}

/*if window.load event has already happened, then we can calculate the center x and y coordinates of the screen.
 if load event has not happened yet,
  then temporarily xcenter and yCenter will just be 0,0 */
determineCenterCoord()
/* if window.load event has NOT yet happened, we register an eventListener to wait to call .load */
window.addEventListener('load', (event) => {
    determineCenterCoord()
})
sigma.canvas = sigma.canvas || {}
// Initialize packages:
sigma.utils.pkg('sigma.renderers');

/**
 * This function is the constructor of the canvas sigma's renderer.
 *
 * @param  {sigma.classes.graph}            graph    The graph to render.
 * @param  {sigma.classes.camera}           camera   The camera.
 * @param  {configurable}           settings The sigma instance settings
 *                                           function.
 * @param  {object}                 branchesMap   The options branchesMap.
 * @return {sigma.renderers.canvas}          The renderer instance.
 */
sigma.renderers = sigma.renderers || {}
// sigma.c
sigma.renderers.canvas = function (graph, camera, settings, options) {
    if (typeof options !== 'object')
        throw 'sigma.renderers.canvas: Wrong arguments.';

    if (!(options.container instanceof HTMLElement)) {

        // console.log("options.container is", options.container, options)
        throw 'Container not found.';
    }

    var k,
        i,
        l,
        a,
        fn,
        self = this;

    sigma.classes.dispatcher.extend(this);

    // Initialize main attributes:
    Object.defineProperty(this, 'conradId', {
        value: sigma.utils.id()
    });
    this.graph = graph;
    this.camera = camera;
    this.contexts = {};
    this.domElements = {};
    this.options = options;
    this.container = this.options.container;
    this.settings = (
        typeof options.settings === 'object' &&
        options.settings
    ) ?
        settings.embedObjects(options.settings) :
        settings;

    // Node indexes:
    this.nodesOnScreen = [];
    this.edgesOnScreen = [];

    // Conrad related attributes:
    this.jobs = {};

    // Find the prefix:
    this.options.prefix = 'renderer' + this.conradId + ':';

    // Initialize the DOM elements:
    if (
        !this.settings('batchEdgesDrawing')
    ) {
        this.initDOM('canvas', 'scene');
        this.contexts.edges = this.contexts.scene;
        this.contexts.nodes = this.contexts.scene;
        this.contexts.labels = this.contexts.scene;
    } else {
        this.initDOM('canvas', 'edges');
        this.initDOM('canvas', 'scene');
        this.contexts.nodes = this.contexts.scene;
        this.contexts.labels = this.contexts.scene;
    }

    this.initDOM('canvas', 'mouse');
    this.contexts.hover = this.contexts.mouse;

    // Initialize captors:
    this.captors = [];
    // below line makes me think that this.options.captors is a string array of constructor function names (e.g. 'mouse', or 'touch'
    a = this.options.captors || [sigma.captors.mouse, sigma.captors.touch];
    for (i = 0, l = a.length; i < l; i++) {
        fn = typeof a[i] === 'function' ? a[i] : sigma.captors[a[i]];
        this.captors.push(
            new fn(
                this.domElements.mouse,
                this.camera,
                this.settings
            )
        );
    }

    // Deal with sigma events:
    sigma.misc.bindEvents.call(this, this.options.prefix);
    sigma.misc.drawHovers.call(this, this.options.prefix);

    this.resize(false);
};


/**
 * This method renders the graph on the canvases.
 *
 * @param  {?object}                options Eventually an branchesMap of options.
 * @return {sigma.renderers.canvas}         Returns the instance itself.
 */
sigma.renderers.canvas.prototype.render = function (options, dontPublish) {
    // console.log('sigma canvas render called')
    // console.log("sigma renderers canvas width and height are :", this.width, this.height, ' and this is ', this)

    options = options || {};
    dontPublish = dontPublish || false

    // window.resetLabelData()
    var a,
        i,
        k,
        l,
        o,
        id,
        end,
        job,
        start,
        edges,
        edge,
        renderers,
        rendererType,
        batchSize,
        tempGCO,
        index = {},
        graph = this.graph,
        nodes = this.graph.nodes,
        prefix = this.options.prefix || '',
        drawEdges = this.settings(options, 'drawEdges'),
        drawNodes = this.settings(options, 'drawNodes'),
        drawLabels = this.settings(options, 'drawLabels'),
        drawEdgeLabels = this.settings(options, 'drawEdgeLabels'),
        embedSettings = this.settings.embedObjects(options, {
            prefix: this.options.prefix
        });
    var self = this

    // Call the resize function:
    this.resize(false);

    // Check the 'hideEdgesOnMove' setting:
    if (this.settings(options, 'hideEdgesOnMove'))
        if (this.camera.isAnimated || this.camera.isMoving)
            drawEdges = false;

    // Apply the camera's view:
    this.camera.applyView(
        undefined,
        this.options.prefix,
        {
            width: this.width,
            height: this.height
        }
    );

    // Clear canvases:
    this.clear();

    // Kill running jobs:
    for (k in this.jobs)
        if (conrad.hasJob(k))
            conrad.killJob(k);

    // Find which nodes are on screen:
    this.edgesOnScreen = [];
    var rect = this.camera.getRectangle(this.width, this.height);
    // console.log('sigma renderers canvas rect is ', rect)
    this.graph.nodes().forEach(node => {
        node.onScreen = false
        delete node.distanceFromCenter
    })
    // console.log('sigma renderers canvas nodes is ', this.graph.nodes())
    var A_BIG_NUMBER = 999999999
    let mostCenteredNodeId = null
    let mostCenteredNodeDistance = A_BIG_NUMBER
    const nodesOnScreen = this.camera.quadtree.area(rect)
    const nodesOnScreenAndPartOfMap = nodesOnScreen.filter(
        (node) => node.treeLocationData.mapId === this.mapIdToRender
    )

    nodesOnScreenAndPartOfMap.forEach(node => {
        node.onScreen = true
        const x = node[prefix + "x"]
        const y = node[prefix + "y"]
        const x2 = node[prefix + ":x"]
        const y2 = node[prefix + ":y"]
        node.distanceFromCenter = Math.sqrt(Math.pow(x - xCenter, 2) + Math.pow(y - yCenter, 2))
        if (node.distanceFromCenter < mostCenteredNodeDistance) {
            mostCenteredNodeId = node.id
            mostCenteredNodeDistance = node.distanceFromCenter
        }
    })
    //dispatches the event on the renderer canvas . . .but not the sigmaInstance as a whole.
    this.dispatchEvent(CustomSigmaEventNames.CENTERED_NODE, {
        centeredNodeId: mostCenteredNodeId
    })

    this.graph.nodes().forEach(node => {
        // console.log("node => ", node.onScreen)
        // delete node.distanceFromCenter
    })
    // console.log("nodesOn")
    // if (!window.previousMostCenteredNodeId || window.mostCenteredNodeId !== window.previousMostCenteredNodeId){
    //     // !dontPublish && PubSub.publish('mostCenteredNodeId', window.mostCenteredNodeId)
    // }
    // window.previousMostCenteredNodeId = window.mostCenteredNodeId
    this.nodesOnScreen = nodesOnScreen; //this.camera.quadtree.area(
    // stores.commit('setMostCenteredTree', window.mostCenteredNodeId)
    // this.camera.getRectangle(this.width, this.height)
    // );

    for (a = nodesOnScreenAndPartOfMap, i = 0, l = a.length; i < l; i++) {
        index[a[i].id] = a[i];
    }

    // Draw edges:
    // - If settings('batchEdgesDrawing') is true, the edges are displayed per
    //   batches. If not, they are drawn in one frame.
    if (drawEdges) {
        // First, let's identify which edges to draw. To do this, we just keep
        // every edges that have at least one extremity displayed according to
        // the quadtree and the "hidden" attribute. We also do not keep hidden
        // edges.
        for (a = graph.edges(), i = 0, l = a.length; i < l; i++) {
            o = a[i];
            if (
                (index[o.source] || index[o.target]) &&
                (!o.hidden && !nodes(o.source).hidden && !nodes(o.target).hidden)
            )
                this.edgesOnScreen.push(o);
        }

        // If the "batchEdgesDrawing" settings is true, edges are batched:
        if (this.settings(options, 'batchEdgesDrawing')) {
            id = 'edges_' + this.conradId;
            batchSize = embedSettings('canvasEdgesBatchSize');

            edges = this.edgesOnScreen;
            l = edges.length;

            start = 0;
            end = Math.min(edges.length, start + batchSize);

            job = function () {
                tempGCO = this.contexts.edges.globalCompositeOperation;
                this.contexts.edges.globalCompositeOperation = 'destination-over';

                renderers = sigma.canvas.edges;
                for (i = start; i < end; i++) {
                    edge = edges[i];
                    const edgeRenderer = renderers['curve'] // renderers[edge.type || this.settings(options, 'defaultEdgeType')] || renderers.def
                    edgeRenderer(
                        edge,
                        graph.nodes(edge.source),
                        graph.nodes(edge.target),
                        this.contexts.edges,
                        embedSettings,
                    );
                }

                // Draw edge labels:
                if (drawEdgeLabels) {
                    renderers = sigma.canvas.edges.labels;
                    for (i = start; i < end; i++) {
                        edge = edges[i];
                        if (!edge.hidden)
                            (renderers[
                            edge.type || this.settings(options, 'defaultEdgeType')
                                ] || renderers.def)(
                                edge,
                                graph.nodes(edge.source),
                                graph.nodes(edge.target),
                                this.contexts.labels,
                                embedSettings
                            );
                    }
                }

                // Restore original globalCompositeOperation:
                this.contexts.edges.globalCompositeOperation = tempGCO;

                // Catch job's end:
                if (end === edges.length) {
                    delete this.jobs[id];
                    return false;
                }

                start = end + 1;
                end = Math.min(edges.length, start + batchSize);
                return true;
            };

            this.jobs[id] = job;
            conrad.addJob(id, job.bind(this));

            // If not, they are drawn in one frame:
        } else {
            renderers = sigma.canvas.edges;
            for (i = 0, l = this.edgesOnScreen.length; i < l; i++) {
                edge = this.edgesOnScreen[i];
                const renderer = renderers['curve']; // = (renderers[
                    // edge.type || this.settings(options, 'defaultEdgeType')
                    // ] || renderers.def);
                renderer(
                    edge,
                    graph.nodes(edge.source),
                    graph.nodes(edge.target),
                    this.contexts.edges,
                    embedSettings
                );
            }

            // Draw edge labels:
            // - No batching
            if (drawEdgeLabels) {
                renderers = sigma.canvas.edges.labels;
                for (i = 0, l = this.edgesOnScreen.length; i < l; i++) {
                    const edge = this.edgesOnScreen[i];
                    if (edge.hidden) {
                        continue;
                    }
                    const renderer = (
                        renderers[
                            edge.type
                            || this.settings(options, 'defaultEdgeType')
                            ] || renderers.def);
                    renderer(
                        edge,
                        graph.nodes(edge.source),
                        graph.nodes(edge.target),
                        this.contexts.labels,
                        embedSettings
                    );
                }
            }
        }
    }

    // Draw nodes:
    // - No batching
    let nodesToRender
    if (drawNodes) {
        // console.log(' sigma renderers canvas:  drawNodes about to get called', drawNodes)
        renderers = sigma.canvas.nodes;
        nodesToRender = nodesOnScreenAndPartOfMap.filter(n => !n.hidden)
        for (a = nodesToRender, i = 0, l = a.length; i < l; i++) {
            const nodeType = a[i].type || this.settings(options, 'defaultNodeType')
            const renderer = renderers[nodeType] || renderers.def
            renderer(a[i], this.contexts.nodes, embedSettings)
        }
    }

    // Draw labels:
    // - No batching
    if (drawLabels) {
        // console.log('drawLabels caled')
        renderers = sigma.canvas.labels;
        if (!nodesToRender) {
            nodesToRender = nodesOnScreenAndPartOfMap.filter(n => !n.hidden)
        }
        for (a = nodesToRender, i = 0, l = a.length; i < l; i++) {
            const nodeType = a[i].type || this.settings(options, 'defaultNodeType')
            const renderer = renderers[nodeType] || renderers.def
            renderer(a[i], this.contexts.labels, embedSettings)
        }
    }

    this.dispatchEvent('render');
    // !dontPublish && PubSub.publish('canvas.rendered')

    return this;
};

/**
 * This method creates a DOM element of the specified type, switches its
 * position to "absolute", references it to the domElements attribute, and
 * finally appends it to the container.
 *
 * @param  {string} tag The label tag.
 * @param  {string} id  The id of the element (to stores it in "domElements").
 */
sigma.renderers.canvas.prototype.initDOM = function (tag, id) {
    var dom = typeof document !== 'undefined' && document.createElement(tag);

    dom.style.position = 'absolute';
    dom.setAttribute('class', 'sigma-' + id);

    this.domElements[id] = dom;
    this.container.appendChild(dom);

    if (tag.toLowerCase() === 'canvas')
        this.contexts[id] = dom.getContext('2d');
};

/**
 * This method resizes each DOM elements in the container and stores the new
 * dimensions. Then, it renders the graph.
 *
 * @param  {?number}                width  The new width of the container.
 * @param  {?number}                height The new height of the container.
 * @return {sigma.renderers.canvas}        Returns the instance itself.
 */
sigma.renderers.canvas.prototype.resize = function (w, h) {
    var k,
        oldWidth = this.width,
        oldHeight = this.height,
        pixelRatio = sigma.utils.getPixelRatio();

    if (w !== undefined && h !== undefined) {
        this.width = w;
        this.height = h;
    } else {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        w = this.width;
        h = this.height;
    }

    if (oldWidth !== this.width || oldHeight !== this.height) {
        for (k in this.domElements) {
            this.domElements[k].style.width = w + 'px';
            this.domElements[k].style.height = h + 'px';

            if (this.domElements[k].tagName.toLowerCase() === 'canvas') {
                this.domElements[k].setAttribute('width', (w * pixelRatio) + 'px');
                this.domElements[k].setAttribute('height', (h * pixelRatio) + 'px');

                if (pixelRatio !== 1)
                    this.contexts[k].scale(pixelRatio, pixelRatio);
            }
        }
    }

    return this;
};

/**
 * This method clears each canvas.
 *
 * @return {sigma.renderers.canvas} Returns the instance itself.
 */
sigma.renderers.canvas.prototype.clear = function () {
    for (var k in this.contexts) {
        this.contexts[k].clearRect(0, 0, this.width, this.height);
    }

    return this;
};

/**
 * This method kills contexts and other attributes.
 */
sigma.renderers.canvas.prototype.kill = function () {
    var k,
        captor;

    // Kill captors:
    while ((captor = this.captors.pop()))
        captor.kill();
    delete this.captors;

    // Kill contexts:
    for (k in this.domElements) {
        this.domElements[k].parentNode.removeChild(this.domElements[k]);
        delete this.domElements[k];
        delete this.contexts[k];
    }
    delete this.domElements;
    delete this.contexts;
};


/**
 * The labels, nodes and edges renderers are stored in the three following
 * objects. When an element is drawn, its type will be checked and if a
 * renderer with the same name exists, it will be used. If not found, the
 * default renderer will be used instead.
 *
 * They are stored in different files, in the "./canvas" folder.
 */
sigma.canvas.nodes = sigma.canvas.nodes || {}
sigma.canvas.edges = sigma.canvas.edges || {}
sigma.canvas.labels = sigma.canvas.labels || {}
sigma.utils.pkg('sigma.canvas.nodes');
sigma.utils.pkg('sigma.canvas.edges');
sigma.utils.pkg('sigma.canvas.labels');
