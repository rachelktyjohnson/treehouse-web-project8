const url = "https://randomuser.me/api/?results=12&nat=au&inc=name,location,%20email,phone,dob,picture"

const card_container = document.getElementById('card_container');
const search_bar = document.getElementById('searchbar');
const modal = document.getElementById('modal');
const modal_btn_close = document.querySelector('.modal-box .close');
const modal_navigation = document.querySelector('.modal .navigation');
let people_data = null;

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
    people_data = peopleJSON.results;
    return (peopleJSON);
}

function generateHTML(data){
    card_container.innerHTML="";
    data.results.map( (person, index) =>{
        const new_card = `
        <div class="card" data-index="${index}">
            <img src="${person.picture.medium}"/>
            <div class="details" data-index="${index}">
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
        if (all_cards[i].textContent.includes(search_value)){
            all_cards[i].style.display = "flex";
        } else {
            all_cards[i].style.display = "none";
        }
    }
})

modal.style.display = "none";
modal_btn_close.addEventListener('click', ()=>{
    modal.style.display="none";
})

card_container.addEventListener('click', (e)=>{
    if(e.target.className!=="cards"){
        let card = e.target;
        if (e.target.className!=="card"){
            card = card.parentNode
        }
        let index = card.dataset.index;
        openModal(index)
    }
})

function openModal(index){
    let data = people_data[index];
    modal.style.display = "flex";
    console.log(data);
    document.querySelector('.m-photo').src = data.picture.large;
    document.querySelector('.m-name').innerHTML = `${data.name.first} ${data.name.last}`;
    document.querySelector('.m-email').innerHTML = data.email;
    document.querySelector('.m-city').innerHTML = `${data.location.city}, ${data.location.state}`;
    let phone = data.phone.replaceAll("-","");
    let beginning = phone.slice(0,3);
    let middle = phone.slice(3,6);
    let end = phone.slice(-4);
    document.querySelector('.m-number').innerHTML = `(${beginning}) ${middle}-${end}`;
    document.querySelector('.m-address').innerHTML = `${data.location.street.number} ${data.location.street.name}, ${data.location.city} ${data.location.postcode}`
    let birthday_datetime = new Date(data.dob.date);
    let birthday_string = `${birthday_datetime.getMonth()+1}/${birthday_datetime.getDate()}/${birthday_datetime.getFullYear()}`;
    document.querySelector('.m-dob').innerHTML = `Birthday: ${birthday_string}`;
    modal_navigation.dataset.index=index;
}

modal_navigation.addEventListener('click', (e)=>{

    let index = parseInt(e.target.parentNode.dataset.index);
    if (e.target.className==='m-previous'){
        if (index===0){
            openModal(11);
        } else {
            openModal(index-1);
        }
    } else if (e.target.className==='m-next'){
        if (index===11){
            openModal(0);
        } else {
            openModal(index+1);
        }
    }
})