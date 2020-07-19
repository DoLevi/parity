const express = require("express");
const {
	graphqlHTTP
} = require("express-graphql");
const fs = require("fs");
const Knex = require("knex");
const {
	createSqlmancerClient,
	makeSqlmancerSchema
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
const {
	models: {
		ParityGame,
		Position,
		Edge
	},
	client
} = createSqlmancerClient(schemaPath, knexInstance);

const resolvers = {
	Query: {
		parityGames: (root, args, ctx, info) => {
			return ParityGame
				.findMany()
				.resolveInfo(info)
				.execute();
		}
	},
	Mutation: {
		createParityGame: (root, args, ctx, info) => {
			return client.transaction(async trx => {
				const parityGameId = ParityGame.createOne({
						name: args.name,
						description: args.description
					})
					.transaction(trx)
					.execute();
				return ParityGame
					.findOne(parityGameId)
					.resolveInfo(info)
					.transaction(trx)
					.execute();
			});
		},
		createPosition: (root, args, ctx, info) => {
			return client.transaction(async trx => {
				const positionId = await Position.createOne({
						parityGameId: args.parityGameId,
						name: args.name,
						initial: args.initial,
						player0: args.player0,
						parity: args.parity
					})
					.transaction(trx)
					.execute();
				return Position
					.findOne(positionId)
					.resolveInfo(info)
					.transaction(trx)
					.execute();
			});
		},
		createEdge: (root, args, ctx, info) => {
			return client.transaction(async trx => {
				const edgeId = await Edge.createOne({
						parityGameId: args.parityGameId,
						name: args.name,
						sourceId: args.sourceId,
						targetId: args.targetId
					})
					.transaction(trx)
					.execute();
				return Edge
					.findOne(edgeId)
					.resolveInfo(info)
					.transaction(trx)
					.execute();
			});
		}
	}
};

fs.readFile(schemaPath, 'ascii', (err, typeDefs) => {
	if (!err) {
		const schema = makeSqlmancerSchema({
			typeDefs,
			resolvers
		});
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