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
    let data = {};
    let result = [];
    let foundProject = {
        project_id: "", 
        project_name: "", 
        game_id: "",
        game_name: "", 
        project_manager: "", 
        team_name: ""
    }

    if (projects) {
        projects.forEach( async (project) => {
            console.log("Found project..")
            foundProject.project_id = project.project_id;
            foundProject.project_name = project.project_name;
            let game = await Game.findOne({game_id: project.game_id});
            if(game) {
               foundProject.game_name = game.game_name; 
               foundProject.game_id = game.game_id;
            }
            let project_team_result = await ProjectTeam.findOne({team_id: project.project_team_id});
            let manager; 
            if(project_team_result) {
                manager = await ProjectTeamMember.findOne({member_id: project_team_result.team_leader_id});
            } 
            if(manager) {
                foundProject.project_manager =  manager.member_name;
                foundProject.team_name = project_team_result.team_name;
                result.push(foundProject);
            }
            data = {
                data : result
            }
            res.json(data);
        })
    } else {
        data = {
            data: "Projects not found"
        }
    }
    
});


router.get("/gameProjects/companyB", async (req, res) => {

    //Test fetching data from db
    console.log("Fetching game projects for company B..")

    let query = 'SELECT project_id, project.game_id AS game_id, project_name, game_name, team_name, member_name AS project_manager FROM project INNER JOIN game ON project.game_id = game.game_id INNER JOIN project_team ON project.project_team_id = project_team.team_id INNER JOIN project_team_member ON project_team.team_leader_id = project_team_member.member_id;';
    let response = {};
    try {
        let result = await companyB_DB.query(query);
        response = {data: result.rows};

    } catch(error) {
        response = {data: error};
    }

    res.json(response);
});


router.get("/detailedView/game", async(req, res) => {
    res.redirect("http://localhost:3000/detailedGameView.html");
})

router.get("/detailedView/game/:game_id", async (req, res) => {
    let game_id = req.params.game_id;
    console.log(game_id);
    let result = {};
    
    let gameA = await Game.findOne({game_id: game_id});

    let gameQuery = 'SELECT * FROM game WHERE game_id=$1';
    let gameB;
    try {
        let gameResult = await companyB_DB.query(gameQuery, [game_id]);
        if(gameResult.rowCount > 0) {
            gameB = gameResult.rows[0];
        }

    } catch(error) {
        console.error(error);
    }

    if(gameA) {
        result = {
            game: gameA
        }
    } else if(gameB) {
        result = {
            game: gameB
        }
    } else {
        result = {
            game: "Not found"
        }
    }
    //window.location.replace("http://localhost:3000/detailedGameView.html");
    res.json(result);

})


