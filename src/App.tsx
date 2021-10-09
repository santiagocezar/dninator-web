import { Card, CardContent, CardHeader, Divider, List, ListItem, ListItemIcon, ListItemText, Stack, TextField, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Alumno, ServerError } from './types'
import { Home, Cake, Place } from '@mui/icons-material'
import { ChangeEvent, FormEvent, useMemo, useState } from 'react'



export const App = () => {
    const [alumno, setAlumno] = useState<Alumno | null>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
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

    function submitQuery(e: FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        fetch(`https://4l4qv4m1s1.execute-api.sa-east-1.amazonaws.com/?dni=${dni}`)
            .then(r => r.json())
            .then(o => {
                setLoading(false)
                if (Alumno.guard(o))
                    setAlumno(o)
                else if (ServerError.guard(o))
                    setError(o.message)
                else {
                    setError('Unknown error')
                    console.error(o)
                }
            })
            .catch(e => setError(e.message))
    }

    return (
        <Stack direction="column" alignItems="center" spacing={2}>
            <Typography variant="h3">proa.dni</Typography>
            <form onSubmit={submitQuery}>
                <Stack direction="column" alignItems="center" spacing={2}>
                    <TextField
                        variant="filled" label="N° de documento"
                        error={error != null}
                        helperText={error}
                        onChange={changedDNI}
                    />
                    <LoadingButton
                        type="submit"
                        loading={loading}
                        variant="contained">
                        Buscar
                    </LoadingButton>
                </Stack>
            </form>
            {alumno && <Card sx={{ width: '100%', maxWidth: 480 }}>
                <CardContent sx={{ mb: 'unset' }}>
                    <Typography variant="body1" color="GrayText">DNI: {alumno.dni}</Typography>
                    <Typography variant="h5">{alumno.name}</Typography>
                    <List dense>
                        <ListItem>
                            <ListItemIcon>
                                <Home />
                            </ListItemIcon>
                            <ListItemText>
                                {alumno.city}, {alumno.province}
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
                                        {c.address}, {c.city}, {c.province}
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
