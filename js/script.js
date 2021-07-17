const url = "https://randomuser.me/api/?results=12&nat=au&inc=name,location,%20email,phone,dob,picture"

const card_container = document.getElementById('card_container');
const search_bar = document.getElementById('searchbar');
const modal = document.getElementById('modal');
//let people_data = null;

//try-block to get from url and turn into json, used for everything?
async function extractJSON(url){
    try{
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function getPeople(url){
    const peopleJSON = await extractJSON(url);
    //people_data = peopleJSON.results;
    return (peopleJSON);
}

function generateHTML(data){
    card_container.innerHTML="";
    data.results.map( person =>{
        const new_card = `
        <div class="card">
            <img src="${person.picture.medium}"/>
            <div class="details">
                <h2>${person.name.first} ${person.name.last}</h2>
                <p class="email">${person.email}</p>
                <p class="city">${person.location.city}, ${person.location.state}</p>
            </div>
        </div>
        `
        card_container.insertAdjacentHTML('beforeend',new_card)
    })
}

getPeople(url)
    .then(generateHTML)
    .catch(e=>{
        card_container.innerHTML = "<h3>Oops, something went wrong!</h3>"
        console.error(e);
    })
    .finally(()=>{
        document.getElementById('loading').remove();
    })


search_bar.addEventListener('keyup', ()=>{
    let search_value = search_bar.value.toLowerCase();

    //loop through the cards and hide the ones that don't match anything. show the ones that do
    let all_cards = document.querySelectorAll('.card');
    let count = 0;
    for (let i=0; i<all_cards.length; i++){
        count += 1;
        console.log(all_cards[i].textContent)
        if (all_cards[i].textContent.includes(search_value)){
            all_cards[i].style.display = "flex";
        } else {
            all_cards[i].style.display = "none";
        }
    }
})

modal.style.display = "none";