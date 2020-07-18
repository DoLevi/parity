const graphql = require("graphql");


const Position = new graphql.GraphQLObjectType({
	name: 'Position',
	fields: () => ({
		id: {
			type: graphql.GraphQLID,
			sqlColumn: 'id'
		},
		name: {
			type: graphql.GraphQLString,
			sqlColumn: 'name'
		},
		initial: {
			type: graphql.GraphQLBoolean,
			sqlColumn: 'initial'
		},
		player0: {
			type: graphql.GraphQLBoolean,
			sqlColumn: 'player_0'
		},
		parity: {
			type: graphql.GraphQLInt,
			sqlColumn: 'parity'
		}
	})
});

Position._typeConfig = {
	sqlTable: 'positions',
	uniqueKey: 'id'
};


exports.Position = Position;