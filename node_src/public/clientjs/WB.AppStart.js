"use strict";
var WB;
(function (WB) {
    var AppStart = /** @class */ (function () {
        function AppStart() {
        }
        AppStart.start = function () {
            var html = Account.LoginBarView.getHtml();
            $("#user_bar").html(html);
            this.registerEvents();
            this.registerRoutes();
            this.gotoBoardIfExists();
        };
        AppStart.showSignedInBits = function () {
            var html = Account.LoginBarView.getHtml();
            $("#user_bar").html(html);
        };
        AppStart.hideSignedInBits = function () {
            $("#user_bar").html("");
        };
        AppStart.registerRoutes = function () {
            window.routie({
                'user/:id': function (data) { return WB.UserController.USER_GET(data); },
                'boards': function () { return WB.BoardController.BOARDS_LIST(); },
                'boards/addshared': function (data) { return WB.BoardController.USER_ADD_SHARED_BOARD(data); },
                'boards/add': function () { return WB.BoardController.BOARD_ADD(); },
                'board/:hash/config': function (hash) { return WB.BoardController.BOARD_GET_CONFIGURATION(hash); },
                'board/:hash/delete': function (hash) { return WB.BoardController.BOARD_DELETE(hash); },
                'board/:hash/addstory': function (hash) { return WB.StoryController.STORY_ADD_TO_BOARD(hash); },
                'board/:hash/archive': function (hash) { return WB.BoardController.BOARD_GET_ARCHIVE(hash); },
                'board/:hash/simple': function (hash) { return WB.BoardController.BOARD_GET_SIMPLE(hash); },
                'board/:hash/list': function (hash) { return WB.BoardController.BOARD_GET_LIST(hash); },
                'board/:hash': function (hash) { return WB.BoardController.BOARD_GET(hash); },
                'task/addtostory/:id/:hash': function (id, hash) { return WB.TaskController.TASK_ADD_TO_STORY(id, hash); },
                'task/:id': function (id) { return WB.TaskController.TASK_GET(id); },
                'task/delete/:id': function (id) { return WB.TaskController.TASK_DELETE(id); },
                'task/:id/addlog': function (id) { return WB.TaskController.TASK_ADD_LOG(); },
                'task/:id/log': function (id) { return WB.LogController.SHOW_TASK_LOG(id); },
                'story/:id/delete': function (id) { return WB.StoryController.STORY_DELETE(id); },
                'story/:id': function (id) { return WB.StoryController.STORY_GET(id); },
                '/': function () { return WB.BoardController.BOARDS_LIST(); },
                '': function () { return WB.BoardController.BOARDS_LIST(); }
            });
        };
        AppStart.registerEvents = function () {
            var _this = this;
            if (!this.hasSetEvents) {
                amplify.subscribe("getLoginView", function () { return _this.showSignedInBits(); });
                this.hasSetEvents = true;
            }
        };
        AppStart.gotoBoardIfExists = function () {
            var lastBoard = amplify.store("last_board_hash");
            if (lastBoard) {
                window.routie("board/" + lastBoard);
            }
        };
        //private window: Window;
        AppStart.hasSetEvents = false;
        AppStart.IsLoggedIn = false;
        AppStart.UserId = 0;
        AppStart.Email = "";
        return AppStart;
    }());
    WB.AppStart = AppStart;
})(WB || (WB = {}));
WB.AppStart.start();
