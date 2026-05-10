async function authUser(req, res, next) {

    req.user = {
        id: "507f1f77bcf86cd799439011"
    }

    next()
}

module.exports = {
    authUser
}