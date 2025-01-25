import { GraphQLError } from "graphql";
import { AirportModel, APICity } from "./types.ts";
import { Collection, ObjectId } from "mongodb";

type addArgs = {
    name: string,
    email: string
}
type updateArgs = {
    id: string
    name?: string,
    email?: string
}
type getQuery = {
    id: string
}
type Context = {
    AirportCollection: Collection<AirportModel>;
}

export const resolvers = {

    Mutation: {
        addAirport: async(_:unknown, args: addArgs, ctx: Context): Promise<AirportModel> => {
            
            const API_KEY = Deno.env.get("API_KEY")
            if(!API_KEY) throw new GraphQLError("NO hay APIKEY")
            
            const { name, email } = args

            const url =`https://api.api-ninjas.com/v1/airports?name=${name}`

            const data = await fetch(url, { headers: { "X-Api-Key": API_KEY}})

            if(data.status !== 200) throw new GraphQLError("API NINJA ERROR")

            const response: AirportModel  = await data.json();

            const iata = response[0].iata;
            const city = response[0].city;
            const country = response[0].country;

            console.log(iata)
            const { insertedId } = await ctx.AirportCollection.insertOne({ 
                iata,
                city,
                country,
                name,
                email,
            })

            return {
                _id: insertedId,
                name,
                city,
                iata,
                country,
                email
            }    
        },

        deleteAirport: async(_:unknown, args: getQuery, ctx: Context): Promise<boolean> => {
            const { deletedCount } = await ctx.AirportCollection.findOneAndDelete({_id: new ObjectId(args.id)})
            return deletedCount === 1
        },

        updateAirport: async(_:unknown, args: updateArgs, ctx: Context): Promise<AirportModel> => {
            
            const API_KEY = Deno.env.get("API_KEY")
            if(!API_KEY) throw new GraphQLError("NO hay APIKEY")
            
            const { id, name, email } = args

            const url =`https://api.api-ninjas.com/v1/airports?name=${name}`

            const data = await fetch(url, { headers: { "X-Api-Key": API_KEY}})

            if(data.status !== 200) throw new GraphQLError("API NINJA ERROR")

            const response: AirportModel  = await data.json();

            const iata = response[0].iata;
            const city = response[0].city;
            const country = response[0].country;

            const newUser = await ctx.AirportCollection.findOneAndUpdate({ _id: new ObjectId(id)},
            { $set:{
                iata,
                city,
                country,
                name,
                email,
            }})

            if(!newUser) throw new GraphQLError("User not found")
            return newUser 
        },
    },


    Query: {

        getAirport: async(_:unknown, args: getQuery, ctx: Context): Promise<AirportModel | null> => {
            return await ctx.AirportCollection.findOne({_id: new ObjectId(args.id)})
        },

        getAirports: async(_:unknown, __:unknown, ctx: Context): Promise<AirportModel[]> => {
            return await ctx.AirportCollection.find().toArray()
        }
    },

    Airport:{
        
        _id: (parent: AirportModel): string => parent._id!.toString(),
        
        population: async(parent: AirportModel): Promise<number> => {

            const API_KEY = Deno.env.get("API_KEY")
            if(!API_KEY) throw new GraphQLError("NO hay APIKEY")
            
            const name = parent.city

            const url =`https://api.api-ninjas.com/v1/city?name=${name}`

            const data = await fetch(url, { headers: { "X-Api-Key": API_KEY}})

            if(data.status !== 200) throw new GraphQLError("API NINJA ERROR")

            const response: APICity  = await data.json();

            const population = response[0].population

            return population
        },

        is_capital: async(parent: AirportModel): Promise<boolean> => {

            const API_KEY = Deno.env.get("API_KEY")
            if(!API_KEY) throw new GraphQLError("NO hay APIKEY")
            
            const name = parent.city

            const url =`https://api.api-ninjas.com/v1/city?name=${name}`

            const data = await fetch(url, { headers: { "X-Api-Key": API_KEY}})

            if(data.status !== 200) throw new GraphQLError("API NINJA ERROR")

            const response: APICity  = await data.json();

            const is_capital = response[0].is_capital

            return is_capital
        },
    }
}