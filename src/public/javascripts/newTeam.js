let teamMembersList = document.getElementById("memberOptions");
let teamLeadersList = document.getElementById("teamLeaderOptions");

window.onload = async () => {
    await fetchTeamMembersAndListThemToPage();
    let projectManagerHeader = document.getElementById("projectManagerToolTip");
    projectManagerHeader.addEventListener("hover", () => {
        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems, options);
        instances.open();
    })
}

async function fetchTeamMembersAndListThemToPage() {
    let result = await fetch('http://localhost:3000/api/list/projectTeamMembers');
    let members = await result.json(); 
    let membersList = members.companyA.concat(members.companyB);
    
    fillTeamMembersList(membersList);
    fillTeamLeaderList(membersList);
    const newProjectTeamForm = document.getElementById("newProjectTeamForm");
    newProjectTeamForm.addEventListener("submit", onSubmit);
}

function fillTeamLeaderList(members) {
    let id=teamLeadersList.length;
    let projectManagers = members.filter(member => member.role === 'Project Manager');
    projectManagers.forEach(manager => {
        let listItem = document.createElement("li");
        let label = document.createElement("label");
        let input = document.createElement("input");
        let itemSpan = document.createElement("span");
        itemSpan.setAttribute("id", "option" + id);
        input.setAttribute("id", manager.company + "_manager#" + manager.member_id);
        input.setAttribute("type", "radio");
        input.setAttribute("name", "project manager");
        itemSpan.innerText = manager.member_name + ", " + manager.role + ", " + manager.company;
        itemSpan.setAttribute("id", manager.company + "_manager#" + manager.member_id);
        label.appendChild(input); 
        label.appendChild(itemSpan);
        listItem.appendChild(label);
        teamLeadersList.appendChild(listItem);
        id++;
    })

}

function fillTeamMembersList(members) {
    let id=teamMembersList.length; 
    let teamMembers = members.filter(member => member.role !== 'Project Manager');
    teamMembers.forEach(member => {
        let listItem = document.createElement("li");
        listItem.setAttribute("class", "collection-item");
        //listItem.setAttribute("id", company + "_member#" + member.member_ID.toString());
        let label = document.createElement("label");
        let input = document.createElement("input");
        let itemSpan = document.createElement("span");
            itemSpan.setAttribute("id", "option" + id);
            input.setAttribute("id", member.member_id);
            input.setAttribute("type", "checkbox");
            input.setAttribute("class", "filled-in");
            itemSpan.innerText = member.member_name + ", " + member.role + ", " + member.company;
            itemSpan.setAttribute("id", member.member_id);
            label.appendChild(input); 
            label.appendChild(itemSpan);
            listItem.appendChild(label);
            teamMembersList.appendChild(listItem);
            id++;
    });

}

async function fetchExistingProjectTeams() {
    console.log("Fetching existing teams..");
    let result = await fetch('http://localhost:3000/api/list/projectTeams');
    let teams = await result.json(); 
    if (teams) {
        let numberOfTeams = {
            companyA: teams.companyA.length, 
            companyB: teams.companyB.length
        }
        return numberOfTeams;

    } 
}


async function onSubmit(event) {
    event.preventDefault(); 
    
    let inputTeamName = document.getElementById("team_name");
    let inputTeamLeaders = document.getElementById("teamLeaderOptions");
    let teamLeaders = inputTeamLeaders.childNodes;

    /* let numberOfTeams = await fetchExistingProjectTeams();
    let team_id = 1000;
    if (numberOfTeams.companyA != 0 && numberOfTeams.companyB != 0) {
        team_id = 1000 + numberOfTeams.companyA;
    } */
    let managerID = "";
    for (let i=0; i < teamLeaders.length; i++) {
        let input = teamLeaders[i].firstChild;
        let leaderOptions = input.childNodes;
        leaderOptions.forEach((leader) => {
            if(leader.checked) {
                let temp = leader.id.split("#");
              managerID = temp[1];
            }
        })
    }
    //Team members: 
    let members = [];
    let inputTeamMembers = document.getElementById("memberOptions");
    if (inputTeamMembers.hasChildNodes) {
        let membersLength = inputTeamMembers.childElementCount;
        let teamMembers = inputTeamMembers.childNodes;
        for (let i=0; i < membersLength; i++) {
            //console.log(teamMembers[i]);
            let label = teamMembers[i].firstChild;
            if (label) {
                let input = label.firstChild; 
                let textSpan = label.lastChild;
                if(input.checked) {
                    let member_id = textSpan.id;
                    let teamMember = {
                        member_id: member_id,
                    } 
                    members.push(teamMember);
                }
            }
        }
    }
        
    let newProjectTeam = {
        team_name: inputTeamName.value,
        team_leader_id: managerID,
        team_members: members
    };
    console.log(newProjectTeam);
    console.log("Project team to be stored: " + newProjectTeam);

    let url = 'http://localhost:3000/api/add/newProjectTeam'
   let response = await fetch(url, {
        method: "POST", 
        headers: {
            "Content-type": "application/json"
            }, 
        body: JSON.stringify(newProjectTeam)
    })
    let resultMsg = await response.json(); 
    console.log(resultMsg.msg);



}