const jwt = require("jsonwebtoken");

// middleware
const checkToken = (req, res, next) => {
    console.log(req.headers);
    const token = req.header("auth-token");
    if(!token) return res.status(401).send("Access denied.");
    // validate token
    try{
        req.user = jwt.verify(token, process.env.TOKEN_SECRET);
        next();
    }catch(err){
        return res.status(400).send("Invalid token.");
    }
}

module.exports = checkToken;
