const { ObjectId} = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

let projectTeamSchema = new Schema({
    team_ID: {type: ObjectId},
    team_name: {type: String}, 
    team_leader_ID: {type: ObjectId}
})

module.exports = mongoose.model("projectTeams", projectTeamSchema);