import { useState } from "react";
import ParityClient from "../api/ParityClient";


const useGameControl = (setGame, unsetGameControlState) => {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(undefined);

    const onChange = (event) => {
        setValue(event.target.value);
        unsetGameControlState();
    };

    ParityClient.getParityGameList(setOptions);

    return {
        options,
        value,
        onChange
    };
};

export default useGameControl;