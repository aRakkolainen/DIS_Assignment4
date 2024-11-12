//Based on my previous Project in Advanced Web Applications
const express = require('express');
const companyB_DB = require('../db/companyB');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient


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
    let games = await Game.find({});
    console.log(games);
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


router.post("/add/newGame", async (req, res) => {
    console.log("Adding new game..")
    console.log(req.body);
    //If checked only for company A, then storing only to that database
    //To-do add checking how many games there already is and create the id based on that.
    let game_ID = 2; 
    let game_name = req.body.game_name; 
    let game_description = req.body.game_description; 
    let age_limit = req.body.age_limit; 
    let launching_date = req.body.launching_date; 
    let owned_by = ""; 
    let project_ID = ""; 
    let project_team_ID = ""; 
    //CompanyA is only owner of new game
    if (req.body.companyA) {
        console.log("Storing only to database of company A");
        owned_by = "Company A";
        let newGame = new Game({
            game_ID: 1002, 
            game_name: game_name, 
            description: game_description, 
            age_limit: age_limit, 
            launching_date: launching_date, 
            owned_by: owned_by,
            project_ID: project_ID, 
            project_team_ID: project_team_ID
        })
        console.log(newGame);
        await newGame.save(); 


    }
    
    //CompanyB is only owner of new game
    if(req.body.companyB) {
        console.log("Storing only to database of company B")
        let insertQuery = 'INSERT INTO \"Game\"(\"game_ID\", game_name, description, launching_date, recent_version, age_limit, \"project_ID\", \"project_team_ID\", genre) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
        owned_by = "Company B";
        /* console.log(insertQuery)
        let result = await companyB_DB.query(insertQuery, [game_ID, game_name, game_description, age_limit, launching_date, owned_by, project_ID, project_team_ID]);
        console.log(result); */




    } 


    // Both companies are owner of the new game (Development team which members from both companies)
    if(req.body.companyA && req.body.companyB) {
        console.log("Storing to both databases")

    }

});

router.post("/add/newProject", async (req, res) => {
    //CompanyA is only owner of new game
    if (req.body.companyA) {
        console.log("Storing only to database of company A")
    }
    
    //CompanyB is only owner of new game
    if(req.body.companyB) {
        console.log("Storing only to database of company B")

    } 


    // Both companies are owner of the new game (Development team which members from both companies)
    if(req.body.companyA && req.body.companyB) {
        console.log("Storing to both databases")

    }
});

router.get("/list/projectTeams", async(req, res) => {

});

router.post("/add/projectTeam", async(req, res) => {

});




module.exports = router;