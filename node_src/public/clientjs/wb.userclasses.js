"use strict";
/// <reference path="wb.storage.ts" />
/// <reference path="../libs/all.d.ts" />
var WB;
(function (WB) {
    /*
    =========================================================================================
    */
    var UserController = /** @class */ (function () {
        function UserController() {
        }
        UserController.USER_GET = function (id) {
            if (+id === +amplify.store(WB.EventNames.LOCAL_USERID)) {
                WB.WebStorage.USER_GET({ id: id });
            }
        };
        UserController.USER_GET_REPLY = function (data) {
            UserUpdateView.render(data);
        };
        UserController.USER_UPDATE = function (data) {
        };
        UserController.USER_UPDATE_REPLY = function (data) {
            if (data.IsValid !== "undefined" && data.IsValid === false) {
                App.GlobalCommon.apply_validation(data, $("#form1"));
            }
            else {
                window["routie"]("boards");
            }
        };
        UserController.USER_LOGIN_REQUIRED = function (data) {
            this.SIGN_IN(data);
        };
        UserController.SIGN_IN = function (data) {
            Account.Common.SignIn(window.location.href);
        };
        UserController.USER_ADD_SHARED_BOARD = function (data) {
            WB.AddSharedBoardView.render();
        };
        return UserController;
    }());
    WB.UserController = UserController;
    var UserUpdateView = /** @class */ (function () {
        function UserUpdateView() {
        }
        UserUpdateView.render = function (data) {
            var form = App.ViewEngine.getHtml(this.getTemplate(), data);
            var upload = UserUploadPhotoView.getHtml({});
            App.ViewEngine.setAppHtml(form + upload);
            $("#btnsubmit").on("click", function (e) {
                e.preventDefault();
                var form = App.GlobalCommon.getFormInputs($("#form1"));
                WB.WebStorage.USER_UPDATE_ASYNC(form);
            });
        };
        UserUpdateView.getTemplate = function () {
            var displayname = App.GlobalCommon.inputstring("display_name", "display_name", "{{display_name}}", "Your display name", "text");
            var password = App.GlobalCommon.inputstring("password", "password", "{{password}}", "Your password", "password"); //  var id = App.GlobalCommon.inputstring('id', 'id', "{{id}}", '', 'hidden')
            return App.GlobalCommon.form("Update profile details", displayname + password);
        };
        return UserUpdateView;
    }());
    WB.UserUpdateView = UserUpdateView;
    var UserChangePasswordView = /** @class */ (function () {
        function UserChangePasswordView() {
        }
        UserChangePasswordView.render = function (data) {
            App.ViewEngine.renderview(this.getTemplate(), {});
        };
        UserChangePasswordView.getTemplate = function () {
            var password = App.GlobalCommon.inputstring("password", "password", "", "Your password", "password");
            return App.GlobalCommon.form("Change Password", password);
        };
        return UserChangePasswordView;
    }());
    WB.UserChangePasswordView = UserChangePasswordView;
    var UserAddView = /** @class */ (function () {
        function UserAddView() {
        }
        UserAddView.render = function (data) {
            App.ViewEngine.renderview(this.getTemplate(), {});
        };
        UserAddView.getTemplate = function () {
            var email = App.GlobalCommon.inputstring("email", "email", "{{&email}}", "Your email", "text");
            var displayname = App.GlobalCommon.inputstring("display_name", "display_name", "", "The display name", "text");
            var password = App.GlobalCommon.inputstring("password", "password", "", "Your password", "password");
            var count = App.GlobalCommon.inputstring("count", "count", "{{count}}", "", "hidden");
            return App.GlobalCommon.form("Register", email + displayname + password + count);
        };
        return UserAddView;
    }());
    WB.UserAddView = UserAddView;
    var UserSummariesView = /** @class */ (function () {
        function UserSummariesView() {
        }
        UserSummariesView.render = function (users) {
            App.ViewEngine.renderview(this.getTemplate(), users);
        };
        UserSummariesView.getHtml = function (users) {
            return App.ViewEngine.getHtml(this.getTemplate(), users);
        };
        UserSummariesView.getTemplate = function () {
            return "<div class='users clearfix'><strong>Users</strong><br>{{#Users}}<div class=user><img src='userfiles/{{id}}.jpg'/> {{display_name}}</div>{{/Users}} </div>";
        };
        return UserSummariesView;
    }());
    WB.UserSummariesView = UserSummariesView;
    var UserUploadPhotoView = /** @class */ (function () {
        function UserUploadPhotoView() {
        }
        UserUploadPhotoView.render = function (data) {
            data.id = amplify.store(WB.EventNames.LOCAL_USERID);
            App.ViewEngine.renderview(this.getTemplate(), data);
            $("#btnuploadsubmit").on("click", function (e) {
                e.preventDefault();
                // startUpload();
            });
        };
        UserUploadPhotoView.getHtml = function (data) {
            data.id = amplify.store(WB.EventNames.LOCAL_USERID);
            return App.ViewEngine.getHtml(this.getTemplate(), data);
        };
        UserUploadPhotoView.getTemplate = function () {
            return "<div class='well span4'><strong>Profile Image</strong><br><br><p style='display: none;' id='f1_upload_process'>Loading...<br/><img src='img/ajax-loader.gif' target='upload_target' /></p><form action='upload.ashx' method='post' enctype='multipart/form-data' target='upload_target'>Select Photo <input name='clientfile' type='file' /><br><br><input type='submit' name='btnuploadsubmit' id='btnuploadsubmit' value='Upload' />" + App.GlobalCommon.inputstring("id", "id", "{{id}}", "", "hidden") + "</form></div><div class='well span3'><strong>Image Upload Status</strong><br><iframe id='upload_target' name='upload_target' src='upload.ashx'  style='width:200px;height:50px;border:0px solid #fff;' ></iframe></div>";
        };
        return UserUploadPhotoView;
    }());
    WB.UserUploadPhotoView = UserUploadPhotoView;
    var DefaultView = /** @class */ (function () {
        function DefaultView() {
        }
        DefaultView.render = function (data) {
            App.ViewEngine.renderview(this.getTemplate(), data);
        };
        DefaultView.getHtml = function (data) {
            return App.ViewEngine.getHtml(this.getTemplate(), data);
        };
        DefaultView.getTemplate = function () {
            var tmp = "default view";
            return tmp;
        };
        return DefaultView;
    }());
    WB.DefaultView = DefaultView;
    var UserSummaryItemView = /** @class */ (function () {
        function UserSummaryItemView() {
        }
        UserSummaryItemView.render = function (data) {
            App.ViewEngine.renderview(this.getTemplate(), data);
        };
        UserSummaryItemView.getHtml = function (data) {
            return App.ViewEngine.getHtml(this.getTemplate(), data);
        };
        UserSummaryItemView.getTemplate = function () {
            var tmp = "<div class='user'>UserSummaryView</div>";
            return tmp;
        };
        return UserSummaryItemView;
    }());
    WB.UserSummaryItemView = UserSummaryItemView;
})(WB || (WB = {}));