router.get("/list/projectTeams/detailed", async(req, res) => {
    console.log("Listing project teams with detailed info..")
    let project_teams_A = await ProjectTeam.find({});
    console.log(project_teams_A.team_members);


    res.json({});



})

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
    if (companyA_games) {
        numberOfGamesA += companyA_games.length; 
    }
    let query = 'SELECT game_name FROM \"Game\"';
    let companyB_games = await companyB_DB.query(query);
    if (companyB_games) {
        numberOfGamesB += companyB_games.rowCount; 
    }
    let game_name = req.body.game_name; 
    game_name = game_name.toLowerCase();
    
    let game_description = req.body.description;
    let age_limit = req.body.age_limit; 
    let launching_date = req.body.launching_date;
    let genre = req.body.genre;
    let companyA = req.body.companyA;
    let companyB =  req.body.companyB;
    let owned_by = ""; 
    let response = {}
    //Check how many games there are in both databases to define the ID
    let existing_gameA = await Game.findOne({game_name: game_name});
    let checkIfGameExists = "SELECT * FROM game WHERE game_name=$1;";

    let gameBResult = await companyB_DB.query(checkIfGameExists, [game_name]);
    let existing_gameB;
    if(gameBResult.rowCount > 0) {
        existing_gameB = gameBResult.rows[0];
    }

    if(existing_gameA) {
        if(existing_gameA.game_id.includes("CA") && companyA){
            owned_by = "CompanyA";
            let updatedGame = {
                game_name: game_name,
                description: game_description, 
                genre: genre,
                age_limit: age_limit, 
                launching_date: launching_date, 
                owned_by: owned_by, 
            }
            await Game.findOneAndUpdate({game_name: game_name}, updatedGame);
            response = {message: 'Existing game updated successfully!'};
            console.log(response.message);
        } else if(existing_gameA.game_id.includes("CA") && companyB) {
            console.log("Needs to be checked if game exists in company B db already");
            if(existing_gameB) {
                console.log("Game already exists with this name");
                response = {message: 'Game exists already with this name'};
            } else {
                let id = 1001;
                if(numberOfGamesB > 0) {
                    id = numberOfGamesB +1;
                }
                let game_id = "CB_Game_" + id;
                let insertQuery = 'INSERT INTO game(game_id, game_name, description, launching_date, age_limit, genre) VALUES ($1, $2, $3, $4, $5, $6);';
                try {
                    await companyB_DB.query(insertQuery, [game_id, game_name, game_description, launching_date, age_limit, genre]);
                    
                }catch(error) {
                    console.error(error);
                }
                await Game.findOneAndDelete({game_name: game_name});
                response = {message: 'New game stored successfully!'};
                console.log(response.message);
            }
        } else {
            console.log("Existing game id is in wrong format");
        }
    } else if(existing_gameB) {
        if(existing_gameB.game_id.includes("CB") && companyB) {
             console.log("Updating within companyB");
             let updateQuery = 'UPDATE game SET game_name=$1, description=$2, launching_date=$3, age_limit=$4, genre=$5 WHERE game_id=$6;';
             try {  
                await companyB_DB.query(updateQuery, [game_name, game_description, launching_date, age_limit, genre, existing_gameB.game_id]);
                response = {message: "Updated game successfully"};
             }catch(error) {
                console.error(error);
             }

        } else if(existing_gameB.game_id.includes("CB") && companyA) {
            let id = 1001;
                if(numberOfGamesB > 0) {
                    id = numberOfGamesB +1;
                }
                let game_id = "CA_Game_" + id;
            let newGame = new Game({
                game_id: game_id, 
                game_name: game_name, 
                description: game_description,
                genre: genre, 
                age_limit: age_limit, 
                launching_date: launching_date, 
                owned_by: owned_by,
            })
            console.log(newGame);
            await newGame.save(); 
            try {
                let deleteQuery = 'DELETE FROM game WHERE game_id=$1;'
                await companyB_DB.query(deleteQuery, [existing_gameB.game_id]);
            } catch(error) {
                console.error(error);
            }


            response = {message: 'New game stored successfully!'};
            console.log(response.message);
        } else {
            console.log("Existing game id is in wrong format");
        }
    } else {
        console.log("Game does not exist in either databases, so adding new one..")
        if(companyA) {
            let id = 1001;
                if(numberOfGamesB > 0) {
                    id = numberOfGamesB +1;
                }
                let game_id = "CA_Game_" + id;
            let newGame = new Game({
                game_id: game_id, 
                game_name: game_name, 
                description: game_description,
                genre: genre, 
                age_limit: age_limit, 
                launching_date: launching_date, 
                owned_by: owned_by,
            })
            console.log(newGame);
            await newGame.save(); 
            response = {message: 'New game stored successfully!'};
            console.log(response.message);

        } else if(companyB) {
            let id = 1001;
                if(numberOfGamesB > 0) {
                    id = numberOfGamesB +1;
                }
                let game_id = "CB_Game_" + id;
            let insertQuery = 'INSERT INTO game(game_id, game_name, description, launching_date, age_limit, genre) VALUES ($1, $2, $3, $4, $5, $6);';
            try {
                await companyB_DB.query(insertQuery, [game_id, game_name, game_description, launching_date, age_limit, genre]);
                response = {message: 'New game stored successfully!'};
                console.log(response.message);

            }catch(error) {
                console.error(error);
            }
        } else {
            console.log("Error occured");
        }
    }
    res.json(response);
});

