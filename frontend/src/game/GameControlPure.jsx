import React from "react";
import Flexbox from "flexbox-react";


const GameControlPure = ({setGameControlState}) => (
    <Flexbox flexWrap="wrap" padding="4px" margin="8px" justifyContent="center">
        <button onClick={() => setGameControlState('loadGame')} style={{margin: "2px"}}>
            Load Game
        </button>

        <button onClick={() => setGameControlState('loadGame')} style={{margin: "2px"}}>
            Save Game
        </button>
    </Flexbox>
);

export default GameControlPure;