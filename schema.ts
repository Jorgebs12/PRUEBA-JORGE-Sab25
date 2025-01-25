export const schema = `#graphql

    type Airport {
        _id: ID!
        iata: String!
        city: String!
        country: String!
        name: String!
        email: String!
        population: Int!
        is_capital: Boolean
    }

    type Query {
        getAirport(id:ID!): Airport
        getAirports: [Airport!]!
    }

    type Mutation {
        addAirport(name:String!, email: String!): Airport
        deleteAirport(id:ID!): Boolean
        updateAirport(id:ID!, name: String!, email: String!): Airport
    }

`
