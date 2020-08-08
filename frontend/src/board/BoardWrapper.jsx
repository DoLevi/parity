import React from 'react';
import Flexbox from 'flexbox-react';

import useBoard from './useBoard';
import BoardPure from './BoardPure';
import ControlPanelWrapper from './control/ControlPanelWrapper';


const BoardWrapper = () => {
    const {jxgLogic, addNode, removePoint, addEdge, removeEdge, setGame, points, lines} = useBoard();

    return (
        <Flexbox flexDirection="row" padding="16px" justifyContent="center" minWidth="700px">
            <ControlPanelWrapper setGame={setGame}
                                 points={points}
                                 lines={lines}
                                 addNode={addNode}
                                 removeNode={removePoint}
                                 addEdge={addEdge}
                                 removeEdge={removeEdge}/>

            <BoardPure jxgLogic={jxgLogic} />
        </Flexbox>
    );
};

export default BoardWrapper;