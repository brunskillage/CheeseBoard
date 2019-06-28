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
/// <reference path="app.viewengine.ts" />
/// <reference path="app.serviceclient.ts" />
var Account;
(function (Account) {
    var ServerClientBase = App.ServerClientBase;
    var AccountClient = /** @class */ (function (_super) {
        __extends(AccountClient, _super);
        function AccountClient() {
            return _super.call(this, "/account/account_server.ashx") || this;
        }
        return AccountClient;
    }(ServerClientBase));
    Account.AccountClient = AccountClient;
    var Common = /** @class */ (function () {
        function Common() {
        }
        Common.getStoredAccountDetails = function () {
            return {
                display_name: App.GlobalCommon.readCookie("UserName"),
                IsLoggedIn: App.GlobalCommon.readCookie("IsLoggedIn"),
                Auth: App.GlobalCommon.readCookie("Auth"),
                UserId: App.GlobalCommon.readCookie("UserId"),
            };
        };
        Common.SignIn = function (from) {
            window.location.href = this.SignInUrl;
            amplify.store("LastUrl", from);
            LoginView.init();
        };
        Common.SignInUrl = "/login";
        Common.SignOutUrl = "/logout";
        return Common;
    }());
    Account.Common = Common;
    var LoginBarView = /** @class */ (function () {
        function LoginBarView() {
        }
        LoginBarView.getHtml = function () {
            return this.render();
        };
        LoginBarView.render = function () {
            var tmpl = "";
            var account = Common.getStoredAccountDetails();
            if (account && account.display_name && account.display_name.length > 0) {
                tmpl = this.getLoggedinTemplate();
            }
            else {
                tmpl = this.getLoggedoutTemplate();
            }
            var html = App.ViewEngine.getHtml(tmpl, account);
            amplify.publish("getLoginView", html);
            return html;
        };
        LoginBarView.getLoggedinTemplate = function () {
            var frag = "<span id='logged_in_part' class='logged_in_part'>"
                + "Hello, <span id='display_name'><b>{{display_name}}</b></span>"
                + "&nbsp;&nbsp;&nbsp;&nbsp;<span id='sign_out'><a href='/logout'>Log Out</a></span>"
                + "</span>";
            return frag;
        };
        LoginBarView.getLoggedoutTemplate = function () {
            var frag = "<span id='not_logged_in_part'>"
                + "<div id='sign_in'><a href='/login'>Log in</a></div>"
                + "</span>";
            return frag;
        };
        return LoginBarView;
    }());
    Account.LoginBarView = LoginBarView;
    var LoginView = /** @class */ (function () {
        function LoginView() {
        }
        LoginView.init = function () {
            var _this = this;
            var tmpl = $.get("Login.html");
            $.when(tmpl).then(function (data) { return _this.render(data); });
        };
        LoginView.signout = function () {
            this.setStoredAccountDetails(null);
            amplify.store("LastUrl", null);
            amplify.store("IsLoggedIn", null);
            amplify.store("last_board_hash", null);
            amplify.publish("UserLoggedOut");
            window.location.href = "/account";
        };
        LoginView.setStoredAccountDetails = function (account) {
            // ms to expiry
            amplify.store("account", null);
            if (account) {
                var options = { expires: 1000 * 60 * 60 * 24 * 14 };
                return amplify.store("account", account, options);
            }
        };
        LoginView.login = function (form) {
            var _this = this;
            var client = new AccountClient();
            var inputs = App.GlobalCommon.getFormInputs(form);
            var act = client.CallMethod("UserSignInTry", inputs);
            $.when(act)
                .then(function (resp) {
                if (resp.validationResult.IsValid === false) {
                    App.GlobalCommon.apply_validation(resp.validationResult, form);
                }
                else {
                    _this.setStoredAccountDetails(resp.account);
                    amplify.store("IsLoggedIn", "1");
                    var last_url = amplify.store("LastUrl");
                    if (last_url) {
                        window.location.href = last_url;
                    }
                    else {
                        $("#not_logged_in").remove();
                        $("#logged_in").show();
                    }
                }
            });
        };
        LoginView.handleSubmit = function (e) {
            e.preventDefault();
            this.login($("#login-form"));
        };
        LoginView.render = function (data) {
            var _this = this;
            $("#app").html($(data).html());
            $("#logged_in").hide();
            var account = Common.getStoredAccountDetails();
            if (account) {
                $("#not_logged_in").hide();
                var part = $.get("LoginPart.html");
                $.when(part).then(function (tmpl) { return _this.handleLoggedIn(tmpl, account); });
            }
            $("#login-form").submit(function (e) { return _this.handleSubmit(e); }); // $("#submit-btn").off("click").on("click", (e) => this.handleSubmit(e))
        };
        LoginView.handleLoggedIn = function (tmpl, data) {
            var loggedinpart = App.ViewEngine.getHtml(tmpl, data);
            $("#logged_in").show();
            $("#logged_in_part").html(loggedinpart);
            $("#not_logged_in_part").hide();
        };
        return LoginView;
    }());
    Account.LoginView = LoginView;
    var CreateAccountView = /** @class */ (function () {
        function CreateAccountView() {
        }
        CreateAccountView.init = function () {
            var _this = this;
            var tmpl = $.get("CreateAccount.html");
            $.when(tmpl).then(function (resp) { return _this.render(resp); });
        };
        CreateAccountView.render = function (resp) {
            var _this = this;
            App.ViewEngine.renderview(resp, null);
            $("#submit-btn").off("click").on("click", function (e) { return _this.handleSubmit(e); });
        };
        CreateAccountView.handleSubmit = function (e) {
            e.preventDefault();
            var form = $("#create-account-form");
            var inputs = App.GlobalCommon.getFormInputs(form);
            var client = new AccountClient();
            $.when(client.CallMethod("UserAdd", inputs))
                .then(function (resp) {
                if (resp.validationResult.IsValid === false) {
                    App.GlobalCommon.apply_validation(resp.validationResult, form);
                }
                else {
                    // Login after creation
                    LoginView.login($("#create-account-form"));
                }
            });
        };
        return CreateAccountView;
    }());
    Account.CreateAccountView = CreateAccountView;
})(Account || (Account = {}));
