/// <reference path="app.viewengine.ts" />
/// <reference path="app.serviceclient.ts" />
module Account {
    import ServerClientBase = App.ServerClientBase;

    export class AccountClient extends ServerClientBase {
        constructor() {
            super("/account/account_server.ashx");
        }
    }

    export class Common {
        static getStoredAccountDetails() {
            return {
                display_name: App.GlobalCommon.readCookie("UserName"),
                IsLoggedIn: App.GlobalCommon.readCookie("IsLoggedIn"),
                Auth: App.GlobalCommon.readCookie("Auth"),
                UserId: App.GlobalCommon.readCookie("UserId"),
            };
        }

        static SignInUrl = "/login";
        static SignOutUrl = "/logout";

        static SignIn(from: string) {
            window.location.href = this.SignInUrl;
            amplify.store("LastUrl", from);
            LoginView.init();
        }
    }

    export class LoginBarView {
        static getHtml() {
            return this.render();
        }

        static render() {
            var tmpl = "";
            var account = Common.getStoredAccountDetails();
            if (account && account.display_name && account.display_name.length > 0) {
                tmpl = this.getLoggedinTemplate();
            } else {
                tmpl = this.getLoggedoutTemplate();
            }
            var html = App.ViewEngine.getHtml(tmpl, account);
            amplify.publish("getLoginView", html);
            return html;
        }

        static getLoggedinTemplate() {
            var frag = "<span id='logged_in_part' class='logged_in_part'>"
                + "Hello, <span id='display_name'><b>{{display_name}}</b></span>"
                + "&nbsp;&nbsp;&nbsp;&nbsp;<span id='sign_out'><a href='/logout'>Log Out</a></span>"
                + "</span>";
            return frag;
        }

        static getLoggedoutTemplate() {
            var frag = "<span id='not_logged_in_part'>"
                + "<div id='sign_in'><a href='/login'>Log in</a></div>"
                + "</span>";
            return frag;
        }
    }

    export class LoginView {
        static init() {
            var tmpl = $.get("Login.html");
            $.when(tmpl).then((data : any) => this.render(data));
        }

        static signout() {
            this.setStoredAccountDetails(null);
            amplify.store("LastUrl", null);
            amplify.store("IsLoggedIn", null);
            amplify.store("last_board_hash", null);
            amplify.publish("UserLoggedOut");
            window.location.href = "/account";
        }

        static setStoredAccountDetails(account : any) {
            // ms to expiry
            amplify.store("account", null);
            if (account) {
                var options = { expires: 1000 * 60 * 60 * 24 * 14 };
                return amplify.store("account", account, options);
            }
        }

        static login(form: JQuery) {
            var client = new AccountClient();
            var inputs = App.GlobalCommon.getFormInputs(form);
            var act = client.CallMethod("UserSignInTry", inputs);
            $.when(act)
                .then((resp:any) => {
                    if (resp.validationResult.IsValid === false) {
                        App.GlobalCommon.apply_validation(resp.validationResult, form);
                    } else {
                        this.setStoredAccountDetails(resp.account);
                        amplify.store("IsLoggedIn", "1");
                        var last_url = amplify.store("LastUrl");
                        if (last_url) {
                            window.location.href = last_url;
                        } else {
                            $("#not_logged_in").remove();
                            $("#logged_in").show();
                        }
                    }
                });
        }

        static handleSubmit(e:any) {
            e.preventDefault();
            this.login($("#login-form"));
        }

        static render(data:any) {
            $("#app").html($(data).html());
            $("#logged_in").hide();
            var account = Common.getStoredAccountDetails();
            if (account) {
                $("#not_logged_in").hide();
                var part = $.get("LoginPart.html");
                $.when(part).then((tmpl: any) => this.handleLoggedIn(tmpl, account));
            }

            $("#login-form").submit((e: any) => this.handleSubmit(e)); // $("#submit-btn").off("click").on("click", (e) => this.handleSubmit(e))
        }

        static handleLoggedIn(tmpl: any, data: any) {
            var loggedinpart = App.ViewEngine.getHtml(tmpl, data);
            $("#logged_in").show();
            $("#logged_in_part").html(loggedinpart);
            $("#not_logged_in_part").hide();
        }
    }

    export class CreateAccountView {
        static init() {
            var tmpl = $.get("CreateAccount.html");
            $.when(tmpl).then((resp: any) => this.render(resp));
        }

        static render(resp: any) {
            App.ViewEngine.renderview(resp, null);
            $("#submit-btn").off("click").on("click", (e:any) => this.handleSubmit(e));
        }

        static handleSubmit(e: any) {
            e.preventDefault();
            var form = $("#create-account-form");
            var inputs = App.GlobalCommon.getFormInputs(form);
            var client = new AccountClient();

            $.when(
                    client.CallMethod("UserAdd", inputs))
                .then((resp: any) => {
                    if (resp.validationResult.IsValid === false) {
                        App.GlobalCommon.apply_validation(resp.validationResult, form);
                    } else {
                        // Login after creation
                        LoginView.login($("#create-account-form"));
                    }
                });
        }
    }
}