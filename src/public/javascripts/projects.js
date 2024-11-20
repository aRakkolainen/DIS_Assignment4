if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fillGameProjectsPage)
} else {
    fillGameProjectsPage(); 
}


let gameProjectsTableBody = document.getElementById("gameProjectsTableBd");
let gameDetailDiv = document.getElementById("gameDetail");
let projectDetailDiv = document.getElementById("projectDetail");

let gameHeader = document.getElementById("gameHeader"); 
let projectHeader = document.getElementById("projectHeader");

gameHeader.addEventListener("hover", () => {
    var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems, options);
        instances.open();
})

let hideGameDetailsBtn = document.getElementById("hideGameDetailsBtn");
let hideProjectDetailsBtn = document.getElementById("hideProjectDetailsBtn");

hideGameDetailsBtn.addEventListener("click", () => {
    console.log("Closing game details..")
    gameDetailDiv.setAttribute("class", "view-hidden");
})

hideProjectDetailsBtn.addEventListener("click", () => {
    console.log("Closing project details..")
    projectDetailDiv.setAttribute("class", "view-hidden");
})


async function fillGameProjectsPage() {
    console.log("Fetching data..")
    let gameProjectsFromCompanyA = await fetchGameProjectData("http://localhost:3000/api/gameProjects/companyA")
    let gameProjectsFromCompanyB = await fetchGameProjectData("http://localhost:3000/api/gameProjects/companyB")
    let gameProjectsList = [];
    if (gameProjectsFromCompanyA && gameProjectsFromCompanyB) {
        gameProjectsList = gameProjectsFromCompanyA.concat(gameProjectsFromCompanyB)
    }
    fillGameProjectsTable(gameProjectsList);
    
}

async function fetchGameProjectData(url) {
    let result = await fetch(url);
    let gameProjects = await result.json();
    console.log(gameProjects); 
    return gameProjects.data;
}

function fillGameProjectsTable(gameProjects) {
    let id = 0; 
    try{
        gameProjects.forEach((gameProject) => {
        
            let row = document.createElement("tr");
            row.setAttribute("id", "project#" + id.toString());
        let companyName = document.createElement("td");
        let projectName = document.createElement("td");
        let gameName = document.createElement("td");
        let developmentTeam = document.createElement("td");
        let projectManager = document.createElement("td");
        let ownedBy = "";
        if(gameProject.project_id.includes("CA")) {
            ownedBy = "CompanyA";
        } else if(gameProject.project_id.includes("CB")) {
            ownedBy = "CompanyB";
        }
        let companyText = addText("company" + id, ownedBy);
        companyName.appendChild(companyText);

        let projectText = addText("project" + id, gameProject.project_name);
        projectName.appendChild(projectText);

        projectName.addEventListener("click", async () => {
            console.log("Opening project view..");
            console.log("Opening detailed game view..");
            let url = "http://localhost:3000/api/detailedView/project/" + gameProject.project_id;
            console.log(url);
            let response = await fetch(url);
            let result = await response.json();
            let project = result.project; 
            //Show details..
            if(project) {
                fillProjectDetail(project.project_name, project.planned_start_date, project.planned_end_date, project.budget);
                projectDetailDiv.setAttribute("class", "view-visible");
            }
        })

        let gameText = addText("game" + id, gameProject.game_name);
        gameName.appendChild(gameText);
        
        gameName.addEventListener("click", async() => {
            console.log("Opening detailed game view..");
            let url = "http://localhost:3000/api/detailedView/game/" + gameProject.game_id;
            let response = await fetch(url);
            let result = await response.json();
            let game = result.game; 
            //Show details..
            if(game) {
                fillGameDetail(game.game_name, game.description, game.genre, game.age_limit, game.launching_date);
                gameDetailDiv.setAttribute("class", "view-visible");
            }
        

        })

        let developmentTeamText = addText("team" + id, gameProject.team_name);
        developmentTeam.appendChild(developmentTeamText);

        developmentTeam.addEventListener("click", () => {
            console.log("Opening project team view..");
        })

        let projectManagerText = addText("projectManager" + id, gameProject.project_manager);
        projectManager.appendChild(projectManagerText);

        row.appendChild(companyName);
        row.appendChild(projectName); 
        row.appendChild(gameName);
        row.appendChild(developmentTeam);
        row.appendChild(projectManager);
        gameProjectsTableBody.appendChild(row);
        id++;
    });
} catch(error) {
    console.log(error);
}
    
}
function fillGameDetail(name, description, genre, age_limit, launching_date) {
    let gameName = document.getElementById("gameName");
    let gameDescription = document.getElementById("gameDescription");
    let gameGenre = document.getElementById("gameGenre");
    let gameAgeLimit = document.getElementById("gameAgeLimit");
    let gameLaunchingDate = document.getElementById("gameLaunchingDate");
    //Source: https://www.w3schools.com/js/js_date_methods.asp
    let lDate = new Date(launching_date);
    const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    let launching_month = months[lDate.getMonth()];
    let plannedLaunchingDate = lDate.getDate() + "." + launching_month +"." + lDate.getFullYear();
    console.log(plannedLaunchingDate);
    gameName.innerText = "Name: " + name; 
    gameDescription.innerText = "Description: " + description; 
    gameGenre.innerText = "Genre: " + genre;
    gameAgeLimit.innerText = "Age limit: " + age_limit; 
    if(launching_date && plannedLaunchingDate) {
        gameLaunchingDate.innerText = "Planned launching date: " + lDate.getDate() + "." + launching_month +"." + lDate.getFullYear();
    }
}

function fillProjectDetail(name, planned_start_date, planned_end_date, budget) {
    let projectName = document.getElementById("projectName");
    let plannedStartDate = document.getElementById("plannedStartDate");
    let plannedEndDate = document.getElementById("plannedEndDate");
    let plannedBudget = document.getElementById("budget");
    //Source: https://www.w3schools.com/js/js_date_methods.asp
    const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    let plannedStartingDate;
    if(planned_start_date) {
        let plannedStart = new Date(planned_start_date);
        let starting_month = months[plannedStart.getMonth()];
        plannedStartingDate = plannedStart.getDate() + "." + starting_month +"." + plannedStart.getFullYear();
        plannedStartDate.innerText = "Planned start date: " +plannedStartingDate
    }
    let plannedEndingDate;
    if(planned_end_date) {
        let plannedEnd = new Date(planned_end_date);
        let ending_month = months[plannedEnd.getMonth()];
        plannedEndingDate = plannedEnd.getDate() + "." + ending_month +"." + plannedEnd.getFullYear();
        plannedEndDate.innerText = "Planned end date: " +plannedEndingDate
    }
    
    projectName.innerText = "Name: " + name; 
    plannedBudget.innerText = "Budget: " + budget + " €"; 
}

function addText(id, text) {
    let textBox = document.createElement("p");
    textBox.setAttribute("id", id);
    textBox.innerText = text;
    return textBox;
}
function clearTable(tableBody, baseID){
    let numberOfRows = tableBody.rows.length;
    for (let i=0; i < numberOfRows; i++) {
        let id = baseID + i; 
        let row = document.getElementById(id);
        tableBody.removeChild(row);
    }
}