var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function randomRange (min, max) {
    return (Math.floor( min+((max-min+1)*Math.random()) ) );
};

var roles = {
    data : ['Application Developer', 'Chief Technology Officer', 
        'Customer Support Specialist', 'Database Administrator', 
        'Front End Developer', 'Help Desk Specialist',
        'Security Specialist', 'Software Architect', 
        'Software Quality Assurance Analyst', 'Support Specialist', 
        'Systems Administrator', 'Systems Analyst', 'Systems Designer',
        'Web Administrator', 'Web Developer' ],
    getRandom : function () {
        return this.data [ randomRange(0,this.data.length-1) ];
    }
};

var isUsersChanged = false;
var myUsers = new Object();

setInterval(function(){ 
    if (isUsersChanged) {
        var fname = __dirname + "/users.json"; 
        fs.writeFileSync(fname, JSON.stringify(myUsers));
        console.log("[disc] writtnen Users to file");
        isUsersChanged = false;
    }
}, 300);

app.get('/user/:id', function (req, res) {
    var id = req.params.id;
    // if myUsers['user'+id] != undefined
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
    var data =  myUsers['user'+id];
    res.end( JSON.stringify(data) );
    console.log( "[Get] /user/"+id+" - get users list" );
});

app.get('/users', function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
    res.end( JSON.stringify(myUsers) );
    console.log( "[Get] /users - get users list" );
});

app.post('/user', function (req, res) {
    var id = Object.keys(myUsers).length +1;
    var key = 'user'+id;
    var name = req.body.name;
    u = req.body;
    if ( !('profession' in req) )
        u.profession = roles.getRandom(); 
    u.id = id;
    myUsers[key] = u;
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
    res.end( JSON.stringify(u) );
    isUsersChanged = true;
    console.log( "[POST] /user - add new user ["+key+"] "+name+
        " to the list" );
});

var fname = __dirname + "/users.json"; 
fs.readFile( fname, 'utf8', function (err, data) {
    myUsers = JSON.parse( data );
    var server = app.listen(3000, function () {
        console.log("[] NodeJS server started and listening at http://%s:%s", 
            server.address().address, server.address().port );
    })
});

