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
    let user = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
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
        status: document.getElementById('status').value,
        username: document.getElementById('userItem').value
    }
    fetch(`/add/item/${item[username]}`, {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {'Content-Type': 'application/json'}
    }).then((res) => {
        return res.text();
    }).catch((err) => {
        console.log(err);
    })
}