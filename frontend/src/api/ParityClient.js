

const SERVER_URL = 'http://urhome:4000/api';

const ParityClient = {
    createParityGame: (name, description) => fetch(SERVER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `mutation { createParityGame(name: "${name}", description: "${description}") {} }`
        })
    }),
    getParityGameList: (handler) => fetch(SERVER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: 'query { parityGames { id name } }'
        })
    }).then((response) => handler(response.json().data.parityGames))
};

export default ParityClient;