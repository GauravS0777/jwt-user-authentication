const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
});

// this will store all valid refresh tokens
const Token = mongoose.model("token", tokenSchema);
module.exports = Token;
