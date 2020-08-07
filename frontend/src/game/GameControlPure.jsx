import React from "react";
import Flexbox from "flexbox-react";


const GameControlPure = ({downloadGame, uploadGame}) => (
    <Flexbox flexWrap="wrap" padding="4px" margin="8px" justifyContent="center">
        <button onClick={() => uploadGame()} style={{margin: "2px"}}>
            Load Game
        </button>

        <button onClick={() => downloadGame()} style={{margin: "2px"}}>
            Save Game
        </button>
    </Flexbox>
);

export default GameControlPure;