const {
    Client
} = require("pg");


const createPositionQuery = "INSERT INTO positions (name, fk_parity_game, intial, player_0, parity) VALUES ($1, $2, $3, $4, $5) RETURNING *";
const createEdgeQuery = "INSERT INTO edges (name, fk_parity_game, fk_source, fk_target) VALUES ($1, $2, $3, $4) RETURNING *";
const createParityGameQuery = "INSERT INTO parity_games (name, description) VALUES ($1, $2) RETURNING *";

class DatabaseClient {
    constructor(host, user, password, database, schema) {
        this.client = new Client({
            host: host,
            user: user,
            password: password,
            database: database
        });
        this.schema = schema;
        this.isConnected = false;
    }

    connect() {
        this.client.connect()
            .then(() => {
                this.isConnected = true;
                console.log("connected to database");
            })
            .catch((err) => console.log("Failed to connect to database.\n", err.stack));
        this.client.query(`SET search_path TO ${this.schema}`);
    }

    disconnect() {
        this.client.end()
            .then(() => {
                this.isConnected = false;
                console.log("Disconnected from database.");
            })
            .catch((err) => console.log("Failed to disconnect from database.", err.stack));
    }

    query(queryStream) {
        if (this.isConnected) {
            return this.client.query(queryStream);
        }
        console.log("Cannot query before connecting.");
    }

    createPosition(name, parityGameId, initial, player0, parity) {
        const params = [name, parityGameId, initial, player0, parity];
        return this.queryWithParams(createPositionQuery, params, "Failed to insert new position.");
    }

    createEdge(name, parityGameId, sourceId, targetId) {
        const params = [name, parityGameId, sourceId, targetId];
        return this.queryWithParams(createEdgeQuery, params, "Failed to insert new edge.");
    }

    createParityGame(name, description) {
        const params = [name, description];
        return this.queryWithParams(createParityGameQuery, params, "Failed to insert new parity game.");
    }

    queryWithParams(queryString, params, errorMessage) {
        if (this.isConnected) {
            try {
                return this.client.query(queryString, params).rows[0];
            } catch (err) {
                console.log(errorMessage, err.stack);
            }
        } else {
            console.log("Cannot query before connecting.");
        }
    }
}

exports.DatabaseClient = DatabaseClient;