//Delete existing game
router.delete("/delete/game/:game_name", async(req, res) => {
    let game_name = req.params.game_name; 
    console.log(game_name);
    console.log("Trying to find the game..");
    let result_text = "";

    let gameA = await Game.findOne({game_name: game_name});
    if (gameA) {
        console.log("Game found from database A, deleting..");
        const deleteResult = Game.deleteOne({game_name: game_name});
        console.log(deleteResult);
        result_text = "Game deleted successfully";
    } else {
        console.log("Game not found from db A, trying to find from database B");
        let query = "SELECT * FROM game WHERE game_name=$1;"
        try {
            let result = await companyB_DB.query(query, [game_name]);
            if(result.rowCount == 0) {
                result_text = "Game not found from either databases, cannot be deleted";
            } else {
                console.log("Game found from db B, trying to delete..");
                //Game_id is as foreign key in project, so the 
                let gameB = result.rows[0];
                let deleteQuery = 'DELETE FROM game WHERE game_id=$1 AND game_name=$2;';
                try {
                    let deleteResult = await companyB_DB.query(deleteQuery, [gameB.game_id, game_name]);
                    result_text = 'Game deleted successfully';
    
                } catch(error) {
                    console.log(error);
                }
            }
        } catch(error) {
            console.log(error);
        }
    }
    res.send(result_text);
    
})




