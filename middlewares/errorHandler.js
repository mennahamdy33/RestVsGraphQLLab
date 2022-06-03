module.exports = (err, req, res, next) => {
    // console.log('error handler: ', err);

    res.status(err?.status || 500);
    res.send({ 
        message: err?.message,
        code: err?.code || err?.name,
        details: err?.details
    });
}