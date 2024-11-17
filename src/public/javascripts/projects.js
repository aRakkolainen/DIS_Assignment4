if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fillGameProjectsPage)
} else {
    fillGameProjectsPage(); 
}

let gameProjectsTableBody = document.getElementById("gameProjectsTableBd");




async function fillGameProjectsPage() {
    console.log("Fetching data..")
    let gameProjectsFromCompanyA = await fetchGameProjectData("http://localhost:3000/api/gameProjects/companyA")
    let gameProjectsFromCompanyB = await fetchGameProjectData("http://localhost:3000/api/gameProjects/companyB")
    
    console.log(gameProjectsFromCompanyA);
    console.log(gameProjectsFromCompanyB);
    fillGameProjectsTable(gameProjectsFromCompanyB);
    
}

async function fetchGameProjectData(url) {
    let result = await fetch(url);
    let gameProjects = await result.json(); 
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

        let companyText = addText("company" + id, gameProject.owned_by);
        companyName.appendChild(companyText);

        let projectText = addText("project" + id, gameProject.project_name);
        projectName.appendChild(projectText);

        projectName.addEventListener("click", () => {
            console.log("Opening project view..");
        })

        let gameText = addText("game" + id, gameProject.game_name);
        gameName.appendChild(gameText);

        gameName.addEventListener("click", () => {
            console.log("Opening detailed game view..");
            window.location.replace("http://localhost:3000/detailedGameView.html");
        })

        let developmentTeamText = addText("team" + id, gameProject.team_name);
        developmentTeam.appendChild(developmentTeamText);

        developmentTeam.addEventListener("click", () => {
            console.log("Opening project team view..");
        })

        let projectManagerText = addText("projectManager" + id, gameProject.member_name);
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