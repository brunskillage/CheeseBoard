"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = __importDefault(require("node-fetch"));
var bristolApiClient = /** @class */ (function () {
    function bristolApiClient() {
        // console.log("Getting agencies...")
        // this.getData('/static/agencies',{ importSource: 'TNDS'}).then(res=> 
        //     {
        //         this.agencies = res.data
        //         console.dir(this.agencies)
        //     })
        this.apiKey = "D7OVIzqEGEGX26FQ1I5mVw";
        this.agencies = [];
        this.importSources = [];
        // console.log("Getting import sources...")
        // this.getData('/static/importsources',{ }).then(res=> 
        //     {
        //         this.importSources = res.data
        //         console.dir(this.importSources)
        //     })
    }
    Object.defineProperty(bristolApiClient.prototype, "rootUrl", {
        get: function () {
            return 'https://bristol.api.urbanthings.io/api/2.0';
        },
        enumerable: true,
        configurable: true
    });
    bristolApiClient.prototype.objectToQueryString = function (obj) {
        obj.apiKey = this.apiKey;
        var q = [];
        for (var p in obj) {
            q.push(p + '=' + obj[p]);
        }
        return '?' + q.join('&');
    };
    bristolApiClient.prototype.getData = function (urlPath, data) {
        var url = this.rootUrl + urlPath + this.objectToQueryString(data);
        console.log("getData with url..." + url);
        //return fetch('https://bristol.api.urbanthings.io/api/2.0/static/transitstops?centerLat=51.492946&centerLng=-2.646601&radius=500&apiKey=D7OVIzqEGEGX26FQ1I5mVw',
        return node_fetch_1.default(url, {
            headers: { Accept: 'application/json' }
        }).then(function (result) {
            // console.dir(result.json())
            return result.json();
        });
    };
    bristolApiClient.prototype.getStaticTransitStops = function (data) {
        return this.getData('/static/transitstops', data);
    };
    bristolApiClient.prototype.getReport = function (data) {
        return this.getData('/rti/report', data);
    };
    bristolApiClient.prototype.getAgencies = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this.agencies),
                reject();
        });
    };
    bristolApiClient.prototype.getImportSources = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this.importSources),
                reject();
        });
    };
    return bristolApiClient;
}());
exports.BristolApiClient = new bristolApiClient();
var coordinates = /** @class */ (function () {
    function coordinates(lat, lng) {
        this.lat = lat;
        this.lng = lng;
    }
    return coordinates;
}());
