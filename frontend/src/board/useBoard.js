import { useState } from 'react';
import useArray from '../utils/useArray';
import { notify } from 'react-notify-toast';


const edgeToLine = (edge) => ({
    name: edge.name,
    straightFirst: false,
    straightLast: false,
    strokeWidth: 2
});

const useBoard = (initialPoints, initialEdges) => {
    const [cachedBoard, setCachedBoard] = useState(undefined);

    const [points, setPoints] = useState(initialPoints);
    const {addItem: addPointRaw, removeItem: removePointRaw} = useArray(() => points, setPoints);

    const [edges, setEdges] = useState(initialEdges);
    const {addItem: addEdgeRaw, removeItem: removeEdgeRaw} = useArray(() => edges, setEdges);

    const addPoint = (point) => {
        const nameOccupied = points.reduce((prev, next) => prev || next.name === point.name, false);
        if (!nameOccupied) {
            const pointObject = cachedBoard.create('point', [point.x, point.y], {name: point.name});
            addPointRaw({
                ...point,
                object: pointObject
            });
        } else {
            notify.show(`The name "${point.name}" is already taken.`, 'error', 3000);
        }
    };

    const removePoint = (name) => {
        const knownPoint = points.find((knownPoint) => knownPoint.name === name);

        if (knownPoint) {
            const hasConnectedEdges = edges.reduce((prev, next) => prev || next.sourceName === knownPoint.name || next.targetName === knownPoint.name, false);
            if (!hasConnectedEdges) {
                removePointRaw(knownPoint);
                cachedBoard.removeObject(knownPoint.object);
            } else {
                notify.show(`Cannot remove node "${name}": Edges depend on this node.`, 'error', 3000);
            }
        } else {
            notify.show(`The node name "${name}" is unknown.`, 'error', 3000);
        }
    };

    const addEdge = (edge) => {
        const nameOccupied = edges.reduce((prev, next) => prev || next.name === edge.name, false);
        if (!nameOccupied) {
            const sourcePoint = points.find((knownPoint) => knownPoint.name === edge.sourceName);
            if (sourcePoint) {
                const targetPoint = points.find((knownPoint) => knownPoint.name === edge.targetName);
                if (targetPoint) {
                    const lineObject = cachedBoard.create('line', [sourcePoint.object, targetPoint.object], edgeToLine(edge));
                    addEdgeRaw({
                        ...edge,
                        object: lineObject
                    });
                } else {
                    notify.show(`The name "${edge.name}" does not belong to any (target) node.`, 'error', 3000);
                }
            } else {
                notify.show(`The name "${edge.name}" does not belong to any (source) node.`, 'error', 3000);
            }
        } else {
            notify.show(`The name "${edge.name}" is already taken.`, 'error', 3000);
        }
    };

    const removeEdge = (name) => {
        const knownEdge = edges.find((knownEdge) => knownEdge.name === name);

        if (knownEdge) {
            removeEdgeRaw(knownEdge);
            cachedBoard.removeObject(knownEdge.object);
        } else {
            notify.show(`The edge name "${name}" is unknown.`, 'error', 3000);
        }
    };
    
    const jxgLogic = (board) => {
        if (!cachedBoard) {
            setCachedBoard(board);
        }
        board.suspendUpdate();

        const renderedPoints = points
            .map((point) => {
                const pointObject = board.create('point', [point.x, point.y], { name: point.name });
                return {
                    ...point,
                    object: pointObject
                };
            });
        setPoints(renderedPoints);

        const renderedLines = edges.map((edge) => {
            const sourceObject = renderedPoints.find((knownPoint) => knownPoint.name === edge.sourceName);
            const targetObject = renderedPoints.find((knownPoint) => knownPoint.name === edge.targetName);
            const lineObject = board.create('line', [sourceObject, targetObject], edgeToLine(edge));
            return {
                ...edge,
                object: lineObject
            };
        });
        setEdges(renderedLines);

        board.unsuspendUpdate();
    };

    return {
        jxgLogic,
        addPoint, removePoint,
        addEdge, removeEdge
    };
};

export default useBoard;