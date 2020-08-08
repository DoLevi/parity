import { useState } from 'react';
import { notify } from 'react-notify-toast';
import useArray from '../utils/useArray';


// TODO: add properties: initial, player0, parity
const nodeToPoint = (node) => ({
    name: node.name,
    x: node.x,
    y: node.y
});

const edgeToLine = (edge) => ({
    name: edge.name,
    straightFirst: false,
    straightLast: false,
    strokeWidth: 2
});

const useBoard = () => {
    const [cachedBoard, setCachedBoard] = useState(undefined);

    const [points, setPoints] = useState([]);
    const {addItem: addPointRaw, removeItem: removePointRaw} = useArray(() => points, setPoints);

    const [edges, setEdges] = useState([]);
    const {addItem: addEdgeRaw, removeItem: removeEdgeRaw} = useArray(() => edges, setEdges);

    const validateNode = (node, knownPoints) => {
        const nameOccupied = knownPoints.reduce((prev, next) => prev || next.name === node.name, false);
        if (nameOccupied) {
            notify.show(`The name "${node.name}" is already taken.`, 'error', 3000);
            return undefined;
        }
        return nodeToPoint(node);
    };
    const validateEdge = (edge, knownEdges, knownPoints) => {
        const nameOccupied = knownEdges.reduce((prev, next) => prev || next.name === edge.name, false);
        if (!nameOccupied) {
            const sourcePoint = knownPoints.find((knownPoint) => knownPoint.name === edge.sourceName);
            if (sourcePoint) {
                const targetPoint = knownPoints.find((knownPoint) => knownPoint.name === edge.targetName);
                if (targetPoint) {
                    return {
                        line: edgeToLine(edge),
                        sourcePoint: sourcePoint,
                        targetPoint: targetPoint
                    };
                } else {
                    notify.show(`The name "${edge.name}" does not belong to any (target) node.`, 'error', 3000);
                }
            } else {
                notify.show(`The name "${edge.name}" does not belong to any (source) node.`, 'error', 3000);
            }
        } else {
            notify.show(`The name "${edge.name}" is already taken.`, 'error', 3000);
        }
        return undefined;
    };

    const addNode = (node) => {
        const point = validateNode(node, points);
        if (point) {
            const pointObject = cachedBoard.create('point', [point.x, point.y], point);
            addPointRaw(pointObject);
            return 0;
        }
        return 1;
    };

    const removePoint = (name) => {
        const knownPoint = points.find((knownPoint) => knownPoint.name === name);

        if (knownPoint) {
            const hasConnectedEdges = edges.reduce((prev, next) => prev || next.point1.name === knownPoint.name || next.point2.name === knownPoint.name, false);
            if (!hasConnectedEdges) {
                removePointRaw(knownPoint);
                cachedBoard.removeObject(knownPoint);
            } else {
                notify.show(`Cannot remove node "${name}": Edges depend on this node.`, 'error', 3000);
            }
        } else {
            notify.show(`The node name "${name}" is unknown.`, 'error', 3000);
        }
    };

    const addEdge = (edge) => {
        const {line, sourcePoint, targetPoint} = validateEdge(edge, edges, points);
        if (line) {
            const lineObject = cachedBoard.create('line', [sourcePoint, targetPoint], edgeToLine(edge));
            addEdgeRaw(lineObject);
            return 0;
        }
    };

    const removeEdge = (name) => {
        const knownEdge = edges.find((knownEdge) => knownEdge.name === name);
        if (knownEdge) {
            removeEdgeRaw(knownEdge);
            cachedBoard.removeObject(knownEdge);
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
        // Validate new nodes
        let newPoints = [];
        for (const node of parityGame.positions) {
            const point = validateNode(node, newPoints);
            if (!point) {
                notify.show(`Invalid node '${node.name}'. Rolling back upload.`, "error", 3000);
                return;
            }
            newPoints.push(point);
        }

        // Validate new edges
        let newEdges = [];
        for (const edge of parityGame.edges) {
            const line = validateEdge(edge, newEdges, newPoints);
            if (!line) {
                notify.show(`Invalid edge '${edge.name}'. Rolling back upload.`, "error", 3000);
                return;
            }
            newEdges.push(line);
        }

        // Create new board
        cachedBoard.suspendUpdate();

        // Clear previous contents
        edges.forEach((edge) => cachedBoard.removeObject(edge));
        points.forEach((point) => cachedBoard.removeObject(point));

        // Queue new points for render
        const renderedPoints = newPoints.map((point) => cachedBoard.create('point', [point.x, point.y], point));

        // Attach point objects to lines
        const newEdgesWithPoints = parityGame.edges.map((edge) => validateEdge(edge, [], renderedPoints));
        // Queue new edges for render
        const renderedEdges = newEdgesWithPoints
            .map((edge) => cachedBoard.create('line', [edge.sourcePoint, edge.targetPoint], edge.line));

        cachedBoard.unsuspendUpdate();

        // Update local state
        setPoints(renderedPoints);
        setEdges(renderedEdges);
    };

    return {
        jxgLogic,
        addNode, removePoint,
        addEdge, removeEdge,
        setGame,
        points, lines: edges
    };
};

export default useBoard;