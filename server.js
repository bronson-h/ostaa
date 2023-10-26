/**
 * Name: Bronson Housmans and Billy Dolny
 * Description:
 */

const mongoose = require('mongoose');
const express = require('express');
const parser = require('body-parser');
const app = express();
const port = 3000;
app.use(express.static('public_html'));
app.use(parser.json());

const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/ostaa';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var usernameSchema = new mongoose.Schema({
    username: String,
    password: String,
    listings: [],
    purchases: []
});
var userData = mongoose.model('userData', usernameSchema);

var itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    price: Number,
    stat: String
});
var itemData = mongoose.model('itemData', itemSchema);

// gets users from database and returns them as a JSON array to client
app.get('/get/users', (req,res) => {
    let users = userData.find({}).exec();
    users.then((results) => {
        res.json(results);
    });
});

// gets items from database and returns them as a JSON array to client
app.get('/get/items/', (req,res) => {
    let items = itemData.find({}).exec();
    items.then((results) => {
        res.json(results);
    });
});

// gets listings based on username from database and returns them as JSON array
app.get('/get/listings/:username', (req,res) => {
    let userItems = userData.find({username:{$regex:req.params.username}}).exec();
    userItems.then((results) => {
        res.json(results[0].listings);
    })
});

// gets purchases from database by certain username and returns JSON array
app.get('/get/purchases/:username', (req,res) => {
    let userPurchases = userData.find({username:{$regex:req.params.username}}).exec();
    userPurchases.then((results) => {
        res.json(results[0].purchases);
    })
});

// returns JSON list of all usernames that contain keyword
app.get('/search/users/:keyword', (req,res) => {
    let query = userData.find({username:{$regex:req.params.keyword}}).exec();
    query.then((results) => {
        res.json(results);
    })
});

// returns JSON list of all items whose descriptions contain the keyword 
app.get('/search/items/:keyword', (req,res) => {
    let query = itemData.find({description:{$regex:req.params.keyword}}).exec();
    query.then((results) => {
        res.json(results);
    })
});

// adds a user to the database
app.post('/add/user/', (req,res) => {

    let name = req.body.username;
    let pass = req.body.password;
    let user = new userData({username: name, password: pass});
    user.save()
        .then(() => {
            console.log(user); // You can log the saved message here
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
    let itemObj = {title: pTitle, description: pDesc, image: pImg, price: pPrice, status: pStat}; 
    let item = new itemData(itemObj);
    item.save()
        .then(() => {
            console.log(item); // You can log the saved message here
            let query = userData.find({username:{$regex:pUser}}).exec();
            query.then((documents) => {
                let user = documents[0];
                console.log(user);
                let list = user.listings
                list.push(itemObj);
                console.log(user);
                return user.save();
            });
        })
        .catch((error) => {
            console.error("Error saving message:", error);
            res.status(500).end("Error saving message.");
        });
});

app.listen(port, () => 
    console.log(`App listening at http://localhost:${port}`));