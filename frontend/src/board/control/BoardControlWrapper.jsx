import React, { useState } from "react";
import Modal from "react-modal";

import BoardControlPure from "./BoardControlPure";
import BoardControlInputPure from "./BoardControlInputPure";
import useBoardControl from "./useBoardControl";


const BoardControlWrapper = ({addPoint, removePoint, addEdge, removeEdge}) => {
    const [promptState, setPromptState] = useState(undefined);
    const {
        generateInputObjects,
        generateOnSubmit
    } = useBoardControl(() => setPromptState(undefined), addPoint, removePoint, addEdge, removeEdge);

    return (
        <>
            <BoardControlPure setPromptState={setPromptState}/>

            <Modal isOpen={!!promptState}
                   onRequestClose={() => setPromptState(undefined)}
                   style = {{
                        overlay: {
                            backgroundColor: 'rgba(0,0,0,0.64)',
                            opacity: 1,
                            zIndex: 400
                        },
                        content: {
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)'
                        }
                       }}>
                {
                    promptState &&
                    <BoardControlInputPure inputObjects={generateInputObjects(promptState)}
                                           onSubmit={generateOnSubmit(promptState)}/>
                }
            </Modal>
        </>
    );
};

export default BoardControlWrapper;