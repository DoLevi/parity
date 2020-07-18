const { Client } = require("pg");


const createPositionQuery = "INSERT INTO positions (name, fk_parity_game, initial, player_0, parity) VALUES ($1, $2, $3, $4, $5) RETURNING *";
const deletePositionQuery = "DELETE FROM positions WHERE id = $1 RETURNING *";
const createEdgeQuery = "INSERT INTO edges (name, fk_parity_game, fk_source, fk_target) VALUES ($1, $2, $3, $4) RETURNING *";
const deleteEdgeQuery = "DELETE FROM edges WHERE id = $1 RETURNING *";
const createParityGameQuery = "INSERT INTO parity_games (name, description) VALUES ($1, $2) RETURNING *";
const deleteParityGameQuery = "DELETE FROM parity_games WHERE id = $1 RETURNING *";

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
                console.log("Connected to database");
            })
            .catch((err) => console.log("Failed to connect to database.\n", err.stack));
        this.client.query(`SET search_path TO ${this.schema}`)
            .catch(() => console.log(`Failed to set search_path to ${this.schema}`));
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

    deletePosition(id) {
        return this.queryWithParams(deletePositionQuery, [id], "Failed to delete position.");
    }

    createEdge(name, parityGameId, sourceId, targetId) {
        const params = [name, parityGameId, sourceId, targetId];
        return this.queryWithParams(createEdgeQuery, params, "Failed to insert new edge.");
    }

    deleteEdge(id) {
        return this.queryWithParams(deleteEdgeQuery, [id], "Failed to delete edge.");
    }

    createParityGame(name, description) {
        const params = [name, description];
        return this.queryWithParams(createParityGameQuery, params, "Failed to insert new parity game.");
    }

    deleteParityGame(id) {
        return this.queryWithParams(deleteParityGameQuery, [id], "Failed to delete parity game.");
    }

    queryWithParams(queryString, params, errorMessage) {
        if (this.isConnected) {
            try {
                return this.client.query(queryString, params);
            } catch (err) {
                console.log(errorMessage, err.stack);
            }
        } else {
            console.log("Cannot query before connecting.");
        }
    }
}

exports.DatabaseClient = DatabaseClient;