import { useState, useEffect } from "react";


const pointToNode = (point) => ({
    name: point.name,
    initial: point.initial,
    player0: point.player0,
    parity: point.parity,
    x: point.coords.usrCoords[1],
    y: point.coords.usrCoords[2]
});

const lineToEdge = (line) => ({
    name: line.name,
    sourceName: line.point1.name,
    targetName: line.point2.name
});

const useGameControl = (setGame, points, lines) => {
    const [nodeObjects, setNodeObjects] = useState({on: true, nodes: points.map(pointToNode)});
    const [edgeObjects, setEdgeObjects] = useState({on: true, edges: lines.map(lineToEdge)});
    const [gameControlOpen, setGameControlOpen] = useState(true);
    const toggleGameControlOpen = () => setGameControlOpen(!gameControlOpen);

    useEffect(() => setNodeObjects({
        on: nodeObjects.on,
        nodes: nodeObjects.on ? points.map(pointToNode) : []
    }), [points, nodeObjects.on]);

    useEffect(() => setEdgeObjects({
        on: edgeObjects.on,
        edges: edgeObjects.on ? lines.map(lineToEdge) : []
    }), [lines, edgeObjects.on]);

    const downloadGame = () => {
        const gameAsString = JSON.stringify({
            name: undefined,
            description: undefined,
            positions: points.map(pointToNode),
            edges: lines.map(lineToEdge)
        });

        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf8,' + encodeURIComponent(gameAsString));
        element.setAttribute('download', 'parityGame.json');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();
        
        document.body.removeChild(element);
    };

    const uploadGame = () => {
        console.log(points.map(pointToNode));
        let element = document.createElement('input');
        element.type = 'file';
        element.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const parityObject = JSON.parse(event.target.result);
                    setGame(parityObject);
                };
                reader.readAsText(file);
            }
        };

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    const toggleNodeObjects = () => setNodeObjects({ ...nodeObjects, on: !nodeObjects.on });
    const toggleEdgeObjects = () => setEdgeObjects({ ...edgeObjects, on: !edgeObjects.on });

    return {
        downloadGame,
        uploadGame,
        gameControlOpen, toggleGameControlOpen,
        nodeObjects, edgeObjects,
        toggleNodeObjects, toggleEdgeObjects
    };
};

export default useGameControl;