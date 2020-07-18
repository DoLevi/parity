const graphql = require("graphql");
const {Position} = require("./Position");
const {Edge} = require("./Edge");


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

exports.ParityGame = ParityGame;