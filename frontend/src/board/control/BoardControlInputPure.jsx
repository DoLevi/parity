import React from "react";
import Flexbox from "flexbox-react";


const BoardControlInputPure = ({inputObjects, onSubmit}) => (
    <form style={{margin: "16px"}} onSubmit={onSubmit}>
        <Flexbox flexWrap="wrap" flexDirection="column">
            {
                inputObjects.map((input) => (
                    <input type="text"
                           required
                           key={input.id}
                           placeholder={input.placeholder}
                           value={input.value}
                           onChange={input.onChange}
                           style={{margin: '8px'}}/>
                ))
            }
            
            <button type="submit" style={{margin: '8px'}} disabled={!inputObjects?.length}>
                Confirm
            </button>
        </Flexbox>
    </form>
);

export default BoardControlInputPure;