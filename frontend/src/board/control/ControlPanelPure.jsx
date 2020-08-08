import React from "react";
import Flexbox from "flexbox-react";
import styled from "styled-components";


const ControlHeader = styled.div`
    padding: 8px 12px;
    background-color: lightgrey;
    cursor: pointer;
`;

const ControlElement = styled.div`
    padding: 8px 12px 8px 18px;
    background-color: whitesmoke;
    cursor: pointer;
`;

const ControlPanelPure = ({
        gameControlOpen,
        toggleGameControlOpen,
        downloadGame,
        uploadGame,
        nodeObjects,
        toggleNodeObjectsOpen,
        edgeObjects,
        toggleEdgeObjectsOpen
    }) => (
    <Flexbox flexDirection="column">
        <ControlHeader onClick={() => toggleGameControlOpen()}>
            Game controls
        </ControlHeader>

        {
            gameControlOpen &&
            <>
                <ControlElement onClick={() => uploadGame()}>
                    Load Game
                </ControlElement>

                <ControlElement onClick={() => downloadGame()}>
                    Save Game
                </ControlElement>
            </>
        }

        <ControlHeader onClick={() => toggleNodeObjectsOpen()}>
            Node controls
        </ControlHeader>

        {
            nodeObjects.nodes.map((node) => (
                <ControlElement>
                    {node.name}
                </ControlElement>
            ))
        }

        <ControlHeader onClick={() => toggleEdgeObjectsOpen()}>
            Edge controls
        </ControlHeader>

        {
            edgeObjects.edges.map((edge) => (
                <ControlElement>
                    {edge.name}
                </ControlElement>
            ))
        }
    </Flexbox>
);

export default ControlPanelPure;