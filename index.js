import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { registerValidator } from './validations/auth.js'
import { validationResult } from 'express-validator'

mongoose
  .connect(
    'mongodb+srv://blog:Test123@cluster0.ji6m8.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => console.log('DB OK!'))
  .catch((err) => console.log('DB ERROR!', err))

const app = express()

app.use(express.json())

app.post('/auth/register', registerValidator, (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }

  res.json({
    success: true
  })
})

app.listen(5000, (err) => {
  if (err) {
    return console.log('Server Kill!', err)
  }

  console.log('Server OK!')
})
