"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var stringService_1 = __importDefault(require("./../services/stringService"));
var homeController = /** @class */ (function () {
    function homeController() {
    }
    homeController.prototype.index = function (req, res) {
        return {
            sitename: stringService_1.default.sitename
        };
    };
    return homeController;
}());
module.exports = new homeController();
