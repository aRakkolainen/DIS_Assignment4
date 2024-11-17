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
    let selectedProjectTeam = checkRadioButtonSelection(projectTeams);
    let selectedGame = checkRadioButtonSelection(games);
    
    let newProject = {
        project_name: inputProjectName.value, 
        planned_start_date: inputPlannedStartDate.value, 
        planned_end_date: inputPlannedEndDate.value,
        budget: inputBudget.value,
        linked_project_team_id: selectedProjectTeam, 
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

    let result = await response.json(); 
    console.log(result);
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
    console.log(teamsB);
    let teamsList = [];
    for (let i=0; i < teamsA.length; i++) {
        if (teamsA[i].project_team.team_id == teamsB[i].team_id && teamsA[i].project_team.team_name === teamsB[i].team_name) {
            teamsList.push(teamsB[i]);
        } else {
            teamsList.push(teamsA[i]);
            teamsList.push(teamsB[i]);
        }
    }
    
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
        itemSpan.innerText = team.team_name + " (Project Manager " + team.member_name + ", " + team.company + ")";
        itemSpan.setAttribute("id", team.team_id);
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
        itemSpan.innerText = game.game_name;
        itemSpan.setAttribute("id", game.game_id);
        label.appendChild(input); 
        label.appendChild(itemSpan);
        listItem.appendChild(label);
        gameOptionsElement.appendChild(listItem);
    })


}