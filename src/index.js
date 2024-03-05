import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import participantRouters from '../routers/ParticipantRouters.js'
import formationRouters from '../routers/FormationRouters.js'
import formateurRouters from '../routers/FormateurRouters.js'
import sessionRouters from '../routers/SessionRouters.js'
import userRouters from '../routers/UserRouters.js'
import authRouters from '../routers/AuthRouters.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use('/auth', authRouters)
app.use('/users', userRouters)
app.use('/formateurs', formateurRouters)
app.use('/formations', formationRouters)
app.use('/sessions', sessionRouters)
app.use('/participants', participantRouters)

mongoose
  .connect(process.env.MONGODB_URL, () =>
    console.log('Connected successfully to database')
  )
  .catch(() => console.log('Something went wrong when connecting to database'))

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server in running on http://localhost:${PORT}`)
})
