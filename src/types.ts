import { Array, Record, Static, String } from 'runtypes'

export const Colegio = Record({
    name: String,
    address: String,
    city: String,
    province: String,
})


export const Alumno = Record({
    dni: String,
    name: String,
    birthdate: String,
    city: String,
    province: String,
    schools: Array(Colegio),
})

export const ServerError = Record({
    message: String,
})

export type Colegio = Static<typeof Colegio>
export type Alumno = Static<typeof Alumno>
export type ServerError = Static<typeof ServerError>