import React, { useState } from "react";
import Flexbox from "flexbox-react";

import GameControlPure from "./GameControlPure";
import ParityModal from "../utils/ParityModal";
import GameControlListWrapper from "./GameControlListWrapper";
import useGameControl from "./useGameControl";


const GameControlWrapper = ({setGame}) => {
    const [gameControlState, setGameControlState] = useState('');
    const {options, value, onChange} = useGameControl(setGame, () => setGameControlState(''));

    return (
        <Flexbox flexDirection="column" margin="8px" padding="4px">
            <GameControlPure setGameControlState={setGameControlState}/>

            <ParityModal isOpen={!!gameControlState} onRequestClose={() => setGameControlState('')}>
                {
                    gameControlState === 'loadGame' ? (
                        <GameControlListWrapper options={options}
                                                value={value}
                                                onChange={onChange}
                                                onSubmit={() => {}}/>
                    ) : (
                        <div>Not implemented.</div>
                    )
                }
            </ParityModal>
        </Flexbox>
    );
};

export default GameControlWrapper;