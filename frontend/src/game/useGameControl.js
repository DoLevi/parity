const useGameControl = (setGame, getGame) => {
    const downloadGame = () => {
        const gameAsString = JSON.stringify(getGame());
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf8,' + encodeURIComponent(gameAsString));
        element.setAttribute('download', 'parityGame.json');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();
        
        document.body.removeChild(element);
    };

    const uploadGame = () => {
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

    return {
        downloadGame,
        uploadGame
    };
};

export default useGameControl;