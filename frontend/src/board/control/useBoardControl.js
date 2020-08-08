import { useState } from "react";


const useBoardControl = (unsetPromptState, addPoint, addEdge) => {
    const [pointName, setPointName] = useState('');
    const [initial, setInitial] = useState(false);
    const [player0, setPlayer0] = useState(false);
    const [parity, setParity] = useState(undefined);

    const [edgeName, setEdgeName] = useState('');
    const [edgeSourceName, setEdgeSourceName] = useState('');
    const [edgeTargetName, setEdgeTargetName] = useState('');

    const generateInputObjects = (promptState) => {
        switch (promptState) {
            case 'addNode':
                return [{
                    id: 'nodeName',
                    type: 'text',
                    placeholder: 'Enter node name',
                    value: pointName,
                    onChange: (event) => setPointName(event.target.value)
                }, {
                    id: 'nodeInitial',
                    type: 'checkbox',
                    placeholder: 'Initial',
                    value: "initial",
                    onChange: (event) => setInitial(event.target.checked)
                }, {
                    id: 'nodePlayer0',
                    type: 'checkbox',
                    placeholder: 'Player 0',
                    value: "player0",
                    onChange: (event) => setPlayer0(event.target.checked)
                }, {
                    id: 'nodeParity',
                    type: 'number',
                    placeholder: 'Parity',
                    value: parity,
                    onChange: (event) => setParity(event.target.value)
                }];
            case 'addEdge':
                return [{
                    id: 'edgeName',
                    type: 'text',
                    placeholder: 'Enter edge name',
                    value: edgeName,
                    onChange: (event) => setEdgeName(event.target.value)
                }, {
                    id: 'edgeSourceName',
                    type: 'text',
                    placeholder: 'Enter source node name',
                    value: edgeSourceName,
                    onChange: (event) => setEdgeSourceName(event.target.value)
                }, {
                    id: 'edgeTargetName',
                    type: 'text',
                    placeholder: 'Enter target node name',
                    value: edgeTargetName,
                    onChange: (event) => setEdgeTargetName(event.target.value)
                }];
            default:
                return [];
        }
    };

    const generateOnSubmit = (promptState) => {
        switch (promptState) {
            case 'addNode':
                return (event) => {
                    event.preventDefault();
                    addPoint({
                        name: pointName,
                        initial: initial,
                        player0: player0,
                        parity: parity,
                        x: 50,
                        y: 50
                    });
                    unsetPromptState();
                };
            case 'addEdge':
                return (event) => {
                    event.preventDefault();
                    addEdge({
                        name: edgeName,
                        sourceName: edgeSourceName,
                        targetName: edgeTargetName
                    });
                    unsetPromptState();
                };
            default:
                return () => undefined;
        }
    };

    return {
        generateInputObjects,
        generateOnSubmit
    };
};

export default useBoardControl;