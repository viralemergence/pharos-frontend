"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCreateNode = void 0;
const onCreateNode = async ({ node, createNodeId, loadNodeContent, createContentDigest, actions: { createNode, createParentChildLink }, }) => {
    // only look for image/svg+xml file nodes
    if (node.internal.mediaType !== 'image/svg+xml')
        return;
    // parse node and create content digest
    const content = await loadNodeContent(node);
    const contentDigest = createContentDigest({ content });
    // build the new node structure
    const svgNode = {
        id: createNodeId(`${node.id} >>> SVG`),
        contentDigest,
        children: [],
        parent: node.id,
        svgString: content,
        internal: {
            contentDigest,
            type: 'SVG',
        },
    };
    // create node and node relationships
    createNode(svgNode);
    createParentChildLink({ parent: node, child: svgNode });
};
exports.onCreateNode = onCreateNode;
