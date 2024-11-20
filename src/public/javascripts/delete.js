

const deleteGameBtn = document.getElementById("deleteGameBtn");
const deleteProjectBtn = document.getElementById("deleteProjectBtn");
const deleteProjectTeamBtn = document.getElementById("deleteProjectTeamBtn");
const gameToBeDeleted = document.getElementById("game_name");
const projectToBeDeleted = document.getElementById("project_name");
const projectTeamToBeDeleted = document.getElementById("project_team_name");


deleteGameBtn.addEventListener("click", async () => {
    let url = 'http://localhost:3000/api/delete/game/' + gameToBeDeleted.value;
    let responseText = await sendDeleteDataItemRequest(url, gameToBeDeleted.value);
    alert(responseText);
    
    
    
});

deleteProjectBtn.addEventListener("click", async () => {
   let url = 'http://localhost:3000/api/delete/project/' + projectToBeDeleted.value;
   let responseText = await sendDeleteDataItemRequest(url);
   alert(responseText);
});

deleteProjectTeamBtn.addEventListener("click", async () => {
    console.log(projectTeamToBeDeleted.value)
    let url = 'http://localhost:3000/api/delete/projectTeam/' + projectTeamToBeDeleted.value;
    let responseText = await sendDeleteDataItemRequest(url);
    alert(responseText);
});


async function sendDeleteDataItemRequest(url, value) {
    let responseText = "";
    if(value != "") {
        let response = await fetch(url, {method: "DELETE"});
        responseText = await response.text();
        
    } else {
        console.log("Please specify the item to be deleted first!");
        responseText = "Please specify the item to be deleted first!"
    }
    return responseText;
}