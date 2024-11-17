const { ObjectId} = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

let projectTeamSchema = new Schema({
    team_id: String,
    team_name: {type: String}, 
    team_leader_id: {type: String},
    team_members: {type: Array}
})

module.exports = mongoose.model("ProjectTeam", projectTeamSchema);