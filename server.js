const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { validateAccessToken } = require("./validateToken");
const User = require("./models/user");
const cors = require("cors");

dotenv.config();

// connecting to database
mongoose.connect(
    "mongodb://localhost:27017/authDB", 
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if(err) console.log(err);
        else console.log("Connected to database.");
    }
);

// middlewares
app.use(cors())
app.use(express.json());
app.use("/api/user", authRouter);

// only logged-in person with valid access-token can access
app.get("/username", validateAccessToken, async (req, res) => {
    const { username } = await User.findOne( { _id: req.user._id });
    res.status(200).json({ username: username });
})

app.listen(5000, () => {
    console.log("Server started on port 5000.");
})
