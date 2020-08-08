import React from "react";
import styled from "styled-components";

const ControlPanelRoot = styled.div`
    border-radius: 8px;
    padding: 2px;
    background-color: lightgrey;
    display: flex;
    flex-direction: column;
`;

const ControlHeader = styled.div`
    border-radius: 6px;
    margin: 1px;
    padding: 8px 12px;
    background-color: whitesmoke;
    cursor: pointer;
`;

const ControlElement = styled.div`
    border-radius: 6px;
    margin: 1px;
    padding: 8px 12px 8px 18px;
    background-color: lightgrey;
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
    <ControlPanelRoot>
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
    </ControlPanelRoot>
);

export default ControlPanelPure;