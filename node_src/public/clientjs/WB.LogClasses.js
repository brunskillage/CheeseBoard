"use strict";
/// <reference path="wb.userclasses.ts" />
var WB;
(function (WB) {
    /*
    =========================================================================================
    */
    var Log_Item = /** @class */ (function () {
        function Log_Item(id, board_id, story_id, task_id, user_id, textof, display_text, date_created, action) {
            this.id = id;
            this.board_id = board_id;
            this.story_id = story_id;
            this.task_id = task_id;
            this.user_id = user_id;
            this.textof = textof;
            this.display_text = display_text;
            this.date_created = date_created;
            this.action = action;
        }
        return Log_Item;
    }());
    WB.Log_Item = Log_Item;
    var LogController = /** @class */ (function () {
        function LogController() {
        }
        LogController.SHOW_TASK_LOG = function (id) {
            LogView.render({ task_id: id });
        };
        return LogController;
    }());
    WB.LogController = LogController;
    var LogView = /** @class */ (function () {
        function LogView() {
        }
        LogView.render = function (args) {
            var _this = this;
            var client = new WB.ScrumboServerClient();
            var act = client.CallMethod("GetTaskLogItems", args);
            $.when(act).then(function (data) {
                data.log_items.forEach(function (t) {
                    t.fuzzy_date = moment.utc(t.date_created).fromNow();
                    t.action_name = data.actions[t.action];
                    App.ViewEngine.renderview(_this.getTemplate(), data);
                });
            });
        };
        LogView.getTemplate = function () {
            var tmp = "<div class='logitems clearfix'>"
                + "<h1>Task Activity</h1>"
                + "{{#log_items}}<div class=logitem>"
                + "<span class='text'>{{action_name}} {{&textof}}</span>"
                + "<span class='date'>{{fuzzy_date}}</span>"
                + "</div>{{/log_items}}</div>";
            return tmp;
        };
        LogView.getHtml = function (data) {
            //Enumerable.From(data.log_items).ForEach((logitem: Log_Item) => {
            //    var actionname = this.getActionName(logitem.action, data.actions);
            //    var user = this.getUserName(logitem.user_id, data.users)
            //    var fuzzytime = App.GlobalCommon.prettyDate(logitem.date_created); 
            //    logitem.display_text = user + " " + " <br> " + fuzzytime + " <br> " + actionname + "  [" + logitem.task_id + "] " + logitem.textof
            //})
            return App.ViewEngine.getHtml(this.getTemplate(), data);
        };
        return LogView;
    }());
    WB.LogView = LogView;
})(WB || (WB = {}));
