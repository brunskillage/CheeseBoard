"use strict";
/// <reference path="wb.errorclasses.ts" />
/// <reference path="wb.interfaces.ts" />
/// <reference path="../libs/all.d.ts" />
var WB;
(function (WB) {
    /*
=========================================================================================
*/
    var EventNames = /** @class */ (function () {
        function EventNames() {
        }
        EventNames.BOARDS_LIST = "BOARDS_LIST";
        EventNames.BOARD_ADD = "BOARD_ADD";
        EventNames.BOARD_DELETE = "BOARD_DELETE";
        EventNames.BOARD_GET = "BOARD_GET";
        EventNames.BOARD_GET_BY_HASH = "BOARD_GET_BY_HASH";
        EventNames.STORY_ADD_TO_BOARD = "STORY_ADD_TO_BOARD";
        EventNames.STORY_DELETE = "STORY_DELETE";
        EventNames.TASK_ADD_TO_STORY = "TASK_ADD_TO_STORY";
        EventNames.TASK_MOVE = "TASK_MOVE";
        EventNames.TASK_GET = "TASK_GET";
        EventNames.TASK_UPDATE_TEXT = "TASK_UPDATE_TEXT";
        EventNames.TASK_UPDATE_STATUS = "TASK_UPDATE_STATUS";
        EventNames.STORY_GET = "STORY_GET";
        EventNames.TASK_DELETE = "TASK_DELETE";
        EventNames.STORY_UPDATE_TEXT = "STORY_UPDATE_TEXT";
        EventNames.BOARD_GET_CONFIGURATION = "BOARD_GET_CONFIGURATION";
        EventNames.BOARD_SET_CONFIGURATION = "BOARD_SET_CONFIGURATION";
        EventNames.BOARD_SORT_STORY = "BOARD_SORT_STORY";
        EventNames.USER_SIGN_IN_REQUIRED = "USER_SIGN_IN_REQUIRED";
        EventNames.USER_SIGN_IN_TRY = "USER_SIGN_IN_TRY";
        EventNames.USER_ADD = "USER_ADD";
        EventNames.LOCAL_ISLOGGEDIN = "IsLoggedIn";
        EventNames.LOCAL_EMAIL = "Email";
        EventNames.LOCAL_USERID = "UserId";
        EventNames.USER_ADD_SHARED_BOARD = "USER_ADD_SHARED_BOARD";
        EventNames.USER_GET = "USER_GET";
        EventNames.USER_UPDATE = "USER_UPDATE";
        EventNames.BOARD_GET_ARCHIVE = "BOARD_GET_ARCHIVE";
        EventNames.STORY_SET_STATUS = "STORY_SET_STATUS";
        return EventNames;
    }());
    WB.EventNames = EventNames;
    /*
    =========================================================================================
    */
    var Payload = /** @class */ (function () {
        function Payload(action, data) {
            this.action = action;
            this.data = data;
        }
        return Payload;
    }());
    WB.Payload = Payload;
    var WebStorage = /** @class */ (function () {
        function WebStorage() {
        }
        WebStorage.sendPayload = function (payload, next) {
            if (amplify.store(EventNames.LOCAL_ISLOGGEDIN) === "1") {
            }
            else if (payload.action !== EventNames.USER_SIGN_IN_TRY
                && payload.action !== EventNames.USER_ADD) {
                amplify.publish(EventNames.USER_SIGN_IN_REQUIRED);
                return;
            }
            $.ajax({
                type: "POST",
                url: "/scrumbo/scrumbo_server.ashx",
                headers: {
                    "UserId": amplify.store(EventNames.LOCAL_USERID)
                },
                dataType: "JSON",
                cache: false,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(payload),
                success: function (data, b, c) {
                    next(data);
                },
                error: function () { },
                statusCode: {
                    404: function (data, two, three) { return WB.ErrorController.Show(new WB.Error("404 Not Found", "The method was not found.", "")); },
                    403: function (data, two, three) { return WB.ErrorController.Show(new WB.Error("403 Access denied", "Access is not permitted to this service.", "")); },
                    500: function (data, two, three) { return WB.ErrorController.Show(new WB.Error("500 Server Error", data.responseText, "")); }
                }
            });
        };
        WebStorage.BOARD_GET_CONFIGURATION_ASYNC = function (hash) {
            var payload = new Payload(EventNames.BOARD_GET_CONFIGURATION, { hash: hash });
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.BOARD_GET_CONFIGURATION + "_REPLY", data);
            });
        };
        WebStorage.BOARD_SET_CONFIGURATION_ASYNC = function (setConfigData) {
            var payload = new Payload(EventNames.BOARD_SET_CONFIGURATION, setConfigData);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.BOARD_SET_CONFIGURATION + "_REPLY", data);
            });
        };
        WebStorage.BOARDS_LIST_ASYNC = function () {
            var payload = new Payload(EventNames.BOARDS_LIST, {});
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.BOARDS_LIST + "_REPLY", data);
            });
        };
        WebStorage.BOARD_ADD_ASYNC = function (boardData) {
            var payload = new Payload(EventNames.BOARD_ADD, boardData);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.BOARD_ADD + "_REPLY", data);
            });
        };
        WebStorage.BOARD_DELETE_ASYNC = function (hash) {
            var payload = new Payload(EventNames.BOARD_DELETE, { hash: hash });
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.BOARD_DELETE + "_REPLY", data);
            });
        };
        WebStorage.BOARD_GET_BY_HASH_ASYNC = function (hash) {
            var payload = new Payload(EventNames.BOARD_GET_BY_HASH, { hash: hash });
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.BOARD_GET_BY_HASH + "_REPLY", data);
            });
        };
        WebStorage.STORY_DELETE_ASYNC = function (storyDeleteData) {
            var payload = new Payload(EventNames.STORY_DELETE, storyDeleteData);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.STORY_DELETE + "_REPLY", data);
            });
        };
        WebStorage.TASK_ADD_TO_STORY_ASYNC = function (addTaskToStoryData) {
            var payload = new Payload(EventNames.TASK_ADD_TO_STORY, addTaskToStoryData);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.TASK_ADD_TO_STORY + "_REPLY", data);
            });
        };
        WebStorage.TASK_MOVE_ASYNC = function (taskMoveData) {
            var payload = new Payload(EventNames.TASK_MOVE, taskMoveData);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.TASK_MOVE + "_REPLY", data);
            });
        };
        WebStorage.TASK_GET_ASYNC = function (taskGetData) {
            var payload = new Payload(EventNames.TASK_GET, taskGetData);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.TASK_GET + "_REPLY", data);
            });
        };
        WebStorage.TASK_UPDATE_TEXT_ASYNC = function (updateTextData) {
            var payload = new Payload(EventNames.TASK_UPDATE_TEXT, updateTextData);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.TASK_UPDATE_TEXT + "_REPLY", data);
            });
        };
        WebStorage.TASK_DELETE_ASYNC = function (deleteData) {
            var payload = new Payload(EventNames.TASK_DELETE, deleteData);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.TASK_DELETE + "_REPLY", data);
            });
        };
        WebStorage.STORY_GET_ASYNC = function (storyGetData) {
            var payload = new Payload(EventNames.STORY_GET, storyGetData);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.STORY_GET + "_REPLY", data);
            });
        };
        WebStorage.STORY_UPDATE_TEXT_ASYNC = function (storyGetData) {
            var payload = new Payload(EventNames.STORY_UPDATE_TEXT, storyGetData);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.STORY_UPDATE_TEXT + "_REPLY", data);
            });
        };
        WebStorage.BOARD_SORT_STORY_ASYNC = function (data) {
            var payload = new Payload(EventNames.BOARD_SORT_STORY, data);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.BOARD_SORT_STORY + "_REPLY", data);
            });
        };
        WebStorage.TASK_UPDATE_STATUS_ASYNC = function (data) {
            var payload = new Payload(EventNames.TASK_UPDATE_STATUS, data);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.TASK_UPDATE_STATUS + "_REPLY", data);
            });
        };
        WebStorage.USER_SIGN_IN_ASYNC = function (data) {
            var payload = new Payload(EventNames.USER_SIGN_IN_TRY, data);
            this.sendPayload(payload, function (data) {
                amplify.store("user", data);
                amplify.publish(EventNames.USER_SIGN_IN_TRY + "_REPLY", data);
            });
        };
        WebStorage.USER_ADD_ASYNC = function (data) {
            var payload = new Payload(EventNames.USER_ADD, data);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.USER_ADD + "_REPLY", data);
            });
        };
        WebStorage.USER_ADD_SHARED_BOARD_ASYNC = function (data) {
            var payload = new Payload(EventNames.USER_ADD_SHARED_BOARD, data);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.USER_ADD_SHARED_BOARD + "_REPLY", data);
            });
        };
        WebStorage.USER_GET = function (data) {
            var payload = new Payload(EventNames.USER_GET, data);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.USER_GET + "_REPLY", data);
            });
        };
        WebStorage.USER_UPDATE_ASYNC = function (data) {
            var payload = new Payload(EventNames.USER_UPDATE, data);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.USER_UPDATE + "_REPLY", data);
            });
        };
        WebStorage.BOARD_GET_ARCHIVE_ASYNC = function (data) {
            var payload = new Payload(EventNames.BOARD_GET_ARCHIVE, data);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.BOARD_GET_ARCHIVE + "_REPLY", data);
            });
        };
        WebStorage.STORY_SET_STATUS_ASYNC = function (data) {
            var payload = new Payload(EventNames.STORY_SET_STATUS, data);
            this.sendPayload(payload, function (data) {
                amplify.publish(EventNames.STORY_SET_STATUS + "_REPLY", data);
            });
        };
        return WebStorage;
    }());
    WB.WebStorage = WebStorage;
})(WB || (WB = {}));
