import React from "react";

import ControlPanelPure from "./ControlPanelPure";
import useGameControl from "./useGameControl";
import { useState } from "react";
import useBoardControl from "./useBoardControl";
import ParityModal from "../../utils/ParityModal";
import ParityInputForm from "../../utils/ParityInputForm";


const ControlPanelWrapper = ({setGame, points, lines, addNode, removeNode, addEdge, removeEdge}) => {
    const [promptState, setPromptState] = useState(undefined);
    const {
        generateInputObjects,
        generateOnSubmit
    } = useBoardControl(() => setPromptState(undefined), addNode, addEdge);
    const {
        downloadGame,
        uploadGame,
        gameControlOpen,
        toggleGameControlOpen,
        nodeObjects,
        edgeObjects,
        toggleNodeObjects,
        toggleEdgeObjects
    } = useGameControl(setGame, points, lines);

    return (
        <>
            <ControlPanelPure gameControlOpen={gameControlOpen}
                              toggleGameControlOpen={toggleGameControlOpen}
                              downloadGame={downloadGame}
                              uploadGame={uploadGame}
                              nodeObjects={nodeObjects}
                              toggleNodeObjectsOpen={toggleNodeObjects}
                              edgeObjects={edgeObjects}
                              toggleEdgeObjectsOpen={toggleEdgeObjects}
                              setPromptState={setPromptState}
                              removeNode={removeNode}
                              removeEdge={removeEdge}/>

            <ParityModal isOpen={!!promptState} onRequestClose={() => setPromptState(undefined)}>
                {
                    promptState &&
                    <ParityInputForm inputObjects={generateInputObjects(promptState)}
                                     onSubmit={generateOnSubmit(promptState)}/>
                }
            </ParityModal>
        </>
    );
};

export default ControlPanelWrapper;