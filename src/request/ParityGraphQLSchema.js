const graphql = require("graphql");

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
                return databaseClient.createPosition(args.name, args.parityGameId, args.initial, args.player0, args.parity);
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
                return databaseClient.createEdge(args.name, args.parityGameId, args.sourceId, args.targetId);
			}
		},
		addParityGame: {
			type: ParityGame,
			args: {
				name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
				description: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }
			},
			resolve: async (parent, args, context, resolveInfo) => {
                return databaseClient.createParityGame(args.name, args.description);
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

export { ParityGraphQLSchema };