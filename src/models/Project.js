const { ObjectId} = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

let projectSchema = new Schema({
    project_id: String,
    project_name: String,
    planned_start_date: Date, 
    planned_end_date: Date,
    budget: Number, 
    game_id: String,
    project_team_id: String,
    owned_by: String, 
    project_team_leader_id: String
})

module.exports = mongoose.model("Project", projectSchema);