/**
 * Name: Bronson Housmans and Billy Dolny
 * Project: Ostaa Part 2
 * Description: Server for the Ostaa page. Contains the schema for the database
 * such that information for users and items are accurate. Is able to handle 
 * get requests where the server will send back information in JSON formatting.
 * Also able to have post requests for adding a user and an item that can be 
 * either for sale or sold. This should alsos check if users are valid and 
 * keeps track of the cookies an creates the database.
 */

const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const parser = require('body-parser');
const app = express();
const port = 80;
app.use(cookieParser());
app.use(express.json());
app.use(parser.json());

// Sets up the mongoose database
const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/ostaaD';
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

let sessions = {};

//adds a new session element
// @params: username: String. string of username logging in to session
function addSession(username) {
  let sid = Math.floor(Math.random() * 1000000000);
  let now = Date.now();
  sessions[username] = {id: sid, time: now};
  return sid;
}
//removes a session element
// @params: no parameters
function removeSessions() {
  let now = Date.now();
  let usernames = Object.keys(sessions);
  for (let i = 0; i < usernames.length; i++) {
    let last = sessions[usernames[i]].time;
    //if (last + 120000 < now) {
    if (last + 12000 < now) {
      delete sessions[usernames[i]];

      
    }
  }
  console.log(sessions);
}


setInterval(removeSessions, 2000);

// new attempt to get user back to page if not signed in
app.get('/check/valid/user', (req,res) => {
  let c = req.cookies;
  //console.log(c);
  let cookieKeys = Object.keys(c);
  console.log(cookieKeys);
  if (cookieKeys.length > 0) {
    if (sessions[c.login.username] != undefined && 
      sessions[c.login.username].id == c.login.sessionID) {
      res.end('valid user');
    } else {
      res.end("valid");
    }
  }  else {
    res.end('redirect');
  } 
});

/**
 * This also checks to see if the authentication for the cookies work.
 * @params: req: String. the request sent from the server.
 * res: Promise object. the response from the server back to the client
 * next: Allows the server to progress to the next task in the route
*/

function authenticate(req, res, next) {
    console.log('authenticate ran!');
    let c = req.cookies;
    console.log('auth request:');
    console.log(req.cookies);
    if (c != undefined) {
      if (sessions[c.login.username] != undefined && 
        sessions[c.login.username].id == c.login.sessionID) {
        next();
      } else {
        res.redirect('/index.html');
      }
    }  else {
      res.redirect('/index.html');
    }
  }
  
  app.use('/app/*', authenticate);
  app.get('/app/*', (req, res, next) => { 
    console.log('another');
    next();
  });
  app.use(express.static('public_html'))

  //This function is used to see if the login is valid or not.
  app.post('/login', (req, res) => { 
    console.log(sessions);
    let u = req.body;
    let p1 = userData.find({username: u.username, password: u.password}).exec();
    p1.then( (results) => { 
      console.log(results);
      if (results.length == 0) {
        res.end('Unsuccessful');
      } else {
        let sid = addSession(u.username);  
        res.cookie("login", 
          {username: u.username, sessionID: sid}, 
          {maxAge: 60000 * 2 });
        res.end('Successful');
      }
    });
  });
  
  //This get function is used to see if the 
  //there is a login username used or not and if so
  //It sends it to the client.
  app.get('/getUser', (req, res) => {
    if (req.cookies.login == null){
      res.end("NO NAME");
    } else {
    var name = req.cookies.login.username;
    console.log(name);
    res.end(name);
    }
  });

  //This is the post function that creates the user 
  //and also used to check if its is a duplicate or not.
  app.post('/UserCreate', (req, res) => { 
    let u = req.body;
    var name = u.username;
    console.log(req.body.username);
    if (name.length <= 0){
      res.end("unsuccessful");
    } else {
      console.log(u.username);
      let p1 = userData.find({username: u.username}).exec();
      p1.then( (results) => { 
        console.log(results);
        if (results.length == 0) {
          res.end('successful');
        } else {

          res.end('unsuccessful');
        }
      });
  }
  });

