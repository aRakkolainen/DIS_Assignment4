const { ObjectId} = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

let gameSchema = new Schema({
    game_ID: String,
    game_name: String,
    description: String,
    launching_date: Date, 
    recent_version: String,
    age_limit: String, 
    genre: String, 
    project_ID: String, 
    project_team_ID: String
})

module.exports = mongoose.model('Game', gameSchema);