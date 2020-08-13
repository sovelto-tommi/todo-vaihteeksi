import React from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { Paper } from '@material-ui/core'
import Todos from './Todos'
export const Home = () => {
  return (
    <div>
      <Container width='90%'>
        <Box my={4}>
          <Paper elevation={3} style={{ padding: '2em' }}>
            <Typography variant='h2' component='h1' gutterBottom>
              Esimerkillinen ToDo UI - Material Table toteutus
            </Typography>
            <Typography variant='h4' component='h3' gutterBottom>
                Tänään on: {new Date().toLocaleDateString('fi')}  <span style={{fontSize: '0.6em'}}>
                    (eli {new Date().toISOString().split('T')[0]})
                </span>
            </Typography>
            <Todos/>
          </Paper>
        </Box>
      </Container>
    </div>
  )
}

export default Home
