const jwt  = require('jsonwebtoken')
const dotenv = require('dotenv')
const apiError = require('../utils/apiError')

const { User } = require('../models/index')

dotenv.config()

const auth = async(req,res,next)=>{
    const authHeader = req.headers.auth;
    if(!authHeader && authHeader?.startsWith("Bearer ")){
        throw new apiError(404,"No Token Found Unauthorized Access")
    }

    const token = authHeader
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findByPk(decoded.user_id)
        if(!user){
            throw new apiError(404,"Invalid Token")
        }
        req.user = user
        next()
    } catch (error) {
        throw new apiError(402,"Invalid Or Expired Token",error)
    }
}

module.exports = auth;