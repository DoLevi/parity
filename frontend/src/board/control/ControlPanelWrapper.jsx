import React from "react";

import ControlPanelPure from "./ControlPanelPure";
import useGameControl from "./useGameControl";


const ControlPanelWrapper = ({setGame, points, lines}) => {
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
        <ControlPanelPure gameControlOpen={gameControlOpen}
                          toggleGameControlOpen={toggleGameControlOpen}
                          downloadGame={downloadGame}
                          uploadGame={uploadGame}
                          nodeObjects={nodeObjects}
                          toggleNodeObjectsOpen={toggleNodeObjects}
                          edgeObjects={edgeObjects}
                          toggleEdgeObjectsOpen={toggleEdgeObjects}/>
    );
};

export default ControlPanelWrapper;