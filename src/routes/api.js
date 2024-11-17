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
    let related_projects = await Project.find({});
    let games = await Game.find({project_ID : {$in: related_projects.project_ID}});
    console.log(games);

    res.json({data: games})

});


router.get("/gameProjects/companyB", async (req, res) => {

    //Test fetching data from db
    console.log("Fetching game projects for company B..")

    let query = 'SELECT owned_by, project_name, game_name, team_name, member_name FROM project INNER JOIN game ON project.game_id = game.game_id INNER JOIN project_team ON project.project_team_id = project_team.team_id INNER JOIN project_team_member ON project_team.team_leader_id = project_team_member.member_id;';
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
    let companyA_games = await Game.find({});
    let numberOfGamesA = 1001; 
    let numberOfGamesB = 1001; 
    let gameID = 0; 
    if (companyA_games) {
        numberOfGamesA += companyA_games.length; 
    }
    let query = 'SELECT game_name FROM \"Game\"';
    let companyB_games = await companyB_DB.query(query);
    if (companyB_games) {
        numberOfGamesB += companyB_games.rowCount; 
    }
    let game_name = req.body.game_name; 
    
    let game_description = req.body.description;
    let age_limit = req.body.age_limit; 
    let launching_date = req.body.launching_date;
    let genre = req.body.genre; 
    let owned_by = ""; 
    let project_ID = 0; 
    let project_team_ID = 0; 
    let result = {}
    //Check how many games there are in both databases to define the ID
    
    if (req.body.companyA) {
        gameID = numberOfGamesA+1; 

        let game = await Game.find({game_name: game_name});
        //If game is already found, updating the existing one instead!
        if (game) {
            let updatedGame = {
                description: game_description, 
                age_limit: age_limit, 
                launching_date: launching_date, 
                owned_by: owned_by, 
                project_ID: project_ID, 
                project_team_ID: project_team_ID
            }

            await Game.findOneAndUpdate({game_name: game_name, game_ID: gameID}, updatedGame);
            let game = await Game.find({game_name: game_name});
            console.log(game);
            response = {message: 'Existing game updated successfully!'};
        } else {
            let newGame = new Game({
                game_ID: gameID, 
                game_name: game_name, 
                description: game_description, 
                age_limit: age_limit, 
                launching_date: launching_date, 
                owned_by: owned_by,
            })
            await newGame.save(); 
            response = {message: 'New game stored successfully!'};
        }
    }
    
    //CompanyB is only owner of new game
    if(req.body.companyB) {
        console.log("Storing only to database of company B");
        gameID = numberOfGamesB+1;
        let checkIfGameExists = "SELECT * FROM game WHERE game_name=$1;";

        let result = await companyB_DB.query(checkIfGameExists, [game_name]);
        if (result.rowCount > 0) {
            console.log("Game with this name already exists, so updating it instead..");
            let existingGame = result.rows[0];
            console.log(existingGame);
            let updateQuery = 'UPDATE game SET description=$1, launching_date=$2, age_limit=$3, genre=$4 WHERE game_id=$5;'
            let value = await companyB_DB.query(updateQuery, [game_description, launching_date, age_limit, genre, existingGame.game_ID]);
            console.log(value.rows);
        } else {
                let insertQuery = 'INSERT INTO game(game_id, game_name, description, launching_date, age_limit, genre) VALUES ($1, $2, $3, $4, $5, $6);';
                await companyB_DB.query(insertQuery, [gameID, game_name, game_description, launching_date, age_limit, genre]);
                response = {message: 'New game stored successfully!'};
            }
            //response = {message: 'Error occured while storing to database:' + error};
    } 

    // Both companies are owner of the new game (Development team which members from both companies)
    if(req.body.companyA && req.body.companyB) {
        console.log("Storing to both databases")
        console.log("Storing only to database of company A");
        owned_by = "Company A";
        try {
        let newGame = new Game({
            game_ID: numberOfGamesA, 
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
            gameID = numberOfGamesB+1;
            let insertQuery = 'INSERT INTO game(game_id, game_name, description, launching_date, age_limit, genre) VALUES ($1, $2, $3, $4, $5, $6);';
            await companyB_DB.query(insertQuery, [gameID, game_name, game_description, launching_date, age_limit, genre]);
            response = {message: 'New game stored successfully!'};
        } catch (error) {
            response = {message: 'Error occured while storing to database:' + error};
        }
        res.json(response);


    }

});

//Delete existing project
router.delete("/delete/game", async(req, res) => {

})




//Add new project
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


//Delete existing project
router.delete("/delete/project", async(req, res) => {

})



router.post("/add/newProjectTeam", async(req, res) => {
    console.log("Adding new project team to both databases..");
    let team_id = req.body.team_id;
    let team_name = req.body.team_name;
    let team_leader_id = req.body.team_leader_id;
    
    let responseMsg = {};
    //Inserting new team to the database of company A:
    //Checking if the project team with this name and id already exists
    let existing_team = await ProjectTeam.find({team_id: team_id, team_name: team_name});
    console.log(existing_team);
    let team_members = req.body.team_members;
    if (existing_team.length > 0) {
        team_members.forEach(async (member) => {
            let existing_members = existing_team.team_members;
            if(!existing_members.includes(member.member_id)) {
                existing_members.team_members.push(member.member_id);
            }
        });
        existing_team = {
            team_id: team_id,
            team_name: team_name, 
            team_leader_id: team_leader_id,
            team_members: existing_members
        }
    } else {
        let members_companyA = [];
        team_members.forEach(async (member) => {
            members_companyA.push(member.member_id);
        });
        let newProjectTeam = new ProjectTeam ({
            team_id: team_id,
            team_name: team_name, 
            team_leader_id: team_leader_id,
            team_members: members_companyA
        })
        try {
            await newProjectTeam.save();
        } catch(error) {
            console.log(error);
            responseMsg = {
                msg: "Failed to save due following error: " + error
            }
        }
    }
    
    //Inserting new project team for company B and adding the ids of members to team_member_in_project_team table
    let selectQuery = 'SELECT * FROM project_team WHERE team_name=$1';
    let insertNewProjectTeamQuery = 'INSERT INTO project_team(team_id, team_name, team_leader_id) VALUES ($1, $2, $3);';
    try {
        //Check if one team already exists: 
        let result = await companyB_DB.query(selectQuery, [team_name]);
        console.log(result.rows);
        if (result.rowCount > 0) {
            //Update existing team instead..
        } else {
            await companyB_DB.query(insertNewProjectTeamQuery, [team_id, team_name, team_leader_id]);
        }
    } catch(error) {
        console.log(error);
        responseMsg = {
            msg: "Failed to save due following error: " + error
        }
    }

    //team_member_in_project_team;
    let fk_team_id = req.body.team_id; 
    team_members.forEach(async (member) => {
        let insertQuery = 'INSERT INTO public.team_member_in_project_team(fk_team_id, fk_member_id) VALUES ($1, $2);'
        try {
            await companyB_DB.query(insertQuery, [fk_team_id, member.member_id]);
        } catch(error) {
            console.log(error);
            responseMsg = {
                msg: "Failed to save due following error: " + error
            }
        }  
    });
    responseMsg = {
        msg: "New project team saved successfully to both databases"
    }

    res.json(responseMsg);

});

router.get("/list/projectTeamMembers", async(req, res) => {
    console.log("Fetching team members from both databases");

    let companyAMembers = await ProjectTeamMember.find({company: 'companyA'});

    let result = await companyB_DB.query("SELECT * FROM project_team_member WHERE company='companyB';");
    let companyBMembers = result.rows; 
    let data = {
        companyA: companyAMembers, 
        companyB: companyBMembers
    }
    res.json(data);
})

router.get("/list/projectTeams", async(req, res) => {
    //Company A:
    console.log("Fetching project teams..");
    let project_teams_A = await ProjectTeam.find({});
    let result = await companyB_DB.query("SELECT * FROM project_team;");
    let project_teams_B = result.rows;
    let data = {
        companyA: project_teams_A, 
        companyB: project_teams_B
    }
    res.json(data);
})

async function fetchTeamMemberById(id) {
    let member = await ProjectTeamMember.find({member_id: id});
    return member;
}


module.exports = router;