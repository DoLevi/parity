const useGameControl = (setGame, getGame) => {
    const downloadGame = () => {
        const gameAsString = JSON.stringify(getGame());
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf8,' + encodeURIComponent(gameAsString));
        element.setAttribute('download', 'parityGame.json');

        element.style.display = 'none';
        document.body.append(element);

        element.click();
        
        document.body.removeChild(element);
    };

    const uploadGame = () => {
        const gameAsObject = JSON.parse();
    };

    return {
        downloadGame,
        uploadGame
    };
};

export default useGameControl;