let cart = [];

const renderCart = () => {
    const countElement = document.querySelector("#count");
    const selectedPlayersElement = document.querySelector("#selected-players");

    let pairs = {};
    let i = 1;
    cart.forEach(item => {
        pairs[i] = item.name;
        i++;
    })
    console.log(pairs);  
    countElement.textContent = cart.length;
    selectedPlayersElement.innerHTML = '';
    selectedPlayersElement.appendChild(createTable(pairs));
}

const createCard = (playerId, playerName, nationality, gender, team, sport, wage, thumbSrc, twitter, facebook, linkedin) => {
    const element = document.createElement("template");
    if(thumbSrc == null) {
        thumbSrc = 'assets/user_profile.png';
    }
    if(twitter == "" || twitter == undefined) 
        twitter = "#";
    else    
        twitter = "https://" + twitter;
    if(facebook == "" || facebook == undefined) 
        facebook = "#";
    else 
        facebook = "https://" + facebook;
    if(linkedin == "" || linkedin == undefined) 
        linkedin = "#";
    else 
        linkedin = "https://" + linkedin;

    element.innerHTML = `
        <div class="card m-1" style="width: 18rem;">
            <img src="${thumbSrc}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${playerName}</h5>
                <span><b>Nationality: </b>${nationality}</span><br/>
                <span><b>Gender: </b>${gender}</span><br/>
                <span><b>Team: </b>${team}</span><br/>
                <span><b>Sport: </b>${sport}</span><br/>
                <span class="pb-2" style="display: block;"><b>Wage: </b>${wage}</span>
                <div>
                    <a href="${twitter}" class="font-medium" target="_blank">
                        <i class="fa-brands fa-twitter"></i>
                    </a>
                    <a href="${facebook}" class="font-medium" target="_blank">
                        <i class="fa-brands fa-facebook"></i>
                    </a>
                    <a href="${linkedin}" class="font-medium" target="_blank">
                        <i class="fa-brands fa-linkedin"></i>
                    </a>
                </div>
                <a class="btn btn-primary add" data-playerid="${playerId}">Add to Group</a>
                <a class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detailsModal" data-playerid="${playerId}">Details</a>
            </div>
        </div>
    `;
    const card = element.content.children[0];
    const addButton = card.getElementsByClassName("add")[0];
    addButton.addEventListener("click", e => {
        if(cart.length == 11) {
            alert("You already have added 11 players.");
            return;
        }
        if(cart.find(item => item.id == playerId) == undefined) {
            cart.push({
                id: playerId,
                name: playerName,
            });
            renderCart();
        } else {
            alert("You have already added this player.");
        }
    })
    return card;
}

const createTable = (pairs) => {
    const element = document.createElement("template");
    let htmlText = '<table class="table table-striped">';
    Object.entries(pairs).forEach(pair => {
        htmlText += '<tr>'
        htmlText += `<td>${pair[0]}</td>`;
        htmlText += `<td>${pair[1]}</td>`;
        htmlText += '</tr>'
        console.log(pair);
    });
    htmlText += '</table>';
    element.innerHTML = htmlText;
    console.log(htmlText);
    const table = element.content.children[0];
    return table;
}

const loadByName = (playerName) => {
    const searchResults = document.getElementById("search-results");
    searchResults.innerHTML = '';

    fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`)
    .then(res => res.json())
    .then(res => {
        for(let i=0; i<10; i++) {
            const player = res.player[i];
            searchResults.appendChild(createCard(
                player.idPlayer,
                player.strPlayer,
                player.strNationality,
                player.strGender,
                player.strTeam,
                player.strSport,
                player.strWage,
                player.strThumb,
                player.strTwitter,
                player.strFacebook,
                player.strLinkedIn,
            ));
        }
    })
}

const searchButton_Click = (e) => {
    e.preventDefault();
    const inputElement = document.getElementById("search");
    loadByName(inputElement.value);
}

document.getElementById("search-bar").addEventListener("submit", searchButton_Click);

loadByName('');

const detailsModal = document.getElementById("detailsModal");

detailsModal.addEventListener("show.bs.modal", event => {
    const button = event.relatedTarget;
    const playerId = button.getAttribute("data-playerid");

    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`)
        .then(res => res.json())
        .then(res => {
            const player = res.players[0];
            detailsModal.querySelector(".modal-title").textContent = `Details of ${player.strPlayer}`;
            detailsModal.querySelector(".modal-body").innerHTML = '';
            detailsModal.querySelector(".modal-body").appendChild(createTable({
                Nationality: player.strNationality,
                Team: player.strTeam,
                Sport: player.strSport,
                Wage: player.strWage,
                Gender: player.strGender,
                Description: player.strDescriptionEN?.substring(0, 100) + "...",
            }));
        })
});
