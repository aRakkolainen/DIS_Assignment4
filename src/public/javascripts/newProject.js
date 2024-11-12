window.onload = async () => {
    const newProjectForm = document.getElementById("newProjectForm");
    newProjectForm.addEventListener("submit", onSubmit);
}





async function onSubmit(event) {
    event.preventDefault(); 
    let url = "/api/add/newGame";
    const inputProjectName = document.getElementById("project_name");
    const inputPlannedStartDate = document.getElementById("planned_start_date");
    const inputPlannedEndDate = document.getElementById("planned_end_date");
    const inputBudget = document.getElementById("inputBudget");
    const inputCompanyACheckBox = document.getElementById("companyACheckBox");
    const inputCompanyBCheckBox = document.getElementById("companyBCheckBox");
    /*To-Do linking project and project team with created game */

    let newProject = {
        project_name: inputProjectName.value, 
        planned_start_date: inputPlannedStartDate.value, 
        planned_end_date: inputPlannedEndDate.value,
        budget: inputBudget.value,
        companyA: inputCompanyACheckBox.checked,
        companyB: inputCompanyBCheckBox.checked    
    } 
    console.log(newProject);
    let response = await fetch(url, {
        method: "POST", 
        headers: {
        "Content-type": "application/json"
        }, 
        body: JSON.stringify(newProject)
    })

    console.log(response); 



}