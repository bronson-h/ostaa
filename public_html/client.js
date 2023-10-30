/**
 * Name: Bronson Housmans and Billy Dolny
 * Description: Client side functionality for the Ostaa page. Includes post
 * requests sent to server for adding a user and adding an item.
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