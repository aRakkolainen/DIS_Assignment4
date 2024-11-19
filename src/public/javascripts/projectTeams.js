if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fillProjectTeamsPage)
} else {
    fillProjectTeamsPage(); 
}

async function fillProjectTeamsPage() {
    await fetchProjectTeamsData();
}


async function fetchProjectTeamsData() {
    let url = 'http://localhost:3000/api/list/projectTeams/detailed';
    console.log("Fetching data..");
    let result = await fetch(url);
    let response = await result.json(); 
    console.log(response);
    
}

function fillTeamsTable() {
    const projectTeamsTable = document.getElementById("projectTeams");





}

