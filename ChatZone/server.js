/*
 /  Author:     Minghui Ke , Ruihan Zhang
 /  Assignment: Chat Zone
 /  
 /  Purpose:    The server.js file will use express and mongoose to make a simple social contact application.
*/

const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const cookieParser = require("cookie-parser");
const multer = require('multer');
const crypto = require('crypto');
const iterations = 1000;


const app = express();
app.use(cookieParser());
app.use(parser.json() );
app.use(parser.urlencoded({ extended: true }));

const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/ChatZone';

//--------------------schema-----------------------------------//
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    salt: String,
    hash: String,
    image: String,
    color: String,
    birth: String,
    gender: String,
    job: String,
    ps: String,
    like: Number,
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    waitlist: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    strangers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    moment: [{ type: Schema.Types.ObjectId, ref: 'Moment' }],
    liked: [{ type: Schema.Types.ObjectId, ref: 'Moment' }]
});
var User = mongoose.model('User', UserSchema);

var ChatSchema = new Schema({ 
    user_a: String,
    user_b: String,
    message: String,
    time: Number
});
var Chat = mongoose.model('Chat', ChatSchema);

var MomentSchema = new Schema({ 
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    image: String,
    like: Number,
    time: Number
});
var Moment = mongoose.model('Moment', MomentSchema);
//-------------------------------------------------------//

app.use('/me.html', authenticate);
app.use('/moment.html', authenticate);
app.use('/home.html', authenticate);
app.use(express.static('./public_html'));

// Set up default mongoose connection
// mongoose.connection.db.dropDatabase();
mongoose.connect(mongoDBURL, () => { useNewUrlParser: true;});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var sessionKeys = {};
setInterval( ()=>{
    let now = Date.now();
    for (i in sessionKeys) {
        if (sessionKeys[i][1] < (now - 6000000)) {
            delete sessionKeys[i];
        }
    }
}, 1000);

// check the account login session when logined.
function authenticate (req, res, next) {
    if (Object.keys(req.cookies).length > 0) {
        let key = req.cookies.login.key;
        let u = req.cookies.login.username;
        if ((u in sessionKeys) && sessionKeys[u][0] == key) {
            next();
        } else res.redirect('/index.html');
    } else res.redirect('/index.html');
}

// Should return a array containing the information for every user in the database.
app.get('/get/users/', (req, res) => {
    User.find({})
    .exec(function(error, results) {
        res.send(JSON.stringify(results));
    });
});


//-------------------------------------User-----------------------------------------------//

// Should add a user to the database. The username and password should be sent as POST parameter(s).
app.post('/create/user/', (req, res) => {
    let userObject = JSON.parse(req.body.user);
    var user = new User(userObject);
    let password = userObject.password;
    User.find({username: user.username})
    .exec(function(error, results) {
        if (results.length == 0) {
            var temp = [];
            User.find({})
            .exec(function(error, results) {
                for (i in results){
                    if (results[i].username != user.username) {
                        results[i].strangers.push(user._id);
                        results[i].save(function (err) { if (err) console.log('an error occurred');})
                        temp.push(results[i]._id);
                    }
                }
                var salt = crypto.randomBytes(64).toString('base64');
                crypto.pbkdf2(password, salt, iterations, 64, 'sha512', (err, hash) => {
                    if (err) throw err;
                    user.salt = salt;
                    user.hash = hash.toString('base64');
                    user.strangers = temp;
                    user.image = "default.png";
                    user.like = 0;
                    user.save(function (err) { if (err) console.log(err);})
                });
            });
            res.send("Account Created!");
        } else res.send("Account Exit!");
    })
});

