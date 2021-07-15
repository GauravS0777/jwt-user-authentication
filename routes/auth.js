const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // create user
    user = new User({ name:name, email:email, password:hashedPassword });
    try{
        await user.save();
        return res.status(201).json({ _id: user._id });
    }catch(err){
        return res.status(400).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    // find user
    const user = await User.findOne({ email: email });
    if(!user) return res.status(400).json({ error: "User doesn't exist." });
    // validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) return res.status(400).json({ error: "Invalid password." });
    // send access token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.status(200).json({ authToken: token });
});

module.exports = router;
