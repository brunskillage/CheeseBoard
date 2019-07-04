/// <reference path="wb.errorclasses.ts" />
/// <reference path="wb.interfaces.ts" />
/// <reference path="../libs/all.d.ts" />
module WB {

    /*
=========================================================================================
*/
    export class EventNames {
        static BOARDS_LIST = "BOARDS_LIST";
        static BOARD_ADD = "BOARD_ADD";
        static BOARD_DELETE = "BOARD_DELETE";
        static BOARD_GET = "BOARD_GET";
        static BOARD_GET_BY_HASH = "BOARD_GET_BY_HASH";
        static STORY_ADD_TO_BOARD = "STORY_ADD_TO_BOARD";
        static STORY_DELETE = "STORY_DELETE";
        static TASK_ADD_TO_STORY = "TASK_ADD_TO_STORY";
        static TASK_MOVE = "TASK_MOVE";
        static TASK_GET = "TASK_GET";
        static TASK_UPDATE_TEXT = "TASK_UPDATE_TEXT";
        static TASK_UPDATE_STATUS = "TASK_UPDATE_STATUS";
        static STORY_GET = "STORY_GET";
        static TASK_DELETE = "TASK_DELETE";
        static STORY_UPDATE_TEXT = "STORY_UPDATE_TEXT";
        static BOARD_GET_CONFIGURATION = "BOARD_GET_CONFIGURATION";
        static BOARD_SET_CONFIGURATION = "BOARD_SET_CONFIGURATION";
        static BOARD_SORT_STORY = "BOARD_SORT_STORY";
        static USER_SIGN_IN_REQUIRED = "USER_SIGN_IN_REQUIRED";
        static USER_SIGN_IN_TRY = "USER_SIGN_IN_TRY";
        static USER_ADD = "USER_ADD";
        static LOCAL_ISLOGGEDIN = "IsLoggedIn";
        static LOCAL_EMAIL = "Email";
        static LOCAL_USERID = "UserId";
        static USER_ADD_SHARED_BOARD = "USER_ADD_SHARED_BOARD";
        static USER_GET = "USER_GET";
        static USER_UPDATE = "USER_UPDATE";
        static BOARD_GET_ARCHIVE = "BOARD_GET_ARCHIVE";
        static STORY_SET_STATUS = "STORY_SET_STATUS";
    }

    /*
    =========================================================================================
    */
    export class Payload {
        constructor(public action: string, public data: any) {}
    }

    export class WebStorage {
        static sendPayload(payload: Payload, next: Function) {
            if (amplify.store(EventNames.LOCAL_ISLOGGEDIN) === "1") {

            } else if (payload.action !== EventNames.USER_SIGN_IN_TRY
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
                success: function(data, b, c) {
                    next(data);
                },
                error: function() {},
                statusCode: {
                    404: (data, two, three) => ErrorController.Show(new Error("404 Not Found", "The method was not found.", "")),
                    403: (data, two, three) => ErrorController.Show(new Error("403 Access denied", "Access is not permitted to this service.", "")),
                    500: (data, two, three) => ErrorController.Show(new Error("500 Server Error", data.responseText, ""))
                }
            });
        }