// login the account and set the cookie and secssion, use the salty and hash for the password safe.
app.get('/login/:name/:pw', (req, res) => {
    var username = req.params.name;
    var password = req.params.pw;
    User.find({username: username})
    .exec(function(error, results) {
        if (results.length == 1) {
            var salt = results[0].salt;
            crypto.pbkdf2(password, salt, iterations, 64, 'sha512', (err, hash) => {
                if (err) throw err;
                if (results[0].hash == hash.toString('base64')){
                    let sessionKey = Math.floor(Math.random()*1000);
                    sessionKeys[username] = [sessionKey, Date.now()];
                    res.cookie("login", {username: username, key: sessionKey}, {maxAge: 6000000});
                    res.send("correct");
                } else res.send("incorrect");
            });
        } else res.send("incorrect");
    });
});

// get the image name of the head portrait.
app.get('/get/touxiang/', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name=req.cookies.login.username; 
        User.find({username : name}).exec(function(error, results) { 
        res.send(results[0].image);
        });
    } else res.send("logout");
});

// get the favourite color theme of the user.
app.get('/changecolor/', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name=req.cookies.login.username; 
        User.find({username : name}).exec(function(error, results) { 
        res.send(results[0].color);
        });
    } else res.send("logout");
});

// get name of the user.
app.get('/get/name/', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name = req.cookies.login.username;
        User.find({username: name})
        .exec(function(error, results) {
            res.json(results[0].username);
        });
    } else res.send("logout");
});

// get information of the user.
app.get('/get/info/', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name = req.cookies.login.username;
        User.find({username: name})
        .exec(function(error, results) {
            res.json({name: results[0].username, gender: results[0].gender, birthday: results[0].birth, job: results[0].job, ps: results[0].ps, like: results[0].like});
        });
    } else res.send("logout");
});

// add information of the user on the me.html page, include many field and save it.
app.post('/add/info/:b/:c/:i/:g/:j/:p', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name=req.cookies.login.username; 
        User.find({username : name}).exec(function(error, results) { 
            results[0].birth=req.params.b;
            results[0].color=req.params.c;
            results[0].image=req.params.i;
            results[0].gender=req.params.g;
            results[0].job=req.params.j;
            results[0].ps=req.params.p;
            results[0].save(function (err) { if (err) console.log('an error occurred'); });
            res.send();
        });
    } else res.send("logout");
});

//------------------------------------------------------------------------------------------------//


//-------------------------------------Friend---------------------------------------------//

// search for the strangers list with keywords and return the list.
app.get('/search/strangers/:k', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name = req.cookies.login.username;
        var toReturn = [];
        User.find({username: name})
        .populate("strangers")
        .exec(function(error, results) {
            var temp = results[0].strangers;
            for (let i=0; i<temp.length;i++){
                if (temp[i].username.indexOf(req.params.k) !== -1){
                        toReturn.push({name: temp[i].username});
	            }
            }
            res.json(toReturn);
        });
    } else res.send("logout");
});

// search for the friends list with keywords and return the list.
app.get('/search/friends/:k', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name = req.cookies.login.username;
        var toReturn = [];
        User.find({username: name})
        .populate("friends")
        .exec(function(error, results) {
            var temp = results[0].friends;
            for (let i=0; i<temp.length;i++){
                if (temp[i].username.indexOf(req.params.k) !== -1){
                    toReturn.push({name: temp[i].username});
                }
            }
            res.json(toReturn);
        });
    } else res.send("logout");
});

// search for the waitlist with keywords and return the list.
app.get('/search/wait/:k', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name = req.cookies.login.username;
        var toReturn = [];
        User.find({username: name})
        .populate("waitlist")
        .exec(function(error, results) {
            var temp = results[0].waitlist;
            for (let i=0; i<temp.length;i++){
                if (temp[i].username.indexOf(req.params.k) !== -1){
                toReturn.push({name: temp[i].username});
	            }
            }
            res.json(toReturn);
        });
    } else res.send("logout");
});

// view someone's information by the user's name and return the information.
app.get('/view/info/:name', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name = req.params.name;
        User.find({username: name})
        .populate("moment")
        .exec(function(error, results) {
            var temp = results[0];
            res.json({name: temp.username, birthday: temp.birth, image: temp.image, gender: temp.gender, job: temp.job, ps: temp.ps, like: temp.like});
        });
    } else res.send("logout");
});

