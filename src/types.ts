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
    addresses: Array(String),
    schools: Array(Colegio),
})

export type Colegio = Static<typeof Colegio>
export type Alumno = Static<typeof Alumno>