const { ObjectId} = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

let projectSchema = new Schema({
    project_ID: Number,
    project_name: String,
    planned_start_date: Date, 
    planned_end_date: Date,
    actual_start_date: Date,
    budget: Number, 
    game_ID: {type: ObjectId}, 
    project_team_ID: {type: ObjectId},
    owned_by: {type: String}
})

module.exports = mongoose.model("Project", projectSchema);