        static BOARD_GET_CONFIGURATION_ASYNC(hash): any {
            var payload = new Payload(EventNames.BOARD_GET_CONFIGURATION, { hash: hash });
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.BOARD_GET_CONFIGURATION + "_REPLY", data);
            });
        }

        static BOARD_SET_CONFIGURATION_ASYNC(setConfigData): any {
            var payload = new Payload(EventNames.BOARD_SET_CONFIGURATION, setConfigData);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.BOARD_SET_CONFIGURATION + "_REPLY", data);
            });
        }

        static BOARDS_LIST_ASYNC(): any {
            var payload = new Payload(EventNames.BOARDS_LIST, {});
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.BOARDS_LIST + "_REPLY", data);
            });
        }

        static BOARD_ADD_ASYNC(boardData: any): void {
            var payload = new Payload(EventNames.BOARD_ADD, boardData);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.BOARD_ADD + "_REPLY", data);
            });
        }

        static BOARD_DELETE_ASYNC(hash: string): void {
            var payload = new Payload(EventNames.BOARD_DELETE, { hash: hash });
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.BOARD_DELETE + "_REPLY", data);
            });
        }

        static BOARD_GET_BY_HASH_ASYNC(hash: string): void {
            var payload = new Payload(EventNames.BOARD_GET_BY_HASH, { hash: hash });
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.BOARD_GET_BY_HASH + "_REPLY", data);
            });
        }

        static STORY_DELETE_ASYNC(storyDeleteData: any): void {
            var payload = new Payload(EventNames.STORY_DELETE, storyDeleteData);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.STORY_DELETE + "_REPLY", data);
            });
        }

        static TASK_ADD_TO_STORY_ASYNC(addTaskToStoryData: any): void {
            var payload = new Payload(EventNames.TASK_ADD_TO_STORY, addTaskToStoryData);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.TASK_ADD_TO_STORY + "_REPLY", data);
            });
        }

        static TASK_MOVE_ASYNC(taskMoveData: any): void {
            var payload = new Payload(EventNames.TASK_MOVE, taskMoveData);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.TASK_MOVE + "_REPLY", data);
            });
        }

        static TASK_GET_ASYNC(taskGetData: any): void {
            var payload = new Payload(EventNames.TASK_GET, taskGetData);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.TASK_GET + "_REPLY", data);
            });
        }

        static TASK_UPDATE_TEXT_ASYNC(updateTextData: any): void {
            var payload = new Payload(EventNames.TASK_UPDATE_TEXT, updateTextData);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.TASK_UPDATE_TEXT + "_REPLY", data);
            });
        }

        static TASK_DELETE_ASYNC(deleteData: any): void {
            var payload = new Payload(EventNames.TASK_DELETE, deleteData);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.TASK_DELETE + "_REPLY", data);
            });
        }

        static STORY_GET_ASYNC(storyGetData: any): void {
            var payload = new Payload(EventNames.STORY_GET, storyGetData);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.STORY_GET + "_REPLY", data);
            });
        }

        static STORY_UPDATE_TEXT_ASYNC(storyGetData: any): void {
            var payload = new Payload(EventNames.STORY_UPDATE_TEXT, storyGetData);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.STORY_UPDATE_TEXT + "_REPLY", data);
            });
        }

        static BOARD_SORT_STORY_ASYNC(data) {
            var payload = new Payload(EventNames.BOARD_SORT_STORY, data);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.BOARD_SORT_STORY + "_REPLY", data);
            });
        }

        static TASK_UPDATE_STATUS_ASYNC(data) {
            var payload = new Payload(EventNames.TASK_UPDATE_STATUS, data);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.TASK_UPDATE_STATUS + "_REPLY", data);
            });
        }

        static USER_SIGN_IN_ASYNC(data) {
            var payload = new Payload(EventNames.USER_SIGN_IN_TRY, data);
            this.sendPayload(payload, (data) => {
                amplify.store("user", data);
                amplify.publish(EventNames.USER_SIGN_IN_TRY + "_REPLY", data);
            });
        }

        static USER_ADD_ASYNC(data) {
            var payload = new Payload(EventNames.USER_ADD, data);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.USER_ADD + "_REPLY", data);
            });
        }

        static USER_ADD_SHARED_BOARD_ASYNC(data) {
            var payload = new Payload(EventNames.USER_ADD_SHARED_BOARD, data);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.USER_ADD_SHARED_BOARD + "_REPLY", data);
            });
        }

        static USER_GET(data) {
            var payload = new Payload(EventNames.USER_GET, data);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.USER_GET + "_REPLY", data);
            });
        }

        static USER_UPDATE_ASYNC(data) {
            var payload = new Payload(EventNames.USER_UPDATE, data);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.USER_UPDATE + "_REPLY", data);
            });
        }

        static BOARD_GET_ARCHIVE_ASYNC(data) {
            var payload = new Payload(EventNames.BOARD_GET_ARCHIVE, data);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.BOARD_GET_ARCHIVE + "_REPLY", data);
            });
        }

        static STORY_SET_STATUS_ASYNC(data) {
            var payload = new Payload(EventNames.STORY_SET_STATUS, data);
            this.sendPayload(payload, (data) => {
                amplify.publish(EventNames.STORY_SET_STATUS + "_REPLY", data);
            });
        }
    }
}