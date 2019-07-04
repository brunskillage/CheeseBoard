import express from 'express' // old require
import path from 'path'
import bodyParser from 'body-parser'
import Sequelize from 'sequelize'

const app = express()

// time is important

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))  
// parse application/json
app.use(bodyParser.json()) 

const port = 3000

export const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    //dialect: 'mysql'|'sqlite'|'postgres'|'mssql',
    dialect: 'sqlite',
    operatorsAliases: false,
    
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000  
    },
    
    // SQLite only  
    storage: path.join(__dirname, '/db/work.sqlite')
})


// do the creation of db etc
import  dbService from './db/dbService'
dbService.check()
// dbService.migrate()

// serve static files
const options = {  
    dotfiles: 'ignore',
    extensions: ['htm', 'html', 'css'],
    index: false
};

app.use(express.static(path.join(__dirname, '/public') , options ));
app.use(express.static(path.join(__dirname, '/views') , options ));

// munge handlebars

const exphbs = require('express-handlebars'); 
app.engine('handlebars', exphbs({defaultLayout: 'main'})); 
app.set('view engine', 'handlebars');

// ---  
// home
import homeController from './controllers/homeController'
app.get('/', (req, res, next) => {
    let model : any = homeController.index(req, res)
    res.render('home')     
})  

// end public

// api
app.get('/api/v1/:vnum', (req, res) => {
    res.json({
        time: new Date(),
        pars:req.params
    });
});

import apiController from './controllers/apiController'
app.post('/api/v1/call', (req, resp) => {  
    apiController.process(req, resp);
});

// counters api

import {CounterController} from './controllers/counterController'

app.get('/api/counter/action/add/:prefix/:startNum', (req, resp) => {
    resp.json({
        result: CounterController.add(req)
    });
});


app.get('/api/counters/:prefix/tick', (req, resp) => {
    resp.json({
        result: CounterController.tick(req)
    });
});  

app.get('/api/counters/:prefix/back', (req, resp) => {
    resp.json({
        result: CounterController.back(req)
    });
});  
  
app.get('/api/counters/:prefix/set/:number', (req, resp) => {
    resp.json({
        result: CounterController.set(req)
    });
});  

app.get('/counters', (req, resp) => {
    var data : any =  CounterController.index(req)
    data.layout = 'counters'
    console.dir(data)
    resp.render('counterIndex', data)   
});

// end counters

// transport 

import {TransportController} from './controllers/transport/transportController'

app.get('/transport/stops', (req, resp) => {
    let q = {
        centerLat:51.492946,
        centerLng:-2.646601,
        radius:500
    }

    TransportController.stops(q).then(result =>{
        result.layout = 'transport'
        resp.render('transportStops', result)  
        // resp.json(result)
    })
});


app.get('/transport/report', (req, resp) => {
    let queryStringObject = req.query

    TransportController.report(queryStringObject).then(result => {

        result.layout = 'transport'
        resp.render('transportReport', result)  
        //resp.json(result)
    })
});
 
    // WORKS!
    // fetch('https://bristol.api.urbanthings.io/api/2.0/static/transitstops?centerLat=51.492946&centerLng=-2.646601&radius=500&apiKey=D7OVIzqEGEGX26FQ1I5mVw',
    //         {
    //             headers:{ Accept: 'application/json' }
    //         }).then(result => {
    //             return result.json()
    //         }).then(result => {
    //             console.dir(result)
    //             resp.json(result)
    //         })


// end transport

// listen on server

app.listen(port, () => console.log('Example app listening on port ' + port))