//Add new project
router.post("/add/newProject", async (req, res) => {
    //Owner of project is defined based on the project manager
    console.log("Adding new project..");
    console.log(req.body);
    let new_project_name = req.body.project_name;
    new_project_name = new_project_name.toLowerCase();
    let new_project_team_id = req.body.linked_project_team_id;
    let new_planned_start_date = req.body.planned_start_date; 
    let new_planned_end_date = req.body.planned_end_date;
    let new_budget = req.body.budget;
    let new_team_leader_id = req.body.linked_team_leader_id;
    let new_game_id = req.body.linked_game_id;

    let projects = await Project.find({});
    let numberOfProjectsA = 0;
    let numberOfProjectsB = 0; 
    if (projects) {
        numberOfProjectsA = projects.length;
    }
   //First checking, if there already is project with this name in company A db. 
   let existing_project_companyA = await Project.findOne({project_name: new_project_name});
   let findExistingProjectQuery = 'SELECT * FROM project WHERE project_name=$1';
   let selectAllProjectsQuery = 'SELECT * FROM project';
   let existing_result = await companyB_DB.query(findExistingProjectQuery, [new_project_name]);
   let allResults = await companyB_DB.query(selectAllProjectsQuery);
   let existing_project_companyB;
   if (existing_result.rowCount > 0) {
        existing_project_companyB = existing_result.rows[0];
    }
    if(allResults.rowCount > 0) {
        numberOfProjectsB = allResults.rowCount;
    }
   console.log(numberOfProjectsB);
   console.log("Checking if projects already exists with this name..");
   if(existing_project_companyA) {
    console.log("Project with this name already exists so this involves updating operations..");
    if(existing_project_companyA.project_team_leader_id && new_team_leader_id) {
        if(existing_project_companyA.project_team_leader_id.includes("CA") && new_team_leader_id.includes("CA")) {
            console.log("Updating existing project within company A");
            existing_project_companyA.project_name = new_project_name; 
            existing_project_companyA.planned_start_date = new_planned_start_date; 
            existing_project_companyA.planned_end_date = new_planned_end_date;
            existing_project_companyA.budget = new_budget; 
            existing_project_companyA.game_id = new_game_id;
            existing_project_companyA.project_team_id = new_project_team_id;
            existing_project_companyA.project_team_leader_id = new_team_leader_id;
            await existing_project_companyA.save();
            msgText = `Project ${new_project_name} updated successfully`;
            console.log(msgText);
            
        } else if(existing_project_companyA.project_team_leader_id.includes("CA") && new_team_leader_id.includes("CB")) {
            console.log("Creating the new team to company B db if there is not already project team with this name");
            if(existing_project_companyB) {
                console.log("Project with this name already exists so cannot create because it will violate unique constraint of project team name");
                msgText="This update is not allowed because it violates the unique project team name constraint in db B";
            } else {
                console.log("Project with this name does not exist in company B db, so it can be stored there..");
                let numberOfProjects = 1001;
                if(numberOfProjectsB > 0) {
                    numberOfProjects += numberOfProjectsB; 
                }
                let new_project_id = "CB_Project_" + numberOfProjects;
                
                
                let insertNewProjectQuery = 'INSERT INTO project(project_id, project_name, planned_start_date, planned_end_date, budget, project_team_id, game_id, owned_by, project_team_leader_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);;';
                try {
                    await companyB_DB.query(insertNewProjectQuery, [new_project_id, new_project_name, new_planned_start_date, new_planned_end_date, new_budget, new_project_team_id, new_game_id, "companyB", new_team_leader_id]);

                    //Deleting the old project from db A to avoid inconsistencies
                    await Project.findOneAndDelete({project_name: new_project_name});
                    msgText="Project updated successfully";
                } catch(error) {
                    console.log(error);
                    msgText = "Failed to save due following error: " + error
                } 
            }
        } else {
            console.log("Team leader ids not in right format");
        }
    }
} else if(existing_project_companyB) {
    console.log("Existing project in company B");
    if(existing_project_companyB.project_team_leader_id && new_team_leader_id) {
        if(existing_project_companyB.project_team_leader_id.includes("CB") && new_team_leader_id.includes("CB")) {
            console.log("Updating existing project within company B");
            let updateQuery = 'UPDATE project SET project_name=$1, planned_start_date=$2, planned_end_date=$3, budget=$4, project_team_id=$5, game_id=$6, owned_by=$7, project_team_leader_id=$8 WHERE project_id=$9;';
            await companyB_DB.query(updateQuery, [new_project_name, new_planned_start_date, new_planned_end_date, new_budget, new_project_team_id, new_game_id, "CompanyB", new_team_leader_id, existing_project_companyB.project_id])
            msgText = "Project updated successfully";
        } else if(existing_project_companyB.team_leader_id.includes("CB") && new_team_leader_id.includes("CA")) {
            console.log("Creating the new team to company A db if there is not project with this name");
            if(existing_project_companyA) {
                console.log("Project team with this name already exists so cannot create because it will violate unique constraint of project team name");
            } else {
                console.log("Project with this name does not exist in company A db, so it can be stored there..");
            }
        } else {
            console.log("Team leader ids not in right format");
        }
    }
    
} else {
    console.log("Project with this name does not yet exists so checking next where it needs to be stored");
    //Changing the name to be written in lower case to avoid case insentivity
    let new_project_id = "";
    if(new_team_leader_id) {
        if(new_team_leader_id.includes("CA")) {
            console.log("Project Manager is from Company A, storing the new project there..");
            //Fetching the existing teams to define the new id
            let numberOfProjects = 1001;
            if(numberOfProjectsA > 0) {
                numberOfProjects += numberOfProjectsA; 
            }
            let new_project_id = "CA_Project_" + numberOfProjects;
            
            let newProject = new Project({
                project_id: new_project_id,
                project_name: new_project_name,
                planned_start_date: new_planned_start_date, 
                planned_end_date: new_planned_end_date,
                budget: new_budget, 
                game_id: new_game_id,
                project_team_id: new_project_team_id,
                owned_by: "companyA", 
                project_team_leader_id: new_team_leader_id
            });
            await newProject.save();
            msgText=`New project stored successfully with name ${new_project_name}`;

        } else if(new_team_leader_id.includes("CB")) {
            console.log("Project Manager is from Company B, storing the new project team there..");
            //Checking how many teams there already is for defining the project_team id
            let numberOfProjects = 1001;
                if(numberOfProjectsB > 0) {
                    numberOfProjects += numberOfProjectsB; 
                }
                new_project_id = "CB_Project_" + numberOfProjects;
                let insertNewProjectQuery = 'INSERT INTO project(project_id, project_name, planned_start_date, planned_end_date, budget, project_team_id, game_id, owned_by, project_team_leader_id) VALUES ($1,$2, $3, $4, $5, $6, $7, $8, $9);';
                try {
                    await companyB_DB.query(insertNewProjectQuery, [new_project_id, new_project_name, new_planned_start_date, new_planned_end_date, new_budget, new_project_team_id, new_game_id, "companyB", new_team_leader_id]);
                    msgText=`New project added successfully with name ${new_project_name}`;
                    console.log(msgText);
                } catch(error) {
                    console.log(error);
                    msgText = "Failed to save due following error: " + error
                } 

        } else {
            console.log("Team leader id format is unknown");
            msgText = 'Team leader id has incorrect format';
        }
    } else {
        msgText = 'Project Manager Not Defined, cannot store the new project team';
    }

    res.send(msgText);

}  
});


