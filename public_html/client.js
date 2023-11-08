/**
 * Name: Bronson Housmans and Billy Dolny
 * Description: Client side functionality for the Ostaa page. Includes post
 * requests sent to server for adding a user and adding an item. Also has
 * the ability to navigate between pages upon the user clicking a certain
 * button. Is able to display a user's listings, purchases, and also perform
 * a search of item descriptions.
 */


/**
 * This function is used when someone tries to create a new user
 * They are able to create the name and password for the user then is
 * sent to the server to be created.
 * @param: no parameters
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

/**
 * This function is used to determine if the attempt to create a user is valid.
 * If the username is new, the server responds with the message that the 
 * account creation was successful and this is displayed to the user. Otherwise,
 * the message that the username is already used is shown.
 * @param: no parameters
 */
function checkCreateUser(){
    let user = {
        username: document.getElementById('newUsername').value,
        password: document.getElementById('newPassword').value
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
checkValidUser(); // Initial call
setInterval(checkValidUser, 2000);

/**
 * Checks if the user accessing a page of Ostaa has the appropriate cookie.
 * If not they are sent to the login page
 * @param: no parameters
 */
function checkValidUser() {
    fetch('/check/valid/user').then((res) => {
        return res.text();
    }).then((text) => {
        if (text == 'reload') {
            console.log(window.location.href);
            if (window.location.href != '/index.html'){
                window.location.href = '/index.html';
            }
        } else {
            console.log('Valid user');
        }
    }).catch((err) => {
        console.log(err);
    });
}

/**
 * Fetches the login information provided to determine if the attempt is valid
 * or not. If invalid a message is displayed to say that the login info was
 * incorrect. If valid, the user is directed to the Ostaa home page.
 * @param: no parameters
 */
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

/**
 * This displays the welcome message at the top of the Ostaa left hand page.
 * Includes the username that is taken from the cookie.
 * @param: no parameters
 */
function welcMsg() {
    let msg = document.getElementById("welcomeMsg");
    fetch('/getUser')
        .then((res) => {return res.text()})
        .then((user) => {

            msg.innerText = "Welcome " + user + "! What would you like to do?";
        })
        .catch((err) => {
            console.log(err);
        });
}

/**
 * Searches the listings based on the input from the user in the search text
 * box. Sends a request to the server to find the items that match the word.
 * Then the function determines what HTML to use for the right window of Ostaa.
 * Will include a buy button if the item has not been bought yet or a message
 * that the item has been purchased.
 * @param: no parameters
 */
function searchListings() {
    let keyword = document.getElementById('searchInput').value;
    fetch(`/search/items/${keyword}`).then((res) => {
        return res.text();
    }).then((res) => {
        return JSON.parse(res);
    }).then((retObj) => {
        let htmlStr = '';
        let buttonIndex = 0;
        for(jsonObj of retObj) {
            htmlStr = htmlStr + `<div class='right'><p id='title${buttonIndex}'>
            ${jsonObj.title}</p><p>${jsonObj.image}</p><p>${jsonObj.description}</p>
            <p>${jsonObj.price}</p>`;
            if(jsonObj.status == 'SALE' || jsonObj.stat == 'SALE') {
                htmlStr = htmlStr + `<input type='button' id='buyButton name='buyButton' 
                value='Buy Now' onclick='buyNow(${buttonIndex})'></div>`;
            } else if(jsonObj.status == 'SOLD' || jsonObj.stat == 'SOLD') {
                htmlStr = htmlStr + '<p>This item has been purchased</p></div>';
            } else {
                htmlStr = htmlStr + '<p>Unsure about item</p></div>';
            }
            buttonIndex++;
        }
        console.log(htmlStr)
        let right = document.getElementById('rightSide')
        right.innerHTML = htmlStr;
    })
}

/**
 * Will display the listings made by a user on the right window of Ostaa.
 * This is done with a fetch to the server that returns an array with all of 
 * the user's listings as objects. These are iterated over and added to an
 * HTML string. The program also keeps track if the item is for sale or has
 * been bought.
 * @param: no parameters
 */
function displayListings() {
    fetch(`/get/listings`).then((res) => {
        return res.text();
    }).then((res) => {
        return JSON.parse(res);
    }).then((retObj) => {
        let htmlStr = '';
        let buttonIndex = 0;
        for(jsonObj of retObj) {
            htmlStr = htmlStr + `<div class='right'><p id='title${buttonIndex}'>
            ${jsonObj.title}</p><p>${jsonObj.image}</p><p>${jsonObj.description}</p>
            <p>${jsonObj.price}</p>`;
            console.log(jsonObj);
            console.log(jsonObj.status);
            if(jsonObj.status == 'SALE' || jsonObj.stat == 'SALE') {
                htmlStr = htmlStr + `<input type='button' id='buyButton' name='buyButton' 
                value='Buy Now' onclick='buyNow(${buttonIndex})'></div>`;
            } else if(jsonObj.status == 'SOLD' || jsonObj.stat == 'SOLD') {
                htmlStr = htmlStr + '<p>This item has been purchased</p></div>';
            } else {
                htmlStr = htmlStr + '<p>Unsure about item</p></div>';
            }
            buttonIndex = buttonIndex + 1;
        }
        console.log(htmlStr)
        let right = document.getElementById('rightSide')
        right.innerHTML = htmlStr;
    })
}

/**
 * This function displays the purchases that have been made by the user. Sends
 * a fetch to the server to get the list of items in their purchases. Then
 * creates an HTML string of all the info and sets the innerHTML of the right
 * Ostaa window equal to it.
 * @param: no parameters
 */
function displayPurchases() {
    fetch(`/get/purchases`).then((res) => {
        return res.text();
    }).then((res) => {
        return JSON.parse(res);
    }).then((retObj) => {
        let htmlStr = '';
        for(jsonObj of retObj) {
            console.log(jsonObj);
            htmlStr = htmlStr + `<div class='right'><p>${jsonObj.title}</p><p>
            ${jsonObj.image}</p><p>${jsonObj.description}</p><p>${jsonObj.price}</p>`;
            if(jsonObj.status == 'SALE' || jsonObj.stat == 'SALE') {
                htmlStr = htmlStr + `<input type='button' class='buyButton name='buyButton' 
                value='Buy Now'></div>`;
            } else if(jsonObj.status == 'SOLD' || jsonObj.stat == 'SOLD') {
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

/**
 * Sends the user to the post.html page to create a new item
 * @param: no parameters
 */
function redirectPost() {
    console.log('go to create item');
    window.location.href = '/post.html'; 
}

/**
 * Function to buy the object when pressing the button on the right display.
 * Sends a post request to the server to change information about the status
 * of an item
 * @param: buttonIndex: Number. used to know which item is bought since they
 * are numbered with their id.
 */
function buyNow(buttonIndex) {
    console.log(buttonIndex);
    let currId = `title${buttonIndex}`;
    let currTitle = document.getElementById(currId).innerText;
    console.log(currTitle);
    let currTitleObj = { title: currTitle };
    console.log('got the title');
    fetch('/buy/item', {
        method: 'POST',
        body: JSON.stringify(currTitleObj),
        headers: {'Content-Type': 'application/json'}
    }).then((res) => {
        return res.text();
    }).catch((err) => {
        console.log(err);
    });
}

/**
 * Checks if user is valid and will redirect them to home if not
 * @param: no parameters
 */
function checkValid() {
    fetch('/check/valid/user').then((response) => {
        return response.text();
    }).then((response) => {
        if(response == 'redirect') {
            window.location.href = '/index.html';
        }
    });
}