/**
 * Name: Bronson Housmans
 * Description:
 */

const mongoose = require('mongoose');
const express = require('express');
const parser = require('body-parser');
const app = express();
const port = 3000;
app.use(parser.json());

const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/ostaa';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var schema = new mongoose.Schema;
var usernameSchema = new schema({
    username: String,
    password: String,
    listings: [],
    purchases: []
});
var userData = mongoose.model('username', usernameSchema);

var itemSchema = new schema({
    title: String,
    description: String,
    image: String,
    price: Number,
    stat: String
});
var itemData = mongoose.model('item', itemSchema);

// gets users from database and returns them as a JSON array to client
app.get('/get/users', (req,res) => {});

// gets items from database and returns them as a JSON array to client
app.get('/get/items/', (req,res) => {});

// gets listings based on username from database and returns them as JSON array
app.get('/get/listings/:username', (req,res) => {});

// gets purchases from database by certain username and returns JSON array
app.get('/get/purchases/:username', (req,res) => {});

// returns JSON list of all usernames that contain keyword
app.get('/search/users/:keyword', (req,res) => {});

// returns JSON list of all items whose descriptions contain the keyword 
app.get('/search/items/:keyword', (req,res) => {});

// adds a user to the database
app.post('/add/user/', (req,res) => {

    let name = req.body.username;
    let pass = req.body.password;
    let userData = new usernameSchema({username: name, password: pass});
    userData.save()
        .then(() => {
            console.log(userData); // You can log the saved message here
        })
        .catch((error) => {
            console.error("Error saving message:", error);
            res.status(500).end("Error saving message.");
        });
});

// adds item to database and adds item to username's list of items
app.post('/add/item/:username', (req,res) => {
    let pTitle = req.body.title;
    let pDesc = req.body.description;
    let pImg = req.body.image;
    let pPrice = req.body.price;
    let pStat = req.body.stat;
    let pUser = req.body.username; 
    let item = new itemData({title: pTitle, description: pDesc, image: pImg, price: pPrice, status: pStat});
    item.save()
        .then(() => {
            console.log(item); // You can log the saved message here
            let query = userData.find({pUser})
            query.then((documents) => {
                user = documents[0];
                console.log(user);
                let list = user.listings
                list.push(item);
            });
        })
        .catch((error) => {
            console.error("Error saving message:", error);
            res.status(500).end("Error saving message.");
        });
});

app.listen(port, () => 
    console.log(`App listening at http://localhost:${port}`));