// return the friend list of the user.
app.get('/get/friends/', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name = req.cookies.login.username;
        var toReturn = [];
        User.find({username: name})
        .populate("friends")
        .exec(function(error, results) {
            var temp = results[0].friends;
            for (i in temp){
                toReturn.push({name: temp[i].username});
            }
            res.json(toReturn);
        });
    } else res.send("logout");
});

// return the wait list of the user.
app.get('/get/wait/', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name = req.cookies.login.username;
        var toReturn = [];
        User.find({username: name})
        .populate("waitlist")
        .exec(function(error, results) {
            var temp = results[0].waitlist;
            for (i in temp){
                toReturn.push({name: temp[i].username});
            }
            res.json(toReturn);
        });
    } else res.send("logout");
});

// return the strangers list of the user.
app.get('/get/strangers/', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name = req.cookies.login.username;
        var toReturn = [];
        User.find({username: name})
        .populate("strangers")
        .exec(function(error, results) {
            var temp = results[0].strangers;
            for (i in temp){
                toReturn.push({name: temp[i].username});
            }
            res.json(toReturn);
        });
    } else res.send("logout");
});

// send the request to be friend, add user into that his/her waitlist.
app.post('/add/friend/ask/:name', (req, res) => {
    let username = req.params.name;
    if (Object.keys(req.cookies).length > 0) {
        var name = req.cookies.login.username;
        User.find({username: name})
        .exec(function(error, results) {
            let id = results[0]._id;
            User.find({username: username})
            .exec(function(error, results) {
                if (results[0].waitlist.indexOf(id) == -1) {
                    if (results[0].strangers.indexOf(id) != -1)results[0].strangers.splice(results[0].strangers.indexOf(id), 1);
                    results[0].waitlist.push(id);
                    results[0].save(function (err) { if (err) console.log('an error occurred'); });
                }
            });
        });
        res.send();
    } else res.send("logout");
});

// accept the request and add both into the friend list of each other.
app.post('/add/friend/accept/:name', (req, res) => {
    let username = req.params.name;
    if (Object.keys(req.cookies).length > 0) {
        var name = req.cookies.login.username;
        User.find({username: name})
        .exec(function(error, results1) {
            var id = results1[0]._id;
            User.find({username: username})
            .exec(function(error, results2) {
                if (results2[0].waitlist.indexOf(id) != -1) results2[0].waitlist.splice(results2[0].waitlist.indexOf(id), 1);
                if (results2[0].strangers.indexOf(id) != -1)results2[0].strangers.splice(results2[0].strangers.indexOf(id), 1);
                results2[0].friends.push(id);
                results2[0].save(function (err) { if (err) console.log('an error occurred'); });
                id= results2[0]._id;
                results1[0].waitlist.splice(results1[0].waitlist.indexOf(id), 1);
                results1[0].friends.push(id);
                results1[0].save(function (err) { if (err) console.log('an error occurred'); });
            });
        });
        res.send();
    } else res.send("logout");
});

//----------------------------------------------------------------------------------------//


//---------------------------------------Chat---------------------------------------------//

// post the message by user with that he/she, use both id.
app.post('/post/message/', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name = req.cookies.login.username;
        let messageObject = JSON.parse(req.body.message);
        var message = new Chat(messageObject);
        message.user_a = name;
        message.save(function (err) { if (err) console.log('an error occurred'); });
        res.send();
    } else res.send("logout");
});

// show the message between user and that he/she.
app.get('/get/message/:name', (req, res) => {
    let username = req.params.name;
    if (Object.keys(req.cookies).length > 0) {
        var toReturn=[];
        var name = req.cookies.login.username;
        Chat.find({ $or:[ {'user_a':name, 'user_b':username}, {'user_b':name, 'user_a': username} ]})
        .sort({time : 1})
        .exec(function(error, results) {
            for (i in results) {
                if (results[i].user_a == name) toReturn.push({people: "me", message: results[i].message});
                else toReturn.push({people: "you", message: results[i].message});
            }
            res.json(toReturn);
        });
    } else res.send("logout");
});

