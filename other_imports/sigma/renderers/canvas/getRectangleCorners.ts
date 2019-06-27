import {ISigmaNode} from '../../../../app/objects/interfaces';
import {getDimensions} from '../../getDimensions';

export function calculateSizeFromNode(node: ISigmaNode, settings): number {
	const {size} = getDimensions(node, settings);
	return size
}

// export function examplefunction(arg1, arg2): number {
// 	const {size} = getDimensions(arg1, arg2);
// 	return 2
// }

export const CARD_HEIGHT_TO_NODE_SIZE_RATIO = 5
export const CARD_WIDTH_TO_NODE_SIZE_RATIO = 10
export function getRectangleCorners(centerX, centerY, size) {

	const halfWidth = calculateCardWidth(null, size) / 2;
	const halfHeight = calculateCardHeight(null, size) / 2
	const obj = {
		x1: centerX - halfWidth,
		y1: centerY - halfHeight,
		x2: centerX + halfWidth,
		y2: centerY + halfHeight,
		height: halfHeight * 2,
	}
	// console.log(obj, "centerX, centerY, size",centerX, centerY, size )
	return obj
}

export function calculateCardHeight(node, size, prefix = 'renderer1:') {
	size = node ? node[prefix + 'size'] : size;
	return size * CARD_HEIGHT_TO_NODE_SIZE_RATIO;
}
export function calculateCardHeightFromNode(node: ISigmaNode, prefix = 'renderer1:') {
	return calculateCardHeight(node, null, prefix)

}
export function calculateCardWidthFromNode(node: ISigmaNode, prefix = 'renderer1:') {
	return calculateCardWidth(node, null, prefix)

}
/*
export function drawNodeWithText({
 node,
 context, settings, x, y
	 }: {
	node: ISigmaNode,
	context,
	settings,
	x,
	y
}) {
	const prefix = settings('prefix') : ''
	var label = node.label.length > 20 ? node.label.substring(0, 19) + ' . . .' : node.label
	var x: number = Math.round(node[prefix + 'x'])
	var y: number = Math.round(node[prefix + 'y'])


		node.label.length > 20 ? node.label.substring(0, 19) + ' . . .' : node.label
	// context.fillText(
	// 	label,
	// 	x,
	// 	y
	// );

	const text = label + 'word word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoword word2 ipsum lorem dolor sit amet armum virumque Cano troiae qui primus ab oris ab italiam fatoo'
	const maxWidth = 400
	const lineHeight = 24
	wrapText(context, text, x, y, maxWidth, lineHeight)

	function wrapText(context, text, x, y, maxWidth, lineHeight) {
		var words = text.split(' ');
		var line = '';

		for (var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				context.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			} else {
				line = testLine;
			}
		}
		context.fillText(line, x, y);
	}
}
*/

// TODO: start calling this differently such that, inside of the function we fetch the size from the renderer
export function calculateCardWidth(node, size, prefix = 'renderer1:') {
	size = node ? node[prefix + 'size'] : size;
	return size * CARD_WIDTH_TO_NODE_SIZE_RATIO;
}