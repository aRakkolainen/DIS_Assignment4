const { ObjectId} = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

let projectTeamMemberInProjectTeamSchema = new Schema({
    project_team_ID: {type: ObjectId},
    members_ID_list: {type: Array}
})

module.exports = mongoose.model("teamMemberInProjecTeam", projectTeamMemberInProjectTeamSchema);