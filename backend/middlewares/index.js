const pool = require("../config");

async function logger (req, res, next) {
    const timestamp = new Date().toISOString().substring(0, 19)
    console.log(`${timestamp} | ${req.method}: ${req.originalUrl}`)
    next()
}

async function isLoggedIn (req, res, next) {
     let authorization = req.headers.authorization
     console.log(authorization)

     if (!authorization) {
         return res.status(401).send('You are not logged in 1')
     }

     let [part1, part2] = authorization.split(' ')
     if (part1 !== 'Bearer' || !part2) {
         return res.status(401).send('You are not logged in 2')
     }

     // Check token
     const [tokens] = await pool.query(
         'SELECT * FROM tokens WHERE token = ?', [part2])
     const token = tokens[0]
     if (!token) {
         return res.status(401).send('You are not logged in 3')
     }

     // Set user
     const [users] = await pool.query(
        'SELECT * FROM users WHERE user_id = ?', [token.user_id]
     )
     req.user = users[0]

     next()
 }

module.exports = {
    logger,
    isLoggedIn
}