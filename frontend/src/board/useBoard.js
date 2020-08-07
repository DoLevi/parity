import { useState } from 'react';
import useArray from '../utils/useArray';
import { notify } from 'react-notify-toast';


const nodeToPoint = (node) => ({
    name: node.name
});

const pointToNode = (point) => ({
    name: point.name,
    x: point.coords.usrCoords[1],
    y: point.coords.usrCoords[2]
});

const edgeToLine = (edge) => ({
    name: edge.name,
    straightFirst: false,
    straightLast: false,
    strokeWidth: 2
});

const lineToEdge = (line) => ({
    name: line.name,
    sourceName: line.point1.name,
    targetName: line.point2.name
});

const useBoard = () => {
    const [cachedBoard, setCachedBoard] = useState(undefined);

    const [points, setPoints] = useState([]);
    const {addItem: addPointRaw, removeItem: removePointRaw} = useArray(() => points, setPoints);

    const [edges, setEdges] = useState([]);
    const {addItem: addEdgeRaw, removeItem: removeEdgeRaw} = useArray(() => edges, setEdges);

    const addPoint = (node) => {
        const nameOccupied = points.reduce((prev, next) => prev || next.name === node.name, false);
        if (!nameOccupied) {
            const pointObject = cachedBoard.create('point', [node.x, node.y], nodeToPoint(node));
            addPointRaw(pointObject);
            return 0;
        } else {
            notify.show(`The name "${node.name}" is already taken.`, 'error', 3000);
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
                    const lineObject = cachedBoard.create('line', [sourcePoint, targetPoint], edgeToLine(edge));
                    addEdgeRaw(lineObject);
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
        positions: points.map(pointToNode),
        edges: edges.map(lineToEdge)
    });

    return {
        jxgLogic,
        addPoint, removePoint,
        addEdge, removeEdge,
        setGame, getGame
    };
};

export default useBoard;