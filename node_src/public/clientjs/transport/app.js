"use strict";
var Transport;
(function (Transport) {
    var App = /** @class */ (function () {
        function App() {
        }
        App.prototype.init = function () {
            console.log("Application Intialising...");
        };
        return App;
    }());
    Transport.app = new App();
    var StopsPage = /** @class */ (function () {
        function StopsPage() {
        }
        Object.defineProperty(StopsPage.prototype, "selectedButton", {
            get: function () {
                return $("#selectedButton");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StopsPage.prototype, "stopSelections", {
            get: function () {
                return $(".stopSelection");
            },
            enumerable: true,
            configurable: true
        });
        StopsPage.prototype.onSelectedClick = function (event) {
            console.log("Selected button is clicked...");
            var stops = [];
            $.each(this.stopSelections, function (index, item) {
                if ($(item).is(":checked")) {
                    console.log("Add selected stops to array..." + $(item).attr('data-primaryCode'));
                    stops.push('' + $(item).attr('data-primaryCode'));
                }
            });
            var qarray = [
                "/transport/report?",
                "stopId=" + stops.join(","),
                "multi=" + (stops.length > 1),
                "lookAheadMinutes=120"
            ];
            window.location.href = qarray.join("&");
        };
        return StopsPage;
    }());
    Transport.stopsPage = new StopsPage();
})(Transport || (Transport = {}));
