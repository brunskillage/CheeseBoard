"use strict";
var WB;
(function (WB) {
    var MiscController = /** @class */ (function () {
        function MiscController() {
        }
        MiscController.show404 = function () {
            alert("not found");
        };
        return MiscController;
    }());
    WB.MiscController = MiscController;
})(WB || (WB = {}));
