import jwt from 'jsonwebtoken'
import Role from '../models/Role.js'
import User from '../models/User.js'

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decode = jwt.verify(token, process.env.JWT_TOKEN)
    const user = await User.findOne({ _id: decode.user._id })
    if (!user) {
      throw new Error()
    }
    req.user = user
    req.token = token
    next()
  } catch (err) {
    res.status(401).send({ message: 'unauthorized' })
  }
}

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decode = jwt.verify(token, process.env.JWT_TOKEN)
    const user = await User.findOne({ _id: decode.user._id })
    if (!user || user?.role !== Role.ADMIN) {
      throw new Error()
    }
    req.user = user
    req.token = token
    next()
  } catch (err) {
    res.status(401).send({ message: 'request unauthorized' })
  }
}
