const graphql = require("graphql");

const {
	Position
} = require("./Position");


const Edge = new graphql.GraphQLObjectType({
	name: 'Edge',
	fields: () => ({
		id: {
			type: graphql.GraphQLID,
			sqlColumn: 'id'
		},
		name: {
			type: graphql.GraphQLString,
			sqlColumn: 'name'
		},
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