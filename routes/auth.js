const router = require("express").Router();
const User = require("../models/user");
const Token = require("../models/token");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateRefreshToken } = require("../validateToken");

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    // see if user with the same email or username already exists
    let user;
    try{
        user = await User.findOne({ username: username });
        if(user) return res.status(400).json({ error: "User with the same username already exists."});
        user = await User.findOne({ email: email });
        if(user) return res.status(400).json({ error: "User with the same email already exists."});
    }catch(err){
        res.json(err);
    }
    if(password.length < 6) return res.status(400).json({ error: "Password must be of atleast 6 characters."});
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // create user
    user = new User({ username:username, email:email, password:hashedPassword });
    try{
        await user.save();
        return res.status(201).json({ _id: user._id });
    }catch(err){
        return res.status(400).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    // find user
    let user;
    try{
        user = await User.findOne({ username: username });
    }catch(err){
        res.json(err);
    }
    if(!user) return res.status(401).json({ error: "User doesn't exist." });
    // validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) return res.status(401).json({ error: "Invalid password." });
    // create access and refresh tokens
    const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5m" });  // 5m => 5 minutes
    const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET);
    // create token
    token = new Token({ token: refreshToken });
    try{
        await token.save();
        res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
    }catch(err){
        return res.json(err);
    }
});

router.delete("/logout", async (req, res) => {
    const refreshToken = req.header("refresh-token");
    if(!refreshToken) return res.status(401).json({ error: "Access denied." });
    // delete refresh-token from database
    try{
        await Token.deleteOne({ token: refreshToken });
        return res.status(200).json({ message: "Token deleted successfully." });
    }catch(err){
        return res.json(err);
    }
})

// get new access-token using refresh-token
router.post("/token", validateRefreshToken, async (req, res) => {
    // create access-token
    const accessToken = jwt.sign({ _id: req.user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5m" });
    res.status(200).json({ accessToken: accessToken });
});

module.exports = router;
