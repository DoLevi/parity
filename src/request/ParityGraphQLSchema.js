const graphql = require("graphql");
const joinMonster = require("join-monster");

const { ParityGame } = require("../model/ParityGame");
const { Position } = require("../model/Position");
const { Edge } = require("../model/Edge");


const generateQueryRoot = (databaseClient) => new graphql.GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        parityGames: {
            type: new graphql.GraphQLList(ParityGame),
            resolve: (parent, args, context, resolveInfo) => {
                return joinMonster.default(resolveInfo, {}, sql => {
                    return databaseClient.query(sql);
                });
            }
		},
		parityGame: {
			type: ParityGame,
			args: {
				id: { type: graphql.GraphQLID }
			},
			where: (parityGamesTable, args, context) => {
				return `${parityGamesTable} = ${args.id}`;
			},
			resolve: (parent, arg, context, resolveInfo) => {
				return joinMonster.default(resolveInfo, {}, sql => {
					return databaseClient.query(sql)
				});
			}
		}
    })
});

const generateMutationRoot = (databaseClient) => new graphql.GraphQLObjectType({
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
				const promise =  databaseClient.createPosition(
					args.name,
					args.parityGameId,
					args.initial,
					args.player0,
					args.parity
				);
				if (promise) {
					return (await promise).rows[0];
				}
			}
		},
		addEdge: {
			type: Edge,
			args: {
				name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
				parityGameId: { type: graphql.GraphQLNonNull(graphql.GraphQLID) },
				sourceId: { type: graphql.GraphQLNonNull(graphql.GraphQLID) },
				targetId: { type: graphql.GraphQLNonNull(graphql.GraphQLID) }
			},
			resolve: async (parent, args, context, resolveInfo) => {
                const promise = databaseClient.createEdge(
					args.name,
					args.parityGameId,
					args.sourceId,
					args.targetId
				);
				if (promise) {
					return (await promise).rows[0];
				}
			}
		},
		addParityGame: {
			type: ParityGame,
			args: {
				name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
				description: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }
			},
			resolve: async (parent, args, context, resolveInfo) => {
                const promise =  databaseClient.createParityGame(
					args.name,
					args.description
				);
				if (promise) {
					return (await promise).rows[0];
				}
			}
		},
	})
});

class ParityGraphQLSchema {
    constructor(databaseClient) {
        this.schema = new graphql.GraphQLSchema({
            query: generateQueryRoot(databaseClient),
            mutation: generateMutationRoot(databaseClient)
        });
    }
}

exports.ParityGraphQLSchema = ParityGraphQLSchema;