window.onload = async () => {
    const newGameForm = document.getElementById("newGameForm");
    newGameForm.addEventListener("submit", onSubmit);
    //M.AutoInit();

}

async function onSubmit(event) {
    event.preventDefault(); 
    let url = "/api/add/newGame";
    const inputGameName = document.getElementById("game_name");
    const inputGameDescription = document.getElementById("game_description");
    const inputGameAgeLimit = document.getElementById("game_age_limit");
    const inputGenre = document.getElementById("game_genre")
    const inputLaunchingDate = document.getElementById("launching_date");
    const inputCompanyACheckBox = document.getElementById("companyACheckBox");
    const inputCompanyBCheckBox = document.getElementById("companyBCheckBox");
    /*To-Do linking project and project team with created game */

    let newGame = {
        game_name: inputGameName.value, 
        description: inputGameDescription.value, 
        age_limit: inputGameAgeLimit.value, 
        genre: inputGenre.value,
        launching_date: inputLaunchingDate.value, 
        companyA: inputCompanyACheckBox.checked,
        companyB: inputCompanyBCheckBox.checked    
    } 
    let response = await fetch(url, {
        method: "POST", 
        headers: {
        "Content-type": "application/json"
        }, 
        body: JSON.stringify(newGame)
    })
    let responseText = await response.json(); 
    alert(responseText.message);



}
