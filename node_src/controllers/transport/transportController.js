"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var bristolApiClient_1 = require("./bristolApiClient");
var moment_1 = __importDefault(require("moment"));
var transportController = /** @class */ (function () {
    function transportController() {
        //this.getAgencies().then(result => console.dir(this.agencies))
    }
    transportController.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    transportController.prototype.report = function (data) {
        var _this = this;
        console.dir(data);
        if (data.stopId.length) {
            var stopIds = data.stopId.split(",");
            console.dir("stopids are " + stopIds);
            var promises_1 = [];
            stopIds.forEach(function (element) {
                console.log("Element is " + element);
                var req = data;
                req.stopId = element;
                promises_1.push(bristolApiClient_1.BristolApiClient.getReport(data));
            });
            return Promise.all(promises_1).then(function (results) {
                console.dir(results);
                var merged = results[0];
                for (var i = 0; i < results.length; i++) {
                    var currentResult = results[i];
                    for (var i_1 = 0; i_1 < currentResult.data.rtiReports.length; i_1++) {
                        var rtiReport = currentResult.data.rtiReports[i_1];
                        for (var j = 0; j < rtiReport.upcomingCalls.length; j++) {
                            var upcomingCall = rtiReport.upcomingCalls[j];
                            _this.setNiceDate(upcomingCall);
                            console.dir(upcomingCall);
                        }
                    }
                    currentResult.data.primaryExpectedMinutes = currentResult.data.rtiReports[0].upcomingCalls[0].expectedMinutes;
                    currentResult.data.minuteText = _this.getMinutesText(currentResult.data.primaryExpectedMinutes);
                }
                return { results: results };
            });
        }
    };
    transportController.prototype.getMinutesText = function (minutes) {
        return minutes > 1 ? 'minutes' : 'minute';
    };
    transportController.prototype.stops = function (data) {
        var _this = this;
        return bristolApiClient_1.BristolApiClient.getStaticTransitStops(data).then(function (result) {
            for (var j = 0; j < result.data.length; j++) {
                var transitStop = result.data[j];
                transitStop.cardinalBearing = _this.getCardinalBearing(transitStop.bearing);
                console.dir(transitStop);
            }
            return result;
        });
    };
    transportController.prototype.setNiceDate = function (upcomingCall) {
        if (upcomingCall.expectedArrivalTime) {
            var a = moment_1.default(upcomingCall.expectedArrivalTime);
            var b = moment_1.default(upcomingCall.scheduledCall.scheduledArrivalTime);
            var difference = a.diff(b, 'minutes');
            var expectedMinutes = a.diff(moment_1.default(), 'minutes');
            upcomingCall.expectedArrivalTimeNice = expectedMinutes + ' ' + this.getMinutesText(expectedMinutes);
            if (difference > 0) {
                upcomingCall.difference = difference;
                upcomingCall.expectedMinutes = a.diff(moment_1.default(), 'minutes');
            }
        }
        upcomingCall.scheduledCall.scheduledArrivalTimeNice = moment_1.default(upcomingCall.scheduledCall.scheduledArrivalTime).format("HH:mm");
    };
    transportController.prototype.getCardinalBearing = function (deg) {
        if (deg > 11.25 && deg < 33.75) {
            return "NNE";
        }
        else if (deg > 33.75 && deg < 56.25) {
            return "ENE";
        }
        else if (deg > 56.25 && deg < 78.75) {
            return "E";
        }
        else if (deg > 78.75 && deg < 101.25) {
            return "ESE";
        }
        else if (deg > 101.25 && deg < 123.75) {
            return "ESE";
        }
        else if (deg > 123.75 && deg < 146.25) {
            return "SE";
        }
        else if (deg > 146.25 && deg < 168.75) {
            return "SSE";
        }
        else if (deg > 168.75 && deg < 191.25) {
            return "S";
        }
        else if (deg > 191.25 && deg < 213.75) {
            return "SSW";
        }
        else if (deg > 213.75 && deg < 236.25) {
            return "SW";
        }
        else if (deg > 236.25 && deg < 258.75) {
            return "WSW";
        }
        else if (deg > 258.75 && deg < 281.25) {
            return "W";
        }
        else if (deg > 281.25 && deg < 303.75) {
            return "WNW";
        }
        else if (deg > 303.75 && deg < 326.25) {
            return "NW";
        }
        else if (deg > 326.25 && deg < 348.75) {
            return "NNW";
        }
        else {
            return "N";
        }
    };
    return transportController;
}());
exports.transportController = transportController;
exports.TransportController = new transportController();
