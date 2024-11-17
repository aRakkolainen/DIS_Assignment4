const { ObjectId} = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

let gameSchema = new Schema({
    game_id: Number,
    game_name: String,
    description: String,
    launching_date: Date, 
    recent_version: String,
    age_limit: String, 
    genre: String, 
})

module.exports = mongoose.model('Game', gameSchema);