const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { DatabaseClient } = require("./src/database/DatabaseClient");
const { ParityGraphQLSchema } = require("./src/request/ParityGraphQLSchema");

const config = require("./config/config")[process.env.NODE_ENV || "development"];

const dbClient = new DatabaseClient(
	config.database.host,
	config.database.user,
	config.database.password,
	config.database.database
);
dbClient.connect();

const schema = new ParityGraphQLSchema(dbClient);

const app = express();
app.use('/api', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);

