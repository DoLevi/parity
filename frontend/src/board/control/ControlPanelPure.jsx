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

const PrimaryControlElement = styled.div`
    border-radius: 6px;
    margin: 1px;
    padding: 8px 12px 8px 18px;
    background-color: lightgrey;
    cursor: pointer;
`;

const SecondaryControlElement = styled(PrimaryControlElement)`
    display: flex;
    justify-content: space-between;

    cursor: default;
`;

const ControlPanelPure = ({
        gameControlOpen,
        toggleGameControlOpen,
        downloadGame,
        uploadGame,
        nodeObjects,
        toggleNodeObjectsOpen,
        edgeObjects,
        toggleEdgeObjectsOpen,
        setPromptState,
        removeNode,
        removeEdge
    }) => (
    <ControlPanelRoot>
        <ControlHeader onClick={() => toggleGameControlOpen()}>
            Game controls
        </ControlHeader>

        {
            gameControlOpen &&
            <>
                <PrimaryControlElement onClick={() => uploadGame()}>
                    Load Game
                </PrimaryControlElement>

                <PrimaryControlElement onClick={() => downloadGame()}>
                    Save Game
                </PrimaryControlElement>
            </>
        }

        <ControlHeader onClick={() => toggleNodeObjectsOpen()}>
            Node controls
        </ControlHeader>

        {
            !nodeObjects.on &&
            <PrimaryControlElement onClick={() => setPromptState('addNode')}>
                Add node
            </PrimaryControlElement>
        }
        {
            nodeObjects.nodes.map((node) => (
                <SecondaryControlElement>
                    <div>
                        {node.name}
                    </div>

                    <div style={{cursor: "pointer"}} onClick={() => removeNode(node.name)}>
                        X
                    </div>
                </SecondaryControlElement>
            ))
        }

        <ControlHeader onClick={() => toggleEdgeObjectsOpen()}>
            Edge controls
        </ControlHeader>

        {
            !edgeObjects.on &&
            <PrimaryControlElement onClick={() => setPromptState('addEdge')}>
                Add edge
            </PrimaryControlElement>
        }
        {
            edgeObjects.edges.map((edge) => (
                <SecondaryControlElement>
                    <div>
                        {edge.name}
                    </div>
                    
                    <div style={{cursor: "pointer"}} onClick={() => removeEdge(edge.name)}>
                        X
                    </div>
                </SecondaryControlElement>
            ))
        }
    </ControlPanelRoot>
);

export default ControlPanelPure;