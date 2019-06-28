"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express")); // old require
var path_1 = __importDefault(require("path"));
var body_parser_1 = __importDefault(require("body-parser"));
var sequelize_1 = __importDefault(require("sequelize"));
var app = express_1.default();
// time is important
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
var port = 3000;
exports.sequelize = new sequelize_1.default('database', 'username', 'password', {
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
    storage: path_1.default.join(__dirname, '/db/work.sqlite')
});
// do the creation of db etc
var dbService_1 = __importDefault(require("./db/dbService"));
dbService_1.default.check();
// dbService.migrate()
// serve static files
var options = {
    dotfiles: 'ignore',
    extensions: ['htm', 'html', 'css'],
    index: false
};
app.use(express_1.default.static(path_1.default.join(__dirname, '/public'), options));
app.use(express_1.default.static(path_1.default.join(__dirname, '/views'), options));
// munge handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// ---  
// home
var homeController_1 = __importDefault(require("./controllers/homeController"));
app.get('/', function (req, res, next) {
    var model = homeController_1.default.index(req, res);
    res.render('home');
});
// end public
// api
app.get('/api/v1/:vnum', function (req, res) {
    res.json({
        time: new Date(),
        pars: req.params
    });
});
var apiController_1 = __importDefault(require("./controllers/apiController"));
app.post('/api/v1/call', function (req, resp) {
    apiController_1.default.process(req, resp);
});
// counters api
var counterController_1 = require("./controllers/counterController");
app.get('/api/counter/action/add/:prefix/:startNum', function (req, resp) {
    resp.json({
        result: counterController_1.CounterController.add(req)
    });
});
app.get('/api/counters/:prefix/tick', function (req, resp) {
    resp.json({
        result: counterController_1.CounterController.tick(req)
    });
});
app.get('/api/counters/:prefix/back', function (req, resp) {
    resp.json({
        result: counterController_1.CounterController.back(req)
    });
});
app.get('/api/counters/:prefix/set/:number', function (req, resp) {
    resp.json({
        result: counterController_1.CounterController.set(req)
    });
});
app.get('/counters', function (req, resp) {
    var data = counterController_1.CounterController.index(req);
    data.layout = 'counters';
    console.dir(data);
    resp.render('counterIndex', data);
});
// end counters
// transport 
var transportController_1 = require("./controllers/transport/transportController");
app.get('/transport/stops', function (req, resp) {
    var q = {
        centerLat: 51.492946,
        centerLng: -2.646601,
        radius: 500
    };
    transportController_1.TransportController.stops(q).then(function (result) {
        result.layout = 'transport';
        resp.render('transportStops', result);
        // resp.json(result)
    });
});
app.get('/transport/report', function (req, resp) {
    var queryStringObject = req.query;
    transportController_1.TransportController.report(queryStringObject).then(function (result) {
        result.layout = 'transport';
        resp.render('transportReport', result);
        //resp.json(result)
    });
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
app.listen(port, function () { return console.log('Example app listening on port ' + port); });
