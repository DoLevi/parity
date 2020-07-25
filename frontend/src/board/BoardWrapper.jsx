import React from 'react';
import Flexbox from 'flexbox-react';

import useBoard from './useBoard';
import BoardPure from './BoardPure';
import BoardControlWrapper from './control/BoardControlWrapper';


const BoardWrapper = () => {
    const {jxgLogic, addPoint} = useBoard([], []);

    return (
        <Flexbox flexDirection="column">
            <BoardPure jxgLogic={jxgLogic} />

            <BoardControlWrapper addPoint={addPoint}
                                 removePoint={() => {}}
                                 addEdge={() => {}}
                                 removeEdge={() => {}}/>
        </Flexbox>
    );
};

export default BoardWrapper;