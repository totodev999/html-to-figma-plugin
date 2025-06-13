import { addLayersToFrame, defaultFont } from '../../src/figma';
import { PlainLayerNode } from '../../src/types';

//@ts-ignore
figma.showUI(__html__, {
    width: 600,
    height: 600,
});

const name = 'HTML-TO-FIGMA RESULT';

interface MsgData {
    layers: PlainLayerNode;
}

figma.ui.onmessage = async (msg) => {
    console.log('messss', msg);
    if (msg.type === 'import') {
        await figma.loadFontAsync(defaultFont);

        const { data } = msg;

        console.log('data', data);

        let { layers } = data as MsgData;
        console.log('layers', layers);

        let baseFrame: PageNode | FrameNode = figma.currentPage;
        let frameRoot: SceneNode = baseFrame as any;

        let x = 0,
            y = 0;
        let currentNode = figma.currentPage.findOne((n) => n.name === name);

        if (currentNode) {
            x = currentNode.x;
            y = currentNode.y;
        }

        layers.x = x;
        layers.y = y;

        await addLayersToFrame([layers], baseFrame, ({ node, parent }) => {
            if (!parent) {
                frameRoot = node;
                node.name = name;
            }
        });

        currentNode?.remove();
    }
};
