import express from 'express'
import User from '../models/User.js'

const router = new express.Router()

router.post('/signup', async (req, res) => {
  const user = new User(req.body)
  try {
    const isUserExist = await User.exists({ email: user.email })
    if (isUserExist) throw new Error('user already exists')
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCrendtials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (err) {
    res.status(401).send({ ...err, message: err.message })
  }
})

export default router
