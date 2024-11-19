if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fillProjectTeamsPage)
} else {
    fillProjectTeamsPage(); 
}

async function fillProjectTeamsPage() {
    let url = 'http://localhost:3000/api/list/detailed/projectTeams';
    console.log("Fetching data..");
    let result = await fetch(url);
    let response = await result.json(); 
    console.log(response);
    //await fetchProjectTeamsData();
}


async function fetchProjectTeamsData() {
    
}

function fillTeamsTable(projectTeamsList) {
    const projectTeamsTable = document.getElementById("projectTeams");
    





}

