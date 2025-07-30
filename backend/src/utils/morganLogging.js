const morgan = require('morgan')
const { ActivityLog } = require('../models/index')

const morganToDb = morgan(function(tokens,req,res){
    return JSON.stringify({
        method : tokens.method(req,res),
        url : tokens.url(req,res),  
        status : Number(tokens.status(req,res)),
        response_time : parseFloat(tokens["response-time"](req,res)),
        ip : req.ip,
        userAgent : req.headers['user-agent']
    })
},{
    stream : {
        write :async(message)=>{
            try {
                const log = JSON.parse(message)
                await ActivityLog.create(log)
            } catch (error) {
                console.log("Error Creating Log",error)
            }
        }
    }
})

module.exports = morganToDb