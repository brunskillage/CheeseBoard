"use strict";
/// <reference path="../libs/all.d.ts" />
var App;
(function (App) {
    var ViewEngine = /** @class */ (function () {
        function ViewEngine() {
        }
        ViewEngine.renderview = function (viewname, data, partials) {
            var html = Mustache.render(viewname, data, partials);
            this.setAppHtml(html);
            return html;
        };
        ViewEngine.getHtml = function (viewname, data, partials) {
            return Mustache.render(viewname, data, partials);
        };
        ViewEngine.setAppHtml = function (html) {
            //getAppEl().hide().html(html).fadeIn();
            amplify.store("last_page", window.location.toString());
            this.getAppEl().html(html);
        };
        ViewEngine.getAppEl = function () {
            return $("#app");
        };
        ViewEngine.setElHtml = function (selector, html) {
            var el = $(selector);
            el.html(html);
            return el;
        };
        ViewEngine.ClearScreen = function () {
            this.getAppEl().html("");
        };
        ViewEngine.ReloadPage = function () {
            //window.location.reload();
        };
        ViewEngine.parseTemplateHtml = function (html) {
            var h = $(html);
            var alldivs = h.filter("div");
            $.each(alldivs, function (idx, div) {
                var d = $(div);
                ViewEngine.tmpl[d.attr("data-tmpl")] = d.html().trim().replace(/\s+/g, " ");
            });
        };
        ViewEngine.tmpl = {};
        return ViewEngine;
    }());
    App.ViewEngine = ViewEngine;
})(App || (App = {}));
