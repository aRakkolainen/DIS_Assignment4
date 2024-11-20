const projectTeamsTable = document.getElementById("projectTeams");
const memberDetailedView = document.getElementById("memberDetailed");
const membersTableBody = document.getElementById("membersTableBody");
let projectTeamHeader = document.getElementById("membersHeader");
const hideTeamDetailsBtn = document.getElementById("teamDetailsBtn");
window.onload = async () => {
    let projectTeams = await fetchProjectTeamsData();
    let projectTeamsList = projectTeams.companyA.concat(projectTeams.companyB);
    console.log(projectTeamsList)
    fillProjectTeamsPage(projectTeamsList);
}
hideTeamDetailsBtn.addEventListener("click", () => {
    console.log("Closing project details..")
    memberDetailedView.setAttribute("class", "view-hidden");
})

async function fillProjectTeamsPage(projectTeams) {
    fillTeamsTable(projectTeams);
}


async function fetchProjectTeamsData() {
    let url = 'http://localhost:3000/api/list/detailed/project_teams';
    console.log("Fetching data..");
    let result = await fetch(url);
    let projectTeams = await result.json(); 
    return projectTeams;
}

function fillTeamsTable(projectTeams) {
    let id = 0; 
    projectTeams.forEach(team => {
        console.log(team);
        let row = document.createElement("tr");
        row.setAttribute("id", "project_team#" + team.team_id);
        let companyColumn = document.createElement("td");
        let teamColumn = document.createElement("td");
        let managerColumn = document.createElement("td");
        let membersColumn = document.createElement("td");
        let ownedBy = "";
        if(team.team_id.includes("CA")) {
            ownedBy = "CompanyA";
        } else if(team.team_id.includes("CB")) {
            ownedBy = "CompanyB";
        }
        let companyText = addText("company" + id, ownedBy);
        companyColumn.appendChild(companyText);

        let teamNameText = addText(team.team_id, team.team_name);
        teamColumn.appendChild(teamNameText);
        let managerNameRow = document.createElement("tr");
        let managerEmailRow = document.createElement("tr");
        let managerPhoneRow = document.createElement("tr");
        let project_manager = team.project_manager;
        let nameText = addText("Name#"+ project_manager.manager_id, project_manager.manager_name);
        managerNameRow.appendChild(nameText);
        let emailText = addText("Email#"+ project_manager.manager_id, project_manager.manager_work_email);
        managerEmailRow.appendChild(emailText);

        let phoneText = addText("Phone_num#"+ project_manager.manager_id, project_manager.manager_phone_number);
        managerPhoneRow.appendChild(phoneText);
       
        managerColumn.appendChild(managerNameRow);
        managerColumn.appendChild(managerEmailRow);
        managerColumn.appendChild(managerPhoneRow);
        let member_names = "";
        team.team_members.forEach((member) => {
            member_names += member.member_name + ", ";
        })
        console.log(membersTableBody);
        console.log(member_names);
        let memberNamesText = addText("membersOfTeam#"+ team.team_id, member_names);
        membersColumn.appendChild(memberNamesText);
        
        memberNamesText.addEventListener("click", () =>  {
            console.log("Showing details..");
            let rowID = "membersOfTeam#";
            let id = 0; 
            clearTable(membersTableBody, rowID);
            team.team_members.forEach((member) => {
                let memberID = rowID + id.toString();
                let row = createMemberRow(member, memberID);
                membersTableBody.appendChild(row)
                id++;
            })
            setMembersTableVisible();
        });
        memberDetailedView.appendChild(membersTable);
        
        
        
        
        
        row.appendChild(companyColumn);
        row.appendChild(teamColumn);
        row.appendChild(managerColumn);
        row.appendChild(membersColumn);
        projectTeamsTable.appendChild(row);
        
    });
    
    
    
    
    
    
}

function clearTable(tableBody, baseID){
    let numberOfRows = tableBody.rows.length;
    for (let i=0; i < numberOfRows; i++) {
        let id = baseID + i; 
        let row = document.getElementById(id);
        tableBody.removeChild(row);
    }
}

function fillMembersTableHeaders(membersTable) {
    let membersHeader = document.createElement("thead");
    let memberHeaderRow = document.createElement("tr");
    let nameHeader = document.createElement("td");
    let roleHeader = document.createElement("td");
    let emailHeader = document.createElement("td");
    let phoneNumberHeader = document.createElement("td");
    nameHeader.appendChild(addText("name", "Name"));
    roleHeader.appendChild(addText("role", "Role"));
    emailHeader.appendChild(addText("email", "Email"));
    phoneNumberHeader.appendChild(addText("phone_num", "Phone number"));
    memberHeaderRow.appendChild(nameHeader);
    memberHeaderRow.appendChild(roleHeader);
    memberHeaderRow.appendChild(emailHeader);
    memberHeaderRow.appendChild(phoneNumberHeader);
    membersHeader.appendChild(memberHeaderRow);
    membersTable.appendChild(membersHeader);
}

function createMemberRow(member, memberID){
    let memberRow = document.createElement("tr");
    memberRow.setAttribute("id", memberID);
    let memberNameTD = document.createElement("td");
    let memberRoleTD = document.createElement("td");
    let memberEmailTD = document.createElement("td");
    let memberPhoneNumberTD = document.createElement("td");
    let nameText = addText("Name#"+member.member_id, member.member_name);
    memberNameTD.appendChild(nameText);
    
    let roleText = addText("Role#"+member.member_id, member.role);
    memberRoleTD.appendChild(roleText);
    
    let emailText = addText("Email#"+member.member_id, member.work_email);
    memberEmailTD.appendChild(emailText);
    
    let phoneNumberText = addText("PhoneNum#"+member.member_id, member.phone_number);
    memberPhoneNumberTD.appendChild(phoneNumberText);
    memberRow.appendChild(memberNameTD);
    memberRow.appendChild(memberRoleTD);
    memberRow.appendChild(memberEmailTD);
    memberRow.appendChild(memberPhoneNumberTD);
    return memberRow;
}



function setMembersTableVisible() {
    memberDetailedView.setAttribute("class", "view-visible");
}

function addText(id, text) {
    let textBox = document.createElement("p");
    textBox.setAttribute("id", id);
    textBox.innerText = text;
    return textBox;
}

