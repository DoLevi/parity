import { useState } from "react";


const useBoardControl = (unsetPromptState, addPoint, removePoint, addEdge, removeEdge) => {
    const [pointName, setPointName] = useState('');
    const [edgeName, setEdgeName] = useState('');
    const [edgeSourceName, setEdgeSourceName] = useState('');
    const [edgeTargetName, setEdgeTargetName] = useState('');

    const generateInputObjects = (promptState) => {
        switch (promptState) {
            case 'addPoint':  // fall-through
            case 'removePoint':  // which this is subject to change
                return [{
                    id: 'pointName',
                    placeholder: 'Enter node name',
                    value: pointName,
                    onChange: (event) => setPointName(event.target.value)
                }];
            case 'addEdge':
                return [{
                    id: 'edgeName',
                    placeholder: 'Enter edge name',
                    value: edgeName,
                    onChange: (event) => setEdgeName(event.target.value)
                }, {
                    id: 'edgeSourceName',
                    placeholder: 'Enter source node name',
                    value: edgeSourceName,
                    onChange: (event) => setEdgeSourceName(event.target.value)
                }, {
                    id: 'edgeTargetName',
                    placeholder: 'Enter target node name',
                    value: edgeTargetName,
                    onChange: (event) => setEdgeTargetName(event.target.value)
                }];
            case 'removeEdge':
                return [{
                    id: 'edgeName',
                    placeholder: 'Enter edge name',
                    value: edgeName,
                    onChange: (event) => setEdgeName(event.target.value)
                }];
            default:
                return [];
        }
    };

    const generateOnSubmit = (promptState) => {
        switch (promptState) {
            case 'addPoint':
                return (event) => {
                    event.preventDefault();
                    addPoint({
                        name: pointName,
                        x: 50,
                        y: 50
                    });
                    unsetPromptState();
                };
            case 'removePoint':
                return (event) => {
                    event.preventDefault();
                    removePoint(pointName);
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
            case 'removeEdge':
                return (event) => {
                    event.preventDefault();
                    removeEdge(edgeName);
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