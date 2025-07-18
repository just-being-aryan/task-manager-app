export const errorMiddleware = (err,req,res,next) => {
    const statusCode = err.statusCode || 500

    res.status(statusCode).json({
        success : false,
        message : err.message || 'Internal Server Error',
        stack : process.env.NODE_ENV == 'production' ? null : err.stack
    })
}

