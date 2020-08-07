import React, { useState } from 'react';
import Flexbox from 'flexbox-react';

import useBoard from './useBoard';
import BoardPure from './BoardPure';
import BoardControlWrapper from './control/BoardControlWrapper';
import GameControlWrapper from '../game/GameControlWrapper';


const BoardWrapper = () => {
    const {jxgLogic, addPoint, removePoint, addEdge, removeEdge, setGame} = useBoard([], []);

    return (
        <Flexbox flexDirection="column" padding="16px">
            <BoardPure jxgLogic={jxgLogic} />

            <BoardControlWrapper addPoint={addPoint}
                                 removePoint={removePoint}
                                 addEdge={addEdge}
                                 removeEdge={removeEdge}/>
            
            <GameControlWrapper setGame={setGame}/>
        </Flexbox>
    );
};

export default BoardWrapper;