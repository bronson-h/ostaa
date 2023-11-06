/**
 * Name: Bronson Housmans and Billy Dolny
 * Description: Client side functionality for the Ostaa page. Includes post
 * requests sent to server for adding a user and adding an item.
 */


/**
 * This function is used when someone tries to create a new user
 * They are able to create the name and password for the user then is
 * sent to the server to be created.
 */
function addNewUser() {
    alert('User created!');
    let user = {
        username: document.getElementById('newUsername').value,
        password: document.getElementById('newPassword').value,
        listings: [],
        purchases: []
    };


    fetch('/add/user/', {
        method:'POST',
        body: JSON.stringify(user),
        headers: {'Content-Type': 'application/json'}
    }).then((res) => {
        return res.text();
    }).catch((err) => {
        console.log(err);
    })
}
/**
 * This function is used when the user is adding an item to the 
 * server. They will need to add pricing, title, description, image,
 * status, and the username that created the item. after submitting it 
 * it will be put into the server.
 */
function addItem() {
    let item = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        image: document.getElementById('image').value,
        price: document.getElementById('price').value,
        stat: document.getElementById('status').value,
    }
    fetch(`/add/item`, {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {'Content-Type': 'application/json'}
    }).then((res) => {
        window.location.href = '/home.html';
        return res.text();
    }).then((text) => {
        window.location.href = '/home.html';
        return;
    }).catch((err) => {
        console.log(err);
    });
}

function checkCreateUser(){
    let user = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };
    fetch('/UserCreate', {
        method:'POST',
        body: JSON.stringify(user),
        headers: {'Content-Type': 'application/json'}
    }).then((res) => {
        return response = res.text();
    }).then((response) => {
        console.log(response);
        if(response == 'successful') {
            addNewUser();
        } else {
            alert("Username already used")
        }
    }).catch((err) => {
        console.log(err);
    })
    
}

function login() {
    let user = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    fetch('/login', {
        method:'POST',
        body: JSON.stringify(user),
        headers: {'Content-Type': 'application/json'}
    }).then((res) => {
        return response = res.text();
    }).then((response) => {
        if(response == 'Successful') {
            console.log('redirect soon');
            window.location.href = '/home.html';
        } else {
            let fail = document.getElementById('failMessage');
            fail.innerText = "Login attempt failed";
        }
    }).catch((err) => {
        console.log(err);
    })
}
document.addEventListener('DOMContentLoaded', welcMsg);
function welcMsg() {
    let msg = document.getElementById("welcomeMsg");
    fetch('/getUser')
        .then((res) => {return res.text()})
        .then((user) => {
            console.log(user);
            msg.innerText = "Welcome " + user + "! What would you like to do?";
        })
        .catch((err) => {
            console.log(err);
        });
}

function searchListings() {
    let keyword = document.getElementById('searchInput').value;
    fetch(`/search/items/${keyword}`).then((res) => {
        return res.text();
    }).then((res) => {
        return JSON.parse(res);
    }).then((retObj) => {
        let htmlStr = '';
        for(jsonObj of retObj) {
            htmlStr = htmlStr + `<div class='right'><p>${jsonObj.title}</p><p>
            ${jsonObj.image}</p><p>${jsonObj.description}</p><p>${jsonObj.price}</p>`;
            console.log(jsonObj);
            console.log(jsonObj.status);
            if(jsonObj.status == 'SALE') {
                htmlStr = htmlStr + "<input type='button' id='buyButton name='buyButton' value='Buy Now' onclick='buyItem()'></div>";
            } else if(jsonObj.status == 'SOLD') {
                htmlStr = htmlStr + '<p>This item has been purchased</p></div>';
            } else {
                htmlStr = htmlStr + '<p>Unsure about item</p></div>';
            }
        }
        console.log(htmlStr)
        let right = document.getElementById('rightSide')
        right.innerHTML = htmlStr;
    })
}




function selectfile(){

}

function displayListings() {
    fetch(`/get/listings`).then((res) => {
        return res.text();
    }).then((res) => {
        return JSON.parse(res);
    }).then((retObj) => {
        let htmlStr = '';
        for(jsonObj of retObj) {
            htmlStr = htmlStr + `<div class='right'><p>${jsonObj.title}</p><p>
            ${jsonObj.image}</p><p>${jsonObj.description}</p><p>${jsonObj.price}</p>`;
            console.log(jsonObj);
            console.log(jsonObj.status);
            if(jsonObj.status == 'SALE') {
                htmlStr = htmlStr + "<input type='button' id='buyButton name='buyButton' value='Buy Now'></div>";
            } else if(jsonObj.status == 'SOLD') {
                htmlStr = htmlStr + '<p>This item has been purchased</p></div>';
            } else {
                htmlStr = htmlStr + '<p>Unsure about item</p></div>';
            }
        }
        console.log(htmlStr)
        let right = document.getElementById('rightSide')
        right.innerHTML = htmlStr;
    })
}

function displayPurchases() {
    fetch(`/get/purchases`).then((res) => {
        return res.text();
    }).then((res) => {
        return JSON.parse(res);
    }).then((retObj) => {
        let htmlStr = '';
        for(jsonObj of retObj) {
            htmlStr = htmlStr + `<div class='right'><p>${jsonObj.title}</p><p>
            ${jsonObj.image}</p><p>${jsonObj.description}</p><p>${jsonObj.price}</p>`;
            if(jsonObj.status == 'SALE') {
                htmlStr = htmlStr + "<input type='button' id='buyButton name='buyButton' value='Buy Now'></div>";
            } else if(jsonObj.status == 'SOLD') {
                htmlStr = htmlStr + '<p>This item has been purchased</p></div>';
            } else {
                htmlStr = htmlStr + '<p>Unsure about item</p></div>';
            }
        }
        console.log(htmlStr)
        let right = document.getElementById('rightSide')
        right.innerHTML = htmlStr;
    })
}

function redirectPost() {
    console.log('go to create item');
    window.location.href = '/post.html'; 
}