//Delete existing project
router.delete("/delete/project/:project_name", async(req, res) => {
    let project_name = req.params.project_name; 
    project_name = project_name.toLowerCase();
    console.log("Trying to find the project..");
    let result_text = "";

    let projectA = await Project.findOne({project_name: project_name});
    if (projectA) {
        console.log("Project found from database A, deleting..");
        const deleteResult = await Project.deleteOne({project_name: project_name});
        console.log(deleteResult);
        result_text = `Project ${project_name} deleted successfully`;
    } else {
        console.log("Project not found from db A, trying to find from database B");
        let query = "SELECT * FROM project WHERE project_name=$1;"
        try {
            let result = await companyB_DB.query(query, [project_name]);
            if(result.rowCount == 0) {
                result_text = "Game not found from either databases, cannot be deleted";
            } else {
                console.log("Game found from db B, trying to delete..");
                let projectB = result.rows[0];
                let deleteQuery = 'DELETE FROM project WHERE project_id=$1 AND project_name=$2;';
                try {
                    let deleteResult = await companyB_DB.query(deleteQuery, [projectB.project_id, project_name]);
                    result_text = `Project ${project_name} deleted successfully`;
    
                } catch(error) {
                    console.log(error);
                }
            }
        } catch(error) {
            console.log(error);
        }
    }
    res.send(result_text);
})


