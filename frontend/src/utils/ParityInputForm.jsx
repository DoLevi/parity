import React from "react";
import Flexbox from "flexbox-react";


const ParityInputForm = ({inputObjects, onSubmit}) => (
    <form style={{margin: "16px"}} onSubmit={onSubmit}>
        <Flexbox flexWrap="wrap" flexDirection="column">
            {
                inputObjects.map((input) => input.type !== "checkbox" ? (
                    <input type={input.type}
                           required
                           key={input.id}
                           placeholder={input.placeholder}
                           value={input.value}
                           onChange={input.onChange}
                           style={{margin: '8px'}}/>
                ) : (
                    <Flexbox alignItems="center" key={input.id}>
                        <input type={input.type}
                               checked={input.value}
                               onChange={input.onChange}
                               style={{margin: '8px'}}/>

                        <label>{input.placeholder}</label>
                    </Flexbox>
                ))
            }
            
            <button type="submit" style={{margin: '8px'}} disabled={!inputObjects?.length}>
                Confirm
            </button>
        </Flexbox>
    </form>
);

export default ParityInputForm;