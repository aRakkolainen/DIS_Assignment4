const { ObjectId} = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

let projectSchema = new Schema({
    project_ID: {type: ObjectId},
    project_name: {type: String},
    planned_start_date: {type: Date}, 
    planned_end_date: {type: Date},
    actual_start_date: {type: Date},
    budget: {type: Number}, 
    game_ID: {type: ObjectId}, 
    project_team_ID: {type: ObjectId},
    owned_by: {type: String}
})

module.exports = mongoose.model("projects", projectSchema);