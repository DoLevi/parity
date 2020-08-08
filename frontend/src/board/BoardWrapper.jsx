import React from 'react';
import Flexbox from 'flexbox-react';

import useBoard from './useBoard';
import BoardPure from './BoardPure';
import BoardControlWrapper from './control/BoardControlWrapper';
import ControlPanelWrapper from './control/ControlPanelWrapper';


const BoardWrapper = () => {
    const {jxgLogic, addPoint, removePoint, addEdge, removeEdge, setGame, points, lines} = useBoard();

    return (
        <Flexbox flexDirection="row" padding="16px">
            <ControlPanelWrapper setGame={setGame} points={points} lines={lines}/>

            <BoardControlWrapper addPoint={addPoint}
                                 removePoint={removePoint}
                                 addEdge={addEdge}
                                 removeEdge={removeEdge}/>

            <BoardPure jxgLogic={jxgLogic} />
        </Flexbox>
    );
};

export default BoardWrapper;