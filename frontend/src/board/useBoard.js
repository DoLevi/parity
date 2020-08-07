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
            return 0;
        } else {
            notify.show(`The name "${point.name}" is already taken.`, 'error', 3000);
            return 1;
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
                    return 0;
                } else {
                    notify.show(`The name "${edge.name}" does not belong to any (target) node.`, 'error', 3000);
                }
            } else {
                notify.show(`The name "${edge.name}" does not belong to any (source) node.`, 'error', 3000);
            }
        } else {
            notify.show(`The name "${edge.name}" is already taken.`, 'error', 3000);
        }
        return 1;
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

    const setGame = (parityGame) => {
        // local "backup"
        const prevPoints = points;
        const prevEdges = edges;

        // Clear previous board
        prevEdges.forEach((edge) => removeEdge(edge.name));
        prevPoints.forEach((point) => removePoint(point.name));

        // Load new board
        let uploadedPointNames = [];
        for (const position of parityGame.positions) {
            const newPosition = {
                x: position.positionX,
                y: position.positionY,
                name: position.name
            };
            if (!addPoint(newPosition)) {
                notify.show("Supplied broken parity game. Rolling back upload.");
                uploadedPointNames.forEach(removePoint);
                prevPoints.forEach(addPoint);
                return 1;
            }
            uploadedPointNames.push(position.name);
        }

        let uploadedEdgeNames = [];
        for (const edge of parityGame.edges) {
            const newEdge = {
                name: edge.name,
                sourceName: edge.source.name,
                targetName: edge.target.name
            };
            if (!addEdge(newEdge)) {
                notify.show("Supplied broken parity game. Rolling back upload.");
                uploadedEdgeNames.forEach(removeEdge);
                uploadedPointNames.forEach(removePoint);
                prevPoints.forEach(addPoint);
                prevEdges.forEach(addEdge);
                return 1;
            }
            uploadedEdgeNames.push(edge.name);
        }
        return 0;
    };

    const getGame = () => ({
        id: undefined,
        name: undefined,
        description: undefined,
        positions: points.map((point) => {
            const {object, ...rawPoint} = point;
            return rawPoint;
        }),
        edges: edges.map((edge) => {
            const {object, ...rawEdge} = edge;
            return rawEdge;
        })
    });

    return {
        jxgLogic,
        addPoint, removePoint,
        addEdge, removeEdge,
        setGame, getGame
    };
};

export default useBoard;