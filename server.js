const express = require("express");
const {
	graphqlHTTP
} = require("express-graphql");
const fs = require("fs");
const Knex = require("knex");
const {
	createSqlmancerClient, makeSqlmancerSchema
} = require("sqlmancer");

const config = require("./config/config")["development"];


const knexInstance = Knex({
	client: 'pg',
	connection: {
		host: config.database.host,
		user: config.database.user,
		password: config.database.password,
		database: config.database.database
	},
	searchPath: [config.database.schema]
});

const schemaPath = './paritySchema.graphql';
const { models: {
	ParityGame
}} = createSqlmancerClient(schemaPath, knexInstance);

const resolvers = {
	Query: {
		parityGames: (root, args, ctx, info) => {
			return ParityGame
				.findMany()
				.resolveInfo(info)
				.execute();
		}
	}
};

fs.readFile(schemaPath, 'ascii', (err, typeDefs) => {
	if (!err) {
		const schema = makeSqlmancerSchema({ typeDefs, resolvers });
		const app = express();
		app.use('/api', graphqlHTTP({
			schema: schema,
			graphiql: true,
		}));
		app.listen(4000);
	} else {
		console.log("Unable to read schema", schemaPath, "\n", err.stack);
	}
});