//Adding new project team
router.post("/add/newProjectTeam", async(req, res) => {
    let new_team_name = req.body.team_name;
    new_team_name = new_team_name.toLowerCase();
    let new_team_leader_id = req.body.team_leader_id;
    let new_team_members = req.body.team_members;  
    let responseMsg = {};
    let msgText = "";
    
    //Ownership of project team will be defined based on which company the project manager belongs to even if the team has members from both companies
    //Inserting new team to the database of company A:
    //Checking if the project team with this name and id already exists
    //Checking if the project team already exists in neither of databases and then based on the new leader_id, it is stored
    
    
    let existing_team_companyA = await ProjectTeam.findOne({team_name: new_team_name});
    let selectQuery = 'SELECT * FROM project_team WHERE team_name=$1';
    let existing_team_companyB = {};
    let selectAllProjectTeamsQuery = 'SELECT * FROM project_team';
    let result = await companyB_DB.query(selectAllProjectTeamsQuery);
    let numberOfProjectTeamsB = result.rowCount;
    try {
        let result = await companyB_DB.query(selectQuery, [new_team_name]);
        existing_team_companyB = result.rows[0];
    } catch(error) {
        console.log(error);
    }
    if(existing_team_companyA) {
        console.log("Team with this name already exists so this involves updating operations..")
        if(existing_team_companyA.team_leader_id && new_team_leader_id) {
            if(existing_team_companyA.team_leader_id.includes("CA") && new_team_leader_id.includes("CA")) {
                console.log("Updating existing project team within company A");
                existing_team_companyA.team_name = new_team_name;
                existing_team_companyA.team_leader_id = new_team_leader_id;
                /* console.log("Current team");
                console.log(existing_team_companyA.team_members)
                console.log("new members");
                console.log(new_team_members); */
                //console.log(existing_team_companyA);
                //Clearing the existing team members
                //console.log(currentMembers)
                let team_members = existing_team_companyA.team_members;
                while (team_members.length > 0) {
                    team_members.pop();
                }
                console.log(team_members);

                new_team_members.forEach((member) => {
                    team_members.push(member);
                })
                existing_team_companyA.team_members = new_team_members;
                await existing_team_companyA.save();
                msgText = 'Project team updated successfully';
                
            } else if(existing_team_companyA.team_leader_id.includes("CA") && new_team_leader_id.includes("CB")) {
                console.log("Creating the new team to company B db if there is not already project team with this name");
                if(existing_team_companyB) {
                    console.log("Project team with this name already exists so cannot create because it will violate unique constraint of project team name");
                    msgText="This update is not allowed because it violates the unique project team name constraint in db B";
                } else {
                    console.log("Project with this name does not exist in company B db, so it can be stored there..");
                    let numberOfTeams = 1001;
                    if(numberOfProjectTeamsB > 0) {
                        numberOfTeams += numberOfProjectTeamsB; 
                    }
                    let new_team_id = "CB_Team_" + numberOfTeams;
                    
                    
                    let insertNewProjectTeamQuery = 'INSERT INTO project_team(team_id, team_name, team_leader_id) VALUES ($1, $2, $3);';
                    try {
                        await companyB_DB.query(insertNewProjectTeamQuery, [new_team_id, new_team_name, new_team_leader_id]);

                        //Deleting the old project from db A to avoid inconsistencies
                        await ProjectTeam.findOneAndDelete({team_name: new_team_name});
                        msgText="Project Manager and Team updated succsesfully";
                    } catch(error) {
                        console.log(error);
                        msgText = "Failed to save due following error: " + error
                    } 
                    
                    //team_member_in_project_team;
                    let fk_team_id = new_team_id;
                    
                    //Check if the members already belong to the team
                    new_team_members.forEach(async (member) => {
                        let insertQuery = 'INSERT INTO public.team_member_in_project_team(fk_team_id, fk_member_id) VALUES ($1, $2);'
                        try {
                            await companyB_DB.query(insertQuery, [fk_team_id, member.member_id]);
                            
                        } catch(error) {
                            console.log(error);
                            msgText= "Failed to save due following error: " + error
                        }  
                    }); 
                }
            } else {
                console.log("Team leader ids not in right format");
            }
        }
    } else if(existing_team_companyB) {
        if(existing_team_companyB.team_leader_id && new_team_leader_id) {
            if(existing_team_companyB.team_leader_id.includes("CB") && new_team_leader_id.includes("CB")) {
                console.log("Updating existing project team within company B");



            } else if(existing_team_companyB.team_leader_id.includes("CB") && new_team_leader_id.includes("CA")) {
                console.log("Creating the new team to company A db if there is not project with this name");
                if(existing_team_companyA) {
                    console.log("Project team with this name already exists so cannot create because it will violate unique constraint of project team name");
                } else {
                    console.log("Project with this name does not exist in company A db, so it can be stored there..");
                    let project_teams = await ProjectTeam.find({});
                    let numberOfTeams = 1001;
                    if (project_teams) {
                        numberOfTeams += project_teams.length;
                    }
                    let new_project_team_id = 'CA_Team_' + numberOfTeams;
                    let newProjectTeam = new ProjectTeam({
                        team_id: new_project_team_id,
                        team_name: new_team_name,
                        team_leader_id: new_team_leader_id,
                        team_members: new_team_members
                    });
                    await newProjectTeam.save();
                    //Delete the project team from db b to avoid inconsistencies
                    try {
                        //Delete first connections in Team_member_in_project_table and then the team itself
                        let deleteQuery = "DELETE FROM project_team WHERE team_id=$1;";
                        
                        let deleteMembers='DELETE FROM public.team_member_in_project_team WHERE fk_team_id=$1;';
                        await companyB_DB.query(deleteMembers, [existing_team_companyB.team_id]);
                        await companyB_DB.query(deleteQuery, [existing_team_companyB.team_id]);



                    } catch(error) {
                        console.error(error);
                    }


                    msgText=`New team stored successfully with name ${new_team_name}`;
                }
            } else {
                console.log("Team leader ids not in right format");
            }
        }
        
    } else {
        console.log("Project team with this name does not yet exists so checking next where it needs to be stored");
        //Changing the name to be written in lower case to avoid case insentivity
        new_team_name = new_team_name.toLowerCase();
        let new_project_team_id = "";
        if(new_team_leader_id) {
            if(new_team_leader_id.includes("CA")) {
                console.log("Project Manager is from Company A, storing the new project team there..");
                //Fetching the existing teams to define the new id
                let project_teams = await ProjectTeam.find({});
                let numberOfTeams = 1001;
                if (project_teams) {
                    numberOfTeams += project_teams.length;
                }
                new_project_team_id = 'CA_Team_' + numberOfTeams;
                console.log(new_project_team_id);
                let newProjectTeam = new ProjectTeam({
                    team_id: new_project_team_id,
                    team_name: new_team_name,
                    team_leader_id: new_team_leader_id,
                    team_members: new_team_members
                });
                await newProjectTeam.save();
                msgText=`New team stored successfully with name ${new_team_name}`;

            } else if( new_team_leader_id.includes("CB")) {
                console.log("Project Manager is from Company B, storing the new project team there..");
                //Checking how many teams there already is for defining the project_team id
                let numberOfTeams = 1001;
                    if(numberOfProjectTeamsB > 0) {
                        numberOfTeams += numberOfProjectTeamsB; 
                    }
                    let new_team_id = "CB_Team_" + numberOfTeams;
                    
                    
                    let insertNewProjectTeamQuery = 'INSERT INTO project_team(team_id, team_name, team_leader_id) VALUES ($1, $2, $3);';
                    try {
                        await companyB_DB.query(insertNewProjectTeamQuery, [new_team_id, new_team_name, new_team_leader_id]);

                        msgText=`New project team added successfully with name ${new_team_name}`;
                    } catch(error) {
                        console.log(error);
                        msgText = "Failed to save due following error: " + error
                    } 
                    
                    //team_member_in_project_team;
                    let fk_team_id = new_team_id;
                    
                    //Check if the members already belong to the team
                    new_team_members.forEach(async (member) => {
                        let insertQuery = 'INSERT INTO public.team_member_in_project_team(fk_team_id, fk_member_id) VALUES ($1, $2);'
                        try {
                            await companyB_DB.query(insertQuery, [fk_team_id, member.member_id]);
                            
                        } catch(error) {
                            console.log(error);
                            msgText= "Failed to save due following error: " + error
                        }  
                    }); 



            } else {
                console.log("Team leader id format is unknown");
                msgText = 'Team leader id has incorrect format';
            }
        } else {
            msgText = 'Project Manager Not Defined, cannot store the new project team';
        }
    /* if (existing_team_companyA && new_team_leader_id && new_team_leader_id.includes("CA")) {
        let teamID = 'CA_'+ new_team_id;
        if (existing_team_companyA.length > 0) {
            new_team_members.forEach(async (member) => {
                let existing_members = existing_team.team_members;
                if(!existing_members.includes(member.member_id)) {
                    existing_members.team_members.push(member.member_id);
                }
            });
            existing_team.team_name = new_team_name; 
            existing_team.team_members = team


            existing_team = {
                team_id: teamID,
                team_name: new_team_name, 
                team_leader_id: new_team_leader_id,
                team_members: existing_members
            }
        } else {
            let members_companyA = [];
            new_team_members.forEach(async (member) => {
                members_companyA.push(member.member_id);
            });

            let newProjectTeam = new ProjectTeam ({
                team_id: new_team_id,
                team_name: new_team_name, 
                team_leader_id: new_team_leader_id,
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
    }

    if(new_team_leader_id && new_team_leader_id.includes('CB')) {
        //Inserting new project team for company B and adding the ids of members to team_member_in_project_team table
        let insertNewProjectTeamQuery = 'INSERT INTO project_team(team_id, team_name, team_leader_id) VALUES ($1, $2, $3);';
        try {
            //Check if one team already exists: 
            let result = await companyB_DB.query(selectQuery, [new_team_name]);
            console.log(result.rows);
            if (result.rowCount > 0) {
                //Update existing team instead..
                let updateQuery = 'UPDATE project_team SET team_name=$1, team_leader_id=$2 WHERE team_id=$3;'
                await companyB_DB.query(updateQuery, [new_team_name, new_team_leader_id, new_team_id]);
            } else {
                await companyB_DB.query(insertNewProjectTeamQuery, [new_team_id, new_team_name, new_team_leader_id]);
            }
        } catch(error) {
            console.log(error);
            responseMsg = {
                msg: "Failed to save due following error: " + error
            }
        }
    
        //team_member_in_project_team;
        let fk_team_id = req.body.team_id; 

        //Check if the members already belong to the team
        new_team_members.forEach(async (member) => {
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
    } */
}
    responseMsg = {
        msg: msgText
    }
    console.log(responseMsg);
    res.json(responseMsg);

});



