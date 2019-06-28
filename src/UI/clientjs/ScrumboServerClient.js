"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="app.serviceclient.ts" />
var WB;
(function (WB) {
    var ScrumboServerClient = /** @class */ (function (_super) {
        __extends(ScrumboServerClient, _super);
        function ScrumboServerClient() {
            return _super.call(this, "/api/v1/call") || this;
        }
        return ScrumboServerClient;
    }(App.ServerClientBase));
    WB.ScrumboServerClient = ScrumboServerClient;
})(WB || (WB = {}));
