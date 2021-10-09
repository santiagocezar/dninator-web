import { Button, Card, CardContent, CardHeader, Divider, List, ListItem, ListItemIcon, ListItemText, Stack, TextField, Typography } from '@mui/material'
import { Alumno } from './types'
import { Home, Cake, Place } from '@mui/icons-material'
import { ChangeEvent, useMemo, useState } from 'react'

export const App = () => {
    const [alumno, setAlumno] = useState<Alumno | null>()
    const [dni, setDNI] = useState('')

    const birthDate = useMemo(() => {
        if (alumno) {
            let date = new Date(alumno.birthdate.replaceAll('-', '/'))
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
        } else {
            return null
        }
    }, [alumno])

    function changedDNI(e: ChangeEvent) {
        if (e.target instanceof HTMLInputElement)
            setDNI(e.target.value)
    }

    function submitQuery() {
        fetch(`https://4l4qv4m1s1.execute-api.sa-east-1.amazonaws.com/?dni=${dni}`)
            .then(r => r.json())
            .then(o => Alumno.guard(o)
                ? setAlumno(o)
                : console.error('oops')
            )
    }

    return (
        <Stack direction="column" alignItems="center" spacing={2}>
            <Typography variant="h1">DNInator</Typography>
            <TextField variant="filled" label="N° de documento"
                onChange={changedDNI}
            />
            <Button onClick={submitQuery} variant="contained">Buscar</Button>
            {alumno && <Card sx={{ minWidth: 480 }}>
                <CardContent sx={{ mb: 'unset' }}>
                    <Typography variant="body1" color="GrayText">DNI: {alumno.dni}</Typography>
                    <Typography variant="h5">{alumno.name}</Typography>
                    <List dense>
                        <ListItem>
                            <ListItemIcon>
                                <Home />
                            </ListItemIcon>
                            <ListItemText>
                                {alumno.addresses}
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Cake />
                            </ListItemIcon>
                            <ListItemText>
                                {birthDate}
                            </ListItemText>
                        </ListItem>
                    </List>
                </CardContent>
                {alumno.schools.map(c => (
                    <>
                        <Divider />
                        <CardContent sx={{ mb: 'unset' }}>
                            <Typography variant="body1" color="GrayText">Colegio</Typography>
                            <Typography variant="h5" gutterBottom>{c.name}</Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        <Place />
                                    </ListItemIcon>
                                    <ListItemText>
                                        {c.address}, {c.city} {c.province}
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </CardContent>
                    </>
                ))}
            </Card>}
        </Stack>
    )
}
