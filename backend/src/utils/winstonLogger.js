const { createLogger,format,transports  } = require('winston')
const path = require('path')

const logger = createLogger({
    level : "info",
    format : format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({stack : true}),
        format.json()
    ),
    transports : [
        new transports.File({
            filename : path.join(__dirname, "../logs/error.log"),
            level : "error"
        })
    ]
})

logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  )

module.exports = logger