router.delete("/delete/projectTeam/:project_team_name", async(req, res) => {
    let projectTeamName = req.params.project_team_name;
    projectTeamName = projectTeamName.toLowerCase();
    let responseText = "";
    
    //companyA
    
    await ProjectTeam.findOneAndDelete({team_name: projectTeamName});
    responseText = `Project team ${projectTeamName} deleted successfully`;
    //companyB
    let query = 'SELECT * FROM project_team WHERE team_name=$1';
    try {
        let result = await companyB_DB.query(query, [projectTeamName]);
        if(result.rowCount > 0) {
            let projectTeam = result.rows[0];
            let team_id = projectTeam.team_id;
            //Deleting the data items in member in project team table before deleting the project_team
            let findTeamMembers = 'SELECT * FROM project_team WHERE team_id=$1'
            let rows = await companyB_DB.query(findTeamMembers, [team_id]);
            if(rows.rowCount && rows.rowCount > 0) {
                let team_members = rows.rows;
                team_members.forEach(async(member) => {
                    let deleteQuery = 'DELETE FROM team_member_in_project_team WHERE fk_member_id=$1';
                    await companyB_DB.query(deleteQuery, [member.member_id]);
                })

                let deleteProjectTeamQuery = 'DELETE FROM project_team WHERE team_id = $1';
                await companyB_DB.query(deleteProjectTeamQuery, [team_id]);
                responseText = `Project team ${projectTeamName} deleted successfully`;
            }
        }
    } catch(error) {
        console.error(error);
        responseText = `Failed to delete project team ${projectTeamName}, error occured: ${error} `;
    }
    res.send(responseText);
    
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
    let project_teams_A = [];
    teams_A.forEach(async(team) => {
        console.log(team.team_leader_id);
        let manager = await ProjectTeamMember.findOne({member_id: team.team_leader_id});
        console.log(manager);
        let project_team = {
            member_name: manager.member_name,
            team_leader_id: manager.member_id,
            team_id: team.team_id, 
            team_name: team.team_name
        }
        project_teams_A.push(project_team)
    })
    let result = await companyB_DB.query("SELECT team_id, team_name, member_name, team_leader_id FROM project_team INNER JOIN project_team_member ON project_team.team_leader_id = project_team_member.member_id;");
    let project_teams_B = result.rows;
    let data = {
        companyA: project_teams_A, 
        companyB: project_teams_B
    }
    res.json(data);
})




module.exports = router;