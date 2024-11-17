const { ObjectId} = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

let projectTeamMemberSchema = new Schema({
    member_id: String,
    member_name: String, 
    phone_number: String, 
    work_email: String, 
    role: String,
    company: String,
})

module.exports = mongoose.model("ProjectTeamMember", projectTeamMemberSchema);