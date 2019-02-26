var express = require('express')
var app = express()
var expressMongoDb = require('express-mongo-db');
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var expressValidator = require('express-validator')
var flash = require('express-flash')
// var cookieParser = require('cookie-parser');
var session = require('express-session')
var config = require('./config')
var users = require('./routes/users')

app.use(expressMongoDb(config.database.url));
app.set('view engine','ejs')
app.use(expressValidator())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(methodOverride(function(req,res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body){
        var method = req.body._method
        delete req.body._method
        return method
    }
}))
// app.use(cookieParser('keyboard cat))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}))

app.use(flash()) //untuk menampilkan pesan error/success
app.use('/',users)
app.use('/users',users)
app.listen(3000, function(){
    console.log('Server running at port 3000: http://127.0.0.1:3000')
})