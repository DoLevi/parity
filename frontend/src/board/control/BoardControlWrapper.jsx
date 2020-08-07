import React, { useState } from "react";

import BoardControlPure from "./BoardControlPure";
import useBoardControl from "./useBoardControl";
import ParityModal from "../../utils/ParityModal";
import ParityInputForm from "../../utils/ParityInputForm";


const BoardControlWrapper = ({addPoint, removePoint, addEdge, removeEdge}) => {
    const [promptState, setPromptState] = useState(undefined);
    const {
        generateInputObjects,
        generateOnSubmit
    } = useBoardControl(() => setPromptState(undefined), addPoint, removePoint, addEdge, removeEdge);

    return (
        <>
            <BoardControlPure setPromptState={setPromptState}/>

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

export default BoardControlWrapper;