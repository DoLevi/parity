import React from "react";

const GameControlListWrapper = ({options, value, onChange, onSubmit}) => (
    <select value={value} onChange={onChange} style={{margin: "16px"}}>
        {
            options.map((option) => (
                <option key={option.id} value={option.name} onChange={onChange}/>
            ))
        }
    </select>
);

export default GameControlListWrapper;