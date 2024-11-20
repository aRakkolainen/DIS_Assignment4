window.onload = async () => {
    fetchExistingProjectTeamsAndFillProjectOptions()
    fetchExistingGamesAndFillGameOptions()
    const newProjectForm = document.getElementById("newProjectForm");
    newProjectForm.addEventListener("submit", onSubmit);
}


async function onSubmit(event) {
    event.preventDefault(); 
    let url = "/api/add/newProject";
    const inputProjectName = document.getElementById("project_name");
    const inputPlannedStartDate = document.getElementById("planned_start_date");
    const inputPlannedEndDate = document.getElementById("planned_end_date");
    const inputBudget = document.getElementById("inputBudget");
    const inputProjectTeamOptions = document.getElementById("projectTeamOptions");
    const inputGameOptions = document.getElementById("gameOptions");
    let projectTeams = inputProjectTeamOptions.childNodes;
    let games = inputGameOptions.childNodes;
    let selectedProjectTeam = checkSelectedProjectTeam(projectTeams);
    let selectedGame = checkRadioButtonSelection(games);
    
    let newProject = {
        project_name: inputProjectName.value, 
        planned_start_date: inputPlannedStartDate.value, 
        planned_end_date: inputPlannedEndDate.value,
        budget: inputBudget.value,
        linked_project_team_id: selectedProjectTeam.project_team_id, 
        linked_team_leader_id: selectedProjectTeam.team_leader_id,
        linked_game_id: selectedGame     
    } 
    console.log(newProject);
    let response = await fetch(url, {
        method: "POST", 
        headers: {
        "Content-type": "application/json"
        }, 
        body: JSON.stringify(newProject)
    })

    let responseText = await response.text(); 
    alert(responseText);
}
function checkRadioButtonSelection(options){
    console.log("Checking options..")
    let selected = "";
    options.forEach((option) => {
        let label = option.firstChild;
        let input = label.firstChild;
        let span = label.lastChild;

        if(input.checked) {
          selected = span.id;
          console.log(selected);
        }
    })
    return selected;
}

function checkSelectedProjectTeam(options){
    console.log("Checking options..")
    let selected = "";
    options.forEach((option) => {
        let label = option.firstChild;
        let input = label.firstChild;
        let span = label.lastChild;

        if(input.checked) {
          selected = {
            project_team_id:input.id,
            team_leader_id:span.id
          }
        }
    })
    return selected;
}


async function fetchExistingProjectTeamsAndFillProjectOptions() {
    console.log("Fetching existing teams..");
    let result = await fetch('http://localhost:3000/api/list/projectTeams');
    let teams = await result.json(); 

    let teamsA = teams.companyA
    let teamsB = teams.companyB;
    let teamsList = teamsA.concat(teamsB);

    let teamOptionsElement= document.getElementById("projectTeamOptions");
    teamsList.forEach(team => {
        let listItem = document.createElement("li");
        let label = document.createElement("label");
        let input = document.createElement("input");
        let itemSpan = document.createElement("span");
        itemSpan.setAttribute("id", "option#" + team.team_id);
        input.setAttribute("id", team.team_id);
        input.setAttribute("type", "radio");
        input.setAttribute("name", "project_team");
        let owned_by = ""
        if(team.team_id.includes("CA_")) {
            owned_by = "CompanyA"
        } else if(team.team_id.includes("CB_")) {
            owned_by = "CompanyB"
        }
        itemSpan.innerText = team.team_name + " (Project Manager " + team.member_name + ", " + owned_by + ")";
        itemSpan.setAttribute("id", team.team_leader_id);
        label.appendChild(input); 
        label.appendChild(itemSpan);
        listItem.appendChild(label);
        teamOptionsElement.appendChild(listItem);
    })
}


async function fetchExistingGamesAndFillGameOptions() {
    console.log("Fetching existing games from both companies..");
    let result = await fetch('http://localhost:3000/api/list/games');
    let games = await result.json();
    //console.log(games);

    let gamesA = games.companyA_games;
    let gamesB = games.companyB_games;

    let gamesList = gamesA.concat(gamesB);
    let gameOptionsElement = document.getElementById("gameOptions");
    gamesList.forEach(game => {
        let listItem = document.createElement("li");
        let label = document.createElement("label");
        let input = document.createElement("input");
        let itemSpan = document.createElement("span");
        itemSpan.setAttribute("id", "option#" + game.game_id);
        input.setAttribute("id", game.game_id);
        input.setAttribute("type", "radio");
        input.setAttribute("name", "game");
        let plannedLaunchingDate = "";
        if (game.launching_date) {
            //Source: https://www.w3schools.com/js/js_date_methods.asp
            let launching_date = new Date(game.launching_date);
            const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
            let launching_month = months[launching_date.getMonth()];
            plannedLaunchingDate = launching_date.getDate() + "." + launching_month +"." + launching_date.getFullYear() 
        }
        let owned_by = "";
        if(game.game_id.includes("CA")) {
            owned_by = "CompanyA";
        } else if (game.game_id.includes("CB")) {
            owned_by = "CompanyB";
        } 


        itemSpan.innerText = game.game_name + " (planned launching date: " + plannedLaunchingDate + ", planned owner: "+ owned_by+ ")";
        itemSpan.setAttribute("id", game.game_id);
        label.appendChild(input); 
        label.appendChild(itemSpan);
        listItem.appendChild(label);
        gameOptionsElement.appendChild(listItem);
    })


}