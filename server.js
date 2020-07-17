const express = require("express");
const joinMonster = require("join-monster");
const graphql = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const { Client } = require("pg");

const config = require("./config/config")[process.env.NODE_ENV || "development"];

const client = new Client ({
	host: config.database.host,
	user: config.database.user,
	password: config.database.password,
	database: config.database.database
});
client.connect(err => {
	if (err) {
		console.log("failed to connect to database", err.stack);
	} else {
		console.log("connected to database");
	}
});
client.query(`SET search_path TO ${config.database.schema}`);

const Position = new graphql.GraphQLObjectType({
	name: 'Position',
	fields: () => ({
		id: { type: graphql.GraphQLID},
		name: { type: graphql.GraphQLString},
		initial: { type: graphql.GraphQLBoolean},
		player0: { type: graphql.GraphQLBoolean},
		parity: { type: graphql.GraphQLInt}
	})
});
Position._typeConfig = {
	sqlTable: 'positions',
	uniqueKey: 'id'
};

const Edge = new graphql.GraphQLObjectType({
	name: 'Edge',
	fields: () => ({
		id: { type: graphql.GraphQLID },
		name: { type: graphql.GraphQLString },
		source: {
			type: Position,
			sqlJoin: (edgeTable, posTable) => `${edgeTable}.fk_source = ${posTable}.id`
		},
		target: {
			type: Position,
			sqlJoin: (edgeTable, posTable) => `${edgeTable}.fk_target = ${posTable}.id`
		}
	})
});
Edge._typeConfig = {
	sqlTable: 'edges',
	uniqueKey: 'id'
};

const ParityGame = new graphql.GraphQLObjectType({
	name: 'ParityGame',
	fields: () => ({
		id: { type: graphql.GraphQLID},
		name: { type: graphql.GraphQLString},
		description: { type: graphql.GraphQLString},
		positions: {
			type: graphql.GraphQLList(Position),
			sqlJoin: (gameTable, posTable) => `${gameTable}.id = ${posTable}.fk_parity_game`
		},
		edges: {
			type: graphql.GraphQLList(Edge),
			sqlJoin: (gameTable, edgeTable) => `${gameTable}.id = ${edgeTable}.fk_parity_game`
		},
	})
});
ParityGame._typeConfig = {
	sqlTable: 'parity_games',
	uniqueKey: 'id'
};

const QueryRoot = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hello: {
      type: graphql.GraphQLString,
      resolve: () => 'Hello world!'
    },
    parityGames: {
      type: new graphql.GraphQLList(ParityGame),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          return client.query(sql);
        });
      }
    }
  })
});

const MutationRoot = new graphql.GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		addPosition: {
			type: Position,
			args: {
				name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
				parityGameId: { type: graphql.GraphQLNonNull(graphql.GraphQLID) },
				initial: { type: graphql.GraphQLNonNull(graphql.GraphQLBoolean) },
				player0: { type: graphql.GraphQLNonNull(graphql.GraphQLBoolean) },
				parity: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) }
			},
			resolve: async (parent, args, context, resolveInfo) => {
				const params = [args.name, args.parityGameId, args.initial, args.player0, args.parity];
				try {
					return (await client.query("INSERT INTO positions (name, fk_parity_game, intial, player_0, parity) VALUES ($1, $2, $3, $4, $5) RETURNING *", params)).rows[0]
				} catch (err) {
					throw new Error("Failed to insert new position.")
				}
			}
		}
	})
});


const schema = new graphql.GraphQLSchema({ query: QueryRoot });

const app = express();
app.use('/api', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);

