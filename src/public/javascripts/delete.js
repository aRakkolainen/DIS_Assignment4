

const deleteGameBtn = document.getElementById("deleteGameBtn");
const deleteProjectBtn = document.getElementById("deleteProjectBtn");
const deleteProjectTeamBtn = document.getElementById("deleteProjectTeamBtn");
const gameToBeDeleted = document.getElementById("game_name");
const projectToBeDeleted = document.getElementById("project_name");
const projectTeamToBeDeleted = document.getElementById("project_team_name");

deleteGameBtn.addEventListener("click", async () => {
    let url = 'http://localhost:3000/api/delete/game/' + gameToBeDeleted.value;
    await sendDeleteDataItemRequest(url, gameToBeDeleted.value);
    
});

deleteProjectBtn.addEventListener("click", async () => {
   let url = 'http://localhost:3000/api/delete/project/' + projectToBeDeleted.value;
   await sendDeleteDataItemRequest(url);
});

deleteProjectTeamBtn.addEventListener("click", async () => {
    console.log(projectTeamToBeDeleted.value)
    let url = 'http://localhost:3000/api/delete/projectTeam/' + projectTeamToBeDeleted.value;
   await sendDeleteDataItemRequest(url);
});


async function sendDeleteDataItemRequest(url, value) {
    if(value != "") {
        let response = await fetch(url, {method: "DELETE"});
        let responseText = await response.text();
        console.log(responseText);

    } else {
        console.log("Please specify the item to be deleted first!");
    }
}