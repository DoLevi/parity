import React from "react";
import Flexbox from "flexbox-react";

import GameControlPure from "./GameControlPure";
import useGameControl from "./useGameControl";


const GameControlWrapper = ({setGame, getGame}) => {
    const {downloadGame, uploadGame} = useGameControl(setGame, getGame);

    return (
        <Flexbox flexDirection="column" margin="8px" padding="4px">
            <GameControlPure downloadGame={downloadGame} uploadGame={uploadGame}/>
        </Flexbox>
    );
};

export default GameControlWrapper;