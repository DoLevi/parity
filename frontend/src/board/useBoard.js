import { useState } from 'react';
import useArray from '../utils/useArray';
import { notify } from 'react-notify-toast';


const useBoard = (initialPoints, initialEdges) => {
    const [cachedBoard, setCachedBoard] = useState(undefined);
    const [points, setPoints] = useState(initialPoints);
    const {addItem: addPointRaw, removeItem: removePointRaw} = useArray(() => points, setPoints);

    let addPoint = (point) => {
        const nameOccupied = points.reduce((prev, next) => prev || next.name === point.name, false);
        if (!nameOccupied) {
            addPointRaw(point);
            cachedBoard.create('point', [point.x, point.y], {name: point.name});
            notify.show('Point added', 'success');
        } else {
            notify.show(`The name "${point.name}" is already taken.`, 'error', 3000);
        }
    };
    
    const jxgLogic = (board) => {
        if (!cachedBoard) {
            console.log(board);
            setCachedBoard(board);
        }
        board.suspendUpdate();
        const jxgPoints = points.map((point) => board.create('point', [point.x, point.y], {
            name: point.name
        }));
        // const jxgLines = edges.map((edge) => board.create('line', [], {
        //     name: edge.name,
        //     straightFirst: false,
        //     straightLast: false,
        //     strokeWidth: 2
        // }));
        board.unsuspendUpdate();
    };

    return {
        jxgLogic,
        addPoint/* , removePoint,
        addEdge, removeEdge */
    };
};

export default useBoard;