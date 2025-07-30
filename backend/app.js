const express = require('express')
const app = express()

const cors = require('cors')
const apiError = require('./src/utils/apiError')
const logger = require('./src/utils/winstonLogger')
const morganToDb = require('./src/utils/morganLogging')

const userRoutes = require('./src/routes/user.route')
const todoRoutes = require('./src/routes/todo.route')

app.use(express.json())
app.use(cors('*'))
app.use(morganToDb)

app.use('/user',userRoutes)
app.use('/todo',todoRoutes)

app.use((err, req, res, next) => {

  logger.error(err.message || "Internal Server Error",{
    message : err.message,
    stack : err.stack,
    method : req.method,
    url : req.originalUrl,
    userAgent : req.headers["user-agent"],
    ip : req.ip,
    user_id : req.user_id || null
  })

    if (err instanceof apiError) {

      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errors: err.errors,
        data: null,
        stack: err.stack = undefined,
      });
    }
  
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: [err.message],
      data: null,
      stack:err.stack ,
    });
});


app.listen(3000,()=>{
    console.log("app is Runnig In Port 3000")
})