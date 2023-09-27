const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors/')


const auth = (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  if(!authHeader || !authHeader.startsWith('Bearer')){
    throw new UnauthenticatedError('認証に失敗しました')
  }

  // let token = ''
  // if(authHeader){
  //   token = authHeader.split(' ')[1]
  // }
  const token = authHeader.split(' ')[1]
  // const token = authHeader
  // console.log('トークン', token)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // const user = User.findById(payload.id).select('-password')
    // req.user = user

    req.user = {userId: payload.userId, name: payload.name}
    next()
  } catch (error) {
    throw new UnauthenticatedError('認証に失敗しました')
  }
}

module.exports = auth