import { useState } from "react";


const useGameControl = (setGame, unsetGameControlState) => {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(undefined);

    const onChange = (event) => {
        setValue(event.target.value);
        unsetGameControlState();
    };

    return {
        options,
        value,
        onChange
    };
};

export default useGameControl;