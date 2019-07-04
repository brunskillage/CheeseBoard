"use strict";
/// <reference path="../libs/all.d.ts" />
var WB;
(function (WB) {
    var Error = /** @class */ (function () {
        function Error(title, message, exception) {
            this.title = title;
            this.message = message;
            this.exception = exception;
        }
        return Error;
    }());
    WB.Error = Error;
    var ErrorController = /** @class */ (function () {
        function ErrorController() {
        }
        ErrorController.Show = function (error) {
            ErrorView.render(error);
        };
        return ErrorController;
    }());
    WB.ErrorController = ErrorController;
    var ErrorView = /** @class */ (function () {
        function ErrorView() {
        }
        ErrorView.render = function (error) {
            var munge = this.getErrorView(error.title, error.message);
            $("#errors").html(munge);
        };
        ErrorView.getErrorView = function (title, message) {
            var tmp = this.getTemplate();
            return tmp
                .replace("{0}", title)
                .replace("{1}", message);
        };
        ErrorView.getTemplate = function () {
            return "<div class=row><div class='span4 alert alert-error'><strong>{0}</strong> {1}</div></div>";
        };
        return ErrorView;
    }());
    WB.ErrorView = ErrorView;
})(WB || (WB = {}));