// use for "setinterval" without any message, ignore.
app.get('/get/message/', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        res.end();
    } else res.send("logout");
});

//----------------------------------------------------------------------------------------//

//--------------------Moment--------------------------//

// add moment by user and save.
app.post('/add/moment/', (req, res) => {
    let momentObject = JSON.parse(req.body.moment);
    var moment = new Moment(momentObject);
    if (Object.keys(req.cookies).length > 0) {
        if (moment.text.length > 0) {
            var name = req.cookies.login.username;
            User.find({username: name})
            .exec(function(error, results) {
                results[0].moment.push(moment._id);
                results[0].save(function (err) { if (err) console.log('an error occurred'); });
                moment.user = results[0]._id;
                moment.save(function (err) { if (err) console.log('an error occurred'); });
                res.send();
            });
        }
    } else res.send("logout");
});

// return the moments of user.
app.get('/get/moment/', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name = req.cookies.login.username;
        User.find({username: name})
        .populate("moment")
        .exec(function(error, results) {
            res.json(results[0].moment);
        });
    } else res.send("logout");
});

// return the moments of some person with given name.
app.get('/get/moment/:name', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var name = req.params.name;
        User.find({username: name})
        .populate("moment")
        .exec(function(error, results) {
            res.json(results[0].moment);
        });
    } else res.send("logout");
});

// get all of the moments order by the time.
app.get('/get/allMoment/', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        var toReturn = [];
        Moment.find({})
        .sort({time: -1})
        .populate("user")
        .exec(function(error, results) {
            for (i in results){
                toReturn.push(results[i]);
            }
            res.json(toReturn);
        });  
    } else res.send("logout");
});

// update the like of moment and person in the db.
app.post('/add/like/:id', (req, res) => {
    let momentID = req.params.id;
    if (Object.keys(req.cookies).length > 0) {
        var name = req.cookies.login.username;
        User.find({username: name})
        .exec(function(error, results) {
            if (results[0].liked.indexOf(momentID) != -1) res.send();
            else {
                results[0].liked.push(momentID);
                results[0].save(function (err) { if (err) console.log('an error occurred'); });
                Moment.find({_id: momentID})
                .exec(function(error, results) {
                    results[0].like= results[0].like+1;
                    results[0].save(function (err) { if (err) console.log('an error occurred'); });
                    User.find({_id: results[0].user})
                    .exec(function(error, results) {
                        results[0].like= results[0].like+1;
                        results[0].save(function (err) { if (err) console.log('an error occurred'); });
                    });
                });
            res.send();
            }
        });
    } else res.send("logout");
});

// update the like of moment and person in the db.
app.post('/lose/like/:id', (req, res) => {
    let momentID = req.params.id;
    if (Object.keys(req.cookies).length > 0) {
        var name = req.cookies.login.username;
        User.find({username: name})
        .exec(function(error, results) {
            if (results[0].liked.indexOf(momentID) == -1) res.send();
            else {
                results[0].liked.splice(results[0].liked.indexOf(momentID), 1);
                results[0].save(function (err) { if (err) console.log('an error occurred'); });
                Moment.find({_id: momentID})
                .exec(function(error, results) {
                    results[0].like= results[0].like-1;
                    results[0].save(function (err) { if (err) console.log('an error occurred'); });
                    User.find({_id: results[0].user})
                    .exec(function(error, results) {
                        results[0].like= results[0].like-1;
                        results[0].save(function (err) { if (err) console.log('an error occurred'); });
                    });
                });
            res.send();
            }
        });
    } else res.send("logout");
});

//---------------------------------------------------------------------------//

//------------------------------image---------------------------------------//

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public_html/images/')
    },
    filename: function (req, file, cb) {
        cb(null,  file.originalname );
    }
  });
var upload = multer({ storage: storage });

// upload the image.
app.post('/upload', upload.single('photo'), (req, res, next) => {
    if(req.file) {}
    else throw 'error';
});

//-----------------------------------------------------------------------//

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

