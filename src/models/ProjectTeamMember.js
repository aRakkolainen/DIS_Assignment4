const { ObjectId} = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

let projectTeamMemberSchema = new Schema({
    member_ID: {type: ObjectId},
    member_name: {type: String}, 
    phone_number: {type: String}, 
    work_email: {type: String}, 
    role: {type: String},
    project_team_ID: {type: ObjectId}
})

module.exports = mongoose.model("projectTeamMembers", projectTeamMemberSchema);