// gets users from database and returns them as a JSON array to client
app.get('/get/users', (req,res) => {
    let users = userData.find({}).exec();
    users.then((results) => {
        const formattedJSON = JSON.stringify(results, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.end(formattedJSON);
    });
});

// gets items from database and returns them as a JSON array to client
app.get('/get/items', (req,res) => {
    let items = itemData.find({}).exec();
    items.then((results) => {
        const formattedJSON = JSON.stringify(results, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.end(formattedJSON);
    });
});

// gets listings based on username from database and returns them as JSON array
app.get('/get/listings', (req,res) => {
    let c = req.cookies;
    let currUsername = c.login.username;
    let userItems = userData.find({username:{$regex:currUsername}}).exec();
    userItems.then((results) => {
        const formattedJSON = JSON.stringify(results[0].listings, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.end(formattedJSON);
    })
});

// gets purchases from database by certain username and returns JSON array
app.get('/get/purchases/', (req,res) => {
    let c = req.cookies;
    let currUsername = c.login.username;
    console.log(c);
    let userPurchases = userData.find({username:{$regex:currUsername}}).exec();
    userPurchases.then((results) => {
        const formattedJSON = JSON.stringify(results[0].purchases, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.end(formattedJSON);
    })
});

// returns JSON list of all usernames that contain keyword
app.get('/search/users/:keyword', (req,res) => {
    let query = userData.find({username:{$regex:req.params.keyword}}).exec();
    query.then((results) => {
        const formattedJSON = JSON.stringify(results, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.end(formattedJSON);
    })
});

// returns JSON list of all items whose descriptions contain the keyword 
app.get('/search/items/:keyword', (req,res) => {
    let query = itemData.find({description:{$regex:req.params.keyword}}).exec();
    query.then((results) => {
        const formattedJSON = JSON.stringify(results, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.end(formattedJSON);
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
app.post('/add/item', (req,res) => {
    let pTitle = req.body.title;
    let pDesc = req.body.description;
    let pImg = req.body.image;
    let pPrice = req.body.price;
    let pStat = req.body.stat;
    let pUser = req.cookies.login.username;
    let itemObj = {title: pTitle, description: pDesc, image: pImg, price: pPrice, stat: pStat};
    if(pStat == 'SALE') { 
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
                    user.save();
                    res.end("Successful");
                });
            })
            .catch((error) => {
                console.error("Error saving message:", error);
                res.status(500).end("Error saving message.");
            });
    } else if(pStat == 'SOLD') {
        let query = userData.find({username:{$regex:pUser}}).exec();
        query.then((documents) => {
            let user = documents[0];
            let itemsPurchased = user.purchases;
            itemsPurchased.push(itemObj);
            console.log(user);
            user.save();
            res.end("Successful");
        })
    }
});
//Thus function is used to buy an item and move it to the users purchases
app.post('/buy/item', (req,res) => {
    let c = req.cookies;
    let currUsername = c.login.username;
    var purchasedItem;
    let itemTitle = req.body.title;
    let query = itemData.find({title:{$regex:itemTitle}}).exec();
    query.then((itemList) => {
      let currItem = itemList[0];
      currItem.stat = 'SOLD';
      currItem.save();
      purchasedItem = currItem;
    });
    let query2 = userData.find({username:{$regex:currUsername}}).exec();
    query2.then((userList) => {
      let currUser = userList[0];
      let itemsPurchased = currUser.purchases;
      itemsPurchased.push(purchasedItem);
      console.log(purchasedItem);
      currUser.save();
    })
    let query3 = userData.find({}).exec();
    query3.then((userList) => {
      console.log(userList);
      var listingsList;
      for(let i = 0; i < userList.length; i++) {
        listingsList = userList[i].listings;
        for(let j = 0; j < listingsList.length; j++) {
          if(listingsList[j].title == itemTitle) {
            console.log('found same title');
            console.log(userList[i]);
            listingsList[j].stat = 'SOLD';
            let currListings = userList[i].listings;
            currListings[j] = listingsList[j];
            userList[i].save();
            break;
          }
        } 
      }
    })
    res.end('Successful');
})

app.listen(port, () => 
    console.log(`App listening at http://localhost:${port}`));