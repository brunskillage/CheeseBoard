"use strict";
var server;
(function (server) {
    var stringService = /** @class */ (function () {
        function stringService() {
        }
        Object.defineProperty(stringService.prototype, "sitename", {
            get: function () {
                return "Node js full template site";
            },
            enumerable: true,
            configurable: true
        });
        return stringService;
    }());
    server.stringService = stringService;
})(server || (server = {}));
module.exports = new server.stringService();
