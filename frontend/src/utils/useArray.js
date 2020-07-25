const useArray = (getArray, setArray) => {
    const addItem = (item, position) => {
        const arrayCopy = getArray();
        if (position === undefined || position > arrayCopy.length) {
            setArray([...arrayCopy, item]);
        } else {
            setArray([
                ...arrayCopy.slice(0, position),
                item,
                ...arrayCopy.slice(position)
            ]);
        }
    }

    const removeItem = (item, max) => {
        let effectiveMax = max === undefined ? 1 : max;
        let toRemain = [];
        for (let knownItem of getArray()) {
            if (knownItem !== item) {
                toRemain.push(knownItem);
            } else if (knownItem === item && effectiveMax) {
                effectiveMax--;
            } else {
                toRemain.push(knownItem);
            }
        }
        setArray(toRemain);
    };

    return {
        addItem, removeItem
    };
};

export default useArray;