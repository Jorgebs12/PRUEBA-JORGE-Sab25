import { OptionalId } from "mongodb"

export type AirportModel = OptionalId<{

    iata: string,
    city: string,
    country: string,
    name: string,
    email: string
}>

export type APICity = {
    population: number,
    is_capital: boolean
}


