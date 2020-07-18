const graphql = require("graphql");

const {Position} = require("./Position");


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

exports.Edge = Edge;