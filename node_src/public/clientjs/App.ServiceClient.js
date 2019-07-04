"use strict";
/// <reference path="App.GlobalCommon.ts" />
var App;
(function (App) {
    var Payload = /** @class */ (function () {
        function Payload(methodName, data) {
            this.methodName = methodName;
            this.data = data;
        }
        return Payload;
    }());
    App.Payload = Payload;
    var ServerClientBase = /** @class */ (function () {
        function ServerClientBase(endpoint) {
            this._endpoint = "";
            if (!endpoint) {
                throw Error("No endpoint");
            }
            this._endpoint = endpoint;
        }
        ServerClientBase.prototype.translate = function (input) {
            var res = "";
            for (var i = 0; i < input.length; i++) {
                res += String.fromCharCode(1083756 ^ input.charCodeAt(i));
            }
            return res;
        };
        ServerClientBase.prototype.sendPayload = function (payload, next) {
            var _this = this;
            if (!payload) {
                throw Error("No payload");
            }
            return $.ajax({
                type: "POST",
                url: this._endpoint,
                headers: {
                    "UserId": App.GlobalCommon.readCookie("UserId"),
                    "Auth": App.GlobalCommon.readCookie("Auth")
                },
                dataType: "JSON",
                cache: false,
                contentType: "application/json; charset=utf-8",
                //data: this.translate(JSON.stringify(payload)),
                data: JSON.stringify(payload),
                success: function (data, b, c) {
                    if (data && data.code && data.code === 401) {
                        window.location.href = "/login";
                        return;
                    }
                    next(data);
                },
                error: function () { },
                statusCode: {
                    // 401: () => window.location.href = '/login',
                    404: function (resp) { return _this.SetError(resp); },
                    403: function () { return window.location.href = "/login"; },
                    500: function (resp) { return _this.SetError(resp); }
                }
            });
        };
        ServerClientBase.prototype.SetError = function (resp) {
            $(".navbar-fixed-bottom").empty();
            $("#user_bar").empty();
            App.ViewEngine.setAppHtml(resp.responseText);
        };
        ServerClientBase.prototype.CallMethod = function (methodName, data, simple) {
            var payload = new Payload(methodName, data);
            data.user_id = 1;
            return this.sendPayload(payload, function (data) {
                //amplify.publish(methodName + "_reply", data);
            });
        };
        return ServerClientBase;
    }());
    App.ServerClientBase = ServerClientBase;
})(App || (App = {}));
