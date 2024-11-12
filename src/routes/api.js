//Based on my previous Project in Advanced Web Applications
const express = require('express');
const companyB_DB = require('../db/companyB');
const mongoose = require('mongoose');


//Require mongoDB models:

const Game = require("../models/Game");
const Project = require("../models/Project");
const ProjectTeam = require("../models/ProjectTeam");
const ProjectTeamMember = require("../models/ProjectTeamMember");

var router = express.Router();

router.get("/", (req, res) => {

})

router.get("/gameProjects/companyA", async (req, res) => {
    console.log("Fetching game projects for company A..");
    const result = await ProjectTeam.find({});
    console.log(result);

    res.json({data: "Hello from company A"})

});


router.get("/gameProjects/companyB", async (req, res) => {

    //Test fetching data from db
    console.log("Fetching game projects for company B..")

    let query = 'SELECT owned_by, \"Project\".\"project_ID\", project_name, budget, \"Game\".\"game_ID\", game_name, description, launching_date, age_limit, genre, \"Game\".\"project_team_ID\", team_name, \"Project_team_member\".\"member_ID\", name, work_email, role FROM \"Project\" INNER JOIN \"Game\" ON \"Game".\"game_ID\" = \"Project\".\"game_ID\" INNER JOIN \"Project_team\" ON \"Project_team\".\"team_ID\" = \"Project\".\"project_team_ID\" INNER JOIN \"Project_team_member\" ON \"Project_team_member\".\"member_ID\" = \"Project_team\".\"team_leader_ID\";'
    let response = {};
    try {
        let result = await companyB_DB.query(query);
        console.log(result.rows);
        response = {data: result.rows};

    } catch(error) {
        response = {data: error};
    }

    res.json(response);
});


module.exports = router;