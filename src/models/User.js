import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Role from './Role.js'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('invalid email')
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: [Role.ADMIN, Role.USER, Role.FORMATEUR],
    },
  },
  {
    timestamps: true,
  }
)

//Hash the password
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isNew) {
    user.role = Role.USER
  }
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ user }, process.env.JWT_TOKEN, { expiresIn: '7d' })
  return token
}

//middleware
userSchema.statics.findByCrendtials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error('invalid credentials')
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('invalid credentials')
  return user
}

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  return userObject
}

const User = mongoose.model('User', userSchema)

export default User
