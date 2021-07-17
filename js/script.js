const url = "https://randomuser.me/api/?results=12&nat=au&inc=name,location,%20email,phone,dob,picture"

const card_container = document.getElementById('card_container');

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
    return (peopleJSON);
}

function generateHTML(data){
    console.log(data.results);
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
