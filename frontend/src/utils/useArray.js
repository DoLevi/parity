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

    const removeItem = (itemMatcher, max) => {
        const effectiveMax = max === undefined ? 1 : max;
        let toRemain = [];
        for (let knownItem of getArray()) {
            if (!effectiveMax || itemMatcher(knownItem)) {
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