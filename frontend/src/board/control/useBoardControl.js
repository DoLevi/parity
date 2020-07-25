import { useState } from "react";


const useBoardControl = (addPoint, unsetPromptState) => {
    const [pointName, setPointName] = useState('');

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
                return [];
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