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
    let projects = await Project.find({});
    let related_games = [];
    let project_teams = [] ;
    if (projects) {
        projects.forEach( async(project) => {
            let game = await Game.find({game_id: project.game_id});
            let project_team = await ProjectTeam.find({team_id: project.project_team_id});
            related_games.push(game);
            project_teams.push(project_team); 
        })

    }
    let data = {
        projects_company_A: projects, 
        games_company_A: related_games,
        project_team_company_A: project_teams
    }
    res.json(data);

});


router.get("/gameProjects/companyB", async (req, res) => {

    //Test fetching data from db
    console.log("Fetching game projects for company B..")

    let query = 'SELECT project_name, game_name, team_name, member_name FROM project INNER JOIN game ON project.game_id = game.game_id INNER JOIN project_team ON project.project_team_id = project_team.team_id INNER JOIN project_team_member ON project_team.team_leader_id = project_team_member.member_id;';
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

router.get("/list/games", async (req, res) => {
    let games_company_B = []
    let gamesCompanyBQuery = 'SELECT * FROM game';
    let response = {}
    try {
        let games_company_A = await Game.find({});
        let result = await companyB_DB.query(gamesCompanyBQuery);
        games_company_B = result.rows;
        response = {
            companyA_games: games_company_A, 
            companyB_games: games_company_B
        }

    } catch(error) {
        console.log(error);
    }

    res.json(response);



})

//Add new game to databases
router.post("/add/newGame", async (req, res) => {
    console.log("Adding new game..")
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

//Delete existing game
router.delete("/delete/game", async(req, res) => {

})




//Add new project
router.post("/add/newProject", async (req, res) => {
    //Owner of project is defined based on the project manager
    console.log(req.body);
    let newName = req.body.name;
    let newTeam_id = req.body.linked_project_team_id;
    let newPlannedStartDate = req.body.planned_start_date; 
    let newPlannedEndDate = req.body.planned_end_date;
    let newBudget = req.body.budget;
    let newGame_id = req.body.linked_game_id;
    //let newPlannedStartDate = req.body.

    let project_team = await ProjectTeam.findOne({team_id: req.body.linked_project_team_id});
    let projects = await Project.find({});
    let id=100;
    let team_leader_id = project_team.team_leader_id;
    if (team_leader_id && team_leader_id.includes("CA")) {
        console.log("Company A will own the project");
        if(projects.length >0) {
            id = id + projects.length;
        }
            let project = await Project.findOne({project_name: newName});
            if(project) {
                project.project_team_id = newTeam_id; 
                project.planned_start_date = newPlannedStartDate; 
                project.planned_end_date = newPlannedEndDate; 
                project.budget = newBudget; 
                project.game_id = newGame_id;
                await project.save();
            } else {
                let newProject = new Project({
                    project_id: id, 
                    project_name: newName, 
                    planned_start_date: newPlannedStartDate, 
                    planned_end_date: newPlannedEndDate, 
                    budget: newBudget, 
                    game_id: newGame_id, 
                    owned_by: "CompanyA"
                });
                console.log(newProject);
                await newProject.save();
            }


    } 
    if(team_leader_id && team_leader_id.includes("CB")) {
        console.log("Company B will own the project");
        let findExistingProjectQuery = 'SELECT * FROM Project WHERE project_name=$1';
        let newProjectQuery = 'INSERT INTO project_id, project_name, planned_start_date, planned_end_date, budget, project_team_id, game_id, owned_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);';
        try  {
            let project = await companyB_DB.query(findExistingProjectQuery, [newName]);
            if (project.rowCount == 0) {
                await companyB_DB.query(newProjectQuery, [id, newName, newPlannedStartDate, newPlannedEndDate, newBudget, newProjectTeam, newGame_id]);
            } else {
                console.log("Project already exists, should update the existing one instead!");
            }
        } catch(error) {
            console.log(error);
        }
    }


    //Storing based on project manager..
    
});


//Delete existing project
router.delete("/delete/project", async(req, res) => {

})


//Adding new project team
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
    console.log("Fetching project teams..");
    let teams_A = await ProjectTeam.find({}); 
    let project_teams_A = []
    teams_A.forEach(async(team) => {
        let manager = await ProjectTeamMember.find({member_id: team.team_leader_id});
        let project_team = {
            project_team: team, 
            manager: manager
        }
        project_teams_A.push(project_team)
    })
    let result = await companyB_DB.query("SELECT team_id, team_name, member_name, company FROM project_team INNER JOIN project_team_member ON project_team.team_leader_id = project_team_member.member_id;");
    let project_teams_B = result.rows;
    let data = {
        companyA: project_teams_A, 
        companyB: project_teams_B
    }
    res.json(data);
})

router.get("/list/projectTeamNames", async(req, res) => {
    console.log("Fetching project team names..");
    let project_teams_A = await ProjectTeam.find({});
    let result = await companyB_DB.query("SELECT * FROM project_team;");
    let project_teams_B = result.rows;
    

    let data = {
        companyA: project_teams_A, 
        companyB: project_teams_B
    }
    res.json(data);
})



module.exports = router;