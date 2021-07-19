const jwt = require("jsonwebtoken");
const Token = require("./models/token");

// middleware
const validateAccessToken = (req, res, next) => {
    const accessToken = req.header("access-token");
    if(!accessToken) return res.status(401).json({ error: "Access denied." });
    // validate token
    try{
        req.user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        next();
    }catch(err){
        return res.status(401).json({ error: "Access denied." });
    }
}

const validateRefreshToken = async (req, res, next) => {
    const refreshToken = req.header("refresh-token");
    if(!refreshToken) return res.status(401).json({ error: "Access denied." });
    // Check if refresh-token present in database 
    try{
        const token = await Token.findOne({ token: refreshToken });
        if(!token) return res.status(401).json({ error: "Access denied." });
    }catch(err){
        return res.json(err);
    }
    // extract _id of the user
    try{
        const { _id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        req.user = { _id: _id };
    }catch(err){
        return res.json(err);
    }
    next();
}

module.exports = { validateAccessToken, validateRefreshToken };
