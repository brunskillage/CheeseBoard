/// <reference path="wb.storage.ts" />
/// <reference path="../libs/all.d.ts" />
module WB {
/*
=========================================================================================
*/
    export class UserController {
        static USER_GET(id: string) {
            if (+id === +amplify.store(EventNames.LOCAL_USERID)) {
                WebStorage.USER_GET({ id: id });
            }
        }

        static USER_GET_REPLY(data) {
            UserUpdateView.render(data);
        }

        static USER_UPDATE(data) {

        }

        static USER_UPDATE_REPLY(data) {
            if (data.IsValid !== "undefined" && data.IsValid === false) {
                App.GlobalCommon.apply_validation(data, $("#form1"));
            } else {
                window["routie"]("boards");
            }
        }

        static USER_LOGIN_REQUIRED(data) {
            this.SIGN_IN(data);
        }

        static SIGN_IN(data) {
            Account.Common.SignIn(window.location.href);
        }

        static USER_ADD_SHARED_BOARD(data) {
            AddSharedBoardView.render();
        }
    }

    export class UserUpdateView {
        static render(data) {
            var form = App.ViewEngine.getHtml(this.getTemplate(), data);
            var upload = UserUploadPhotoView.getHtml({});
            App.ViewEngine.setAppHtml(form + upload);
            $("#btnsubmit").on("click", (e: any) => {
                e.preventDefault();
                var form = App.GlobalCommon.getFormInputs($("#form1"));
                WebStorage.USER_UPDATE_ASYNC(form);
            });
        }

        static getTemplate() {
            var displayname = App.GlobalCommon.inputstring("display_name", "display_name", "{{display_name}}", "Your display name", "text");
            var password = App.GlobalCommon.inputstring("password", "password", "{{password}}", "Your password", "password"); //  var id = App.GlobalCommon.inputstring('id', 'id', "{{id}}", '', 'hidden')
            return App.GlobalCommon.form("Update profile details", displayname + password);
        }
    }


    export class UserChangePasswordView {
        static render(data) {
            App.ViewEngine.renderview(this.getTemplate(), {});
        }

        static getTemplate(): string {
            var password = App.GlobalCommon.inputstring("password", "password", "", "Your password", "password");
            return App.GlobalCommon.form("Change Password", password);
        }
    }


    export class UserAddView {
        static render(data) {
            App.ViewEngine.renderview(this.getTemplate(), {});
        }

        static getTemplate(): string {
            var email = App.GlobalCommon.inputstring("email", "email", "{{&email}}", "Your email", "text");
            var displayname = App.GlobalCommon.inputstring("display_name", "display_name", "", "The display name", "text");
            var password = App.GlobalCommon.inputstring("password", "password", "", "Your password", "password");
            var count = App.GlobalCommon.inputstring("count", "count", "{{count}}", "", "hidden");
            return App.GlobalCommon.form("Register", email + displayname + password + count);
        }
    }

    export class UserSummariesView {
        static render(users: any) {
            App.ViewEngine.renderview(this.getTemplate(), users);
        }

        static getHtml(users: any) {
            return App.ViewEngine.getHtml(this.getTemplate(), users);
        }

        static getTemplate() {
            return "<div class='users clearfix'><strong>Users</strong><br>{{#Users}}<div class=user><img src='userfiles/{{id}}.jpg'/> {{display_name}}</div>{{/Users}} </div>";
        }
    }

    export class UserUploadPhotoView {
        static render(data) {
            data.id = amplify.store(EventNames.LOCAL_USERID);
            App.ViewEngine.renderview(this.getTemplate(), data);
            $("#btnuploadsubmit").on("click", (e: any) => {
                e.preventDefault();
                // startUpload();
            });
        }

        static getHtml(data) {
            data.id = amplify.store(EventNames.LOCAL_USERID);
            return App.ViewEngine.getHtml(this.getTemplate(), data);
        }

        static getTemplate() {
            return `<div class='well span4'><strong>Profile Image</strong><br><br><p style='display: none;' id='f1_upload_process'>Loading...<br/><img src='img/ajax-loader.gif' target='upload_target' /></p><form action='upload.ashx' method='post' enctype='multipart/form-data' target='upload_target'>Select Photo <input name='clientfile' type='file' /><br><br><input type='submit' name='btnuploadsubmit' id='btnuploadsubmit' value='Upload' />${App.GlobalCommon.inputstring("id", "id", "{{id}}", "", "hidden")}</form></div><div class='well span3'><strong>Image Upload Status</strong><br><iframe id='upload_target' name='upload_target' src='upload.ashx'  style='width:200px;height:50px;border:0px solid #fff;' ></iframe></div>`;
        }
    }

    export class DefaultView {
        static render(data) {
            App.ViewEngine.renderview(this.getTemplate(), data);
        }

        static getHtml(data) {
            return App.ViewEngine.getHtml(this.getTemplate(), data);
        }

        static getTemplate() {
            var tmp = "default view";
            return tmp;
        }
    }

    export class UserSummaryItemView {
        static render(data) {
            App.ViewEngine.renderview(this.getTemplate(), data);
        }

        static getHtml(data) {
            return App.ViewEngine.getHtml(this.getTemplate(), data);
        }

        static getTemplate() {
            var tmp = "<div class='user'>UserSummaryView</div>";
            return tmp;
        }
    }
}