const graphql = require("graphql");


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


export {Position};