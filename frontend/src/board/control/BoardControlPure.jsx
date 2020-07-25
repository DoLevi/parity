import React from 'react';
import Flexbox from 'flexbox-react';

const BoardControlPure = ({setPromptState}) => (
    <Flexbox flexWrap="wrap" flexDirection="row" padding="4px" margin="8px" justifyContent="center">
        <button onClick={() => setPromptState('addPoint')} style={{margin: "2px"}}>
            Add Point
        </button>
        <button onClick={() => setPromptState('removePoint')} style={{margin: "2px"}}>
            Remove Point
        </button>
        <button onClick={() => setPromptState('addEdge')} style={{margin: "2px"}}>
            Add Edge
        </button>
        <button onClick={() => setPromptState('removeEdge')} style={{margin: "2px"}}>
            Remove Edge
        </button>
    </Flexbox>
);

export default BoardControlPure;