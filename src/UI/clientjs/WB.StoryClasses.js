"use strict";
/// <reference path="../libs/all.d.ts" />
/// <reference path="ScrumboServerClient.ts" />
/// <reference path="WB.Storage.ts" />
var WB;
(function (WB) {
    /*
    =========================================================================================
    */
    var StoryController = /** @class */ (function () {
        function StoryController() {
        }
        StoryController.STORY_GET = function (id) {
            var client = new WB.ScrumboServerClient();
            var action = client.CallMethod("StoryGet", { id: id });
            $.when(action).then(function (resp) { return StoryEditView.render(resp); });
        };
        StoryController.STORY_ADD_TO_BOARD = function (boardid) {
            StoryAddView.render(boardid);
        };
        StoryController.STORY_DELETE = function (storyId) {
            StoryDeleteView.render({ id: storyId });
        };
        return StoryController;
    }());
    WB.StoryController = StoryController;
    /*
        =========================================================================================
        */
    var StoryView = /** @class */ (function () {
        function StoryView() {
        }
        StoryView.render = function (data) {
            this.setStatus(data);
            App.ViewEngine.renderview(this.getTemplate(), data);
        };
        StoryView.munged = function (data, boardhash) {
            data.board_hash = boardhash;
            data.textof = App.GlobalCommon.uiify(data.textof);
            this.setStatus(data);
            return App.ViewEngine.getHtml(this.getTemplate(), data);
        };
        StoryView.setStatus = function (data) {
            if (data && !data.status) {
                data.status = "TODO";
            }
        };
        StoryView.getTemplate = function () {
            if (!this.hasOwnProperty("val")) {
                var lines = [];
                lines.push("<div class='story clearfix' data-id={{id}}>");
                lines.push("{{&textof}}");
                lines.push("<div class='storybar clearfix'>");
                lines.push("<div class=''>");
                lines.push("<a alt='view and edit details' class='btn btn-link btn-xs' href='#story/{{id}}'>edit</a> ");
                lines.push("<a alt='delete story' class='btn btn-link btn-xs' href='#story/{{id}}/delete'>delete</a> ");
                lines.push("<a class='btn btn-default btn-xs' alt='add task' href='#task/addtostory/{{id}}/{{board_hash}}'>+task</a> ");
                lines.push("<a class='btn btn-default btn-xs' alt='add task' href='#story/{{id}}/addfile/{{board_hash}}'>+file</a> ");
                lines.push("</div>");
                lines.push("</div>");
                lines.push("</div>");
                this["val"] = lines.join("");
            }
            return this["val"];
        };
        return StoryView;
    }());
    WB.StoryView = StoryView;
    /*
        =========================================================================================
        */
    var StoryDeleteView = /** @class */ (function () {
        function StoryDeleteView() {
        }
        StoryDeleteView.render = function (data) {
            App.ViewEngine.renderview(this.getTemplate(), data);
            $("#btnsubmit").on("click", function (e) {
                e.preventDefault();
                var data = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new WB.ScrumboServerClient();
                var act = client.CallMethod("StoryDelete", data);
                $.when(act).then(function (resp) { return window.history.back(); });
            });
        };
        StoryDeleteView.getTemplate = function () {
            var id = App.GlobalCommon.inputstring("id", "id", "{{id}}", "", "hidden");
            var hash = App.GlobalCommon.inputstring("hash", "hash", "{{hash}}", "", "hidden");
            var form = App.GlobalCommon.form("Delete Story?", hash + id);
            return form;
        };
        return StoryDeleteView;
    }());
    WB.StoryDeleteView = StoryDeleteView;
    /*
        =========================================================================================
        */
    var StoryChangeStatusView = /** @class */ (function () {
        function StoryChangeStatusView() {
        }
        StoryChangeStatusView.render = function (data) {
            $("body").off("click").on("click", ".btn_status", function (e) {
                e.preventDefault();
                var id = $(e.target).attr("data-id");
                var status = $(e.target).attr("data-status");
                var client = new WB.ScrumboServerClient();
                var act = client.CallMethod("StorySetStatus", { id: id, status: status });
                $.when(act).then(function (resp) {
                    $("#BoardChangeStatusView").prepend("<div id=changeOk class='alert alert-success'>Done, going back to board...</div>")
                        .fadeOut()
                        .fadeIn();
                    setTimeout(function () { return window.history.back(); }, 3000);
                });
            });
            return App.ViewEngine.renderview(this.getTemplate(), data);
        };
        StoryChangeStatusView.getHtml = function (data) {
            return this.render(data);
        };
        StoryChangeStatusView.getTemplate = function () {
            var form = "<div id='BoardChangeStatusView'><h3>Story Status</h3>"
                + " <div class=''>CURRENT: {{status}}</div>"
                + "<br><br>Change to : <br>"
                + " <a class='btn btn-primary btn_status' data-id='{{id}}' data-status='TODO' href='#'>To Do</a>"
                + " <a class='btn btn-primary btn_status' data-id='{{id}}' data-status='INPROGRESS' href='#'>In Progress</a>"
                + " <a class='btn btn-primary btn_status' data-id='{{id}}' data-status='DONE' href='#'>Done</a>"
                + " <a class='btn btn-primary btn_status' data-id='{{id}}' data-status='ARCHIVE' href='#'>Archive</a>"
                + "</div>";
            return App.GlobalCommon.container(form);
        };
        return StoryChangeStatusView;
    }());
    WB.StoryChangeStatusView = StoryChangeStatusView;
    /*
    =========================================================================================
    */
    var StoryEditView = /** @class */ (function () {
        function StoryEditView() {
        }
        StoryEditView.render = function (data) {
            var setstatus = StoryChangeStatusView.getHtml(data);
            var wrapper = "<div class=form-wrap>" + this.getTemplate() + setstatus + "</div>";
            App.ViewEngine.renderview(wrapper, data);
            $("#btnsubmit").off("click").on("click", function (e) {
                e.preventDefault();
                $(e.target).attr("disabled", "disabled");
                var form = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new WB.ScrumboServerClient();
                var act = client.CallMethod("StoryUpdateText", form);
                $.when(act).then(function (resp) { return App.GlobalCommon.processPostBack(resp, $("#form1"), window.history.back()); });
            });
        };
        StoryEditView.getTemplate = function () {
            var textof = App.GlobalCommon.textarea("textof", "textof", "{{textof}}", "", "4");
            var id = App.GlobalCommon.inputstring("id", "id", "{{id}}", "", "hidden");
            var form = App.GlobalCommon.form("<h2><span class='glyphicon glyphicon-edit'></span> Story Details</h2>", textof + id);
            return App.GlobalCommon.container(form);
        };
        return StoryEditView;
    }());
    WB.StoryEditView = StoryEditView;
    /*
        =========================================================================================
        */
    var StoryAddView = /** @class */ (function () {
        function StoryAddView() {
        }
        StoryAddView.render = function (hash) {
            App.ViewEngine.renderview(this.getTemplate(hash), {});
            $("#btnsubmit").off("click").on("click", function (e) {
                e.preventDefault();
                $(e.target).attr("disabled", "disabled");
                var data = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new WB.ScrumboServerClient();
                var act = client.CallMethod("StoryAddToBoard", data);
                $.when(act).then(function (resp) { return App.GlobalCommon.processPostBack(resp, $("#form1"), window.history.back()); });
            });
        };
        StoryAddView.getTemplate = function (hash) {
            var nameof = App.GlobalCommon.textarea("textof", "textof", "", "", "4");
            var hash = App.GlobalCommon.inputstring("hash", "hash", hash, "", "hidden");
            var form = App.GlobalCommon.form("<h2><span class='glyphicon glyphicon-leaf'></span> Add Story to board</h2>", nameof + hash);
            return App.GlobalCommon.container(form);
        };
        return StoryAddView;
    }());
    WB.StoryAddView = StoryAddView;
    /*
        =========================================================================================
        */
    var Story = /** @class */ (function () {
        function Story(id, priority, textof, sort_order, status) {
            this.id = id;
            this.priority = priority;
            this.textof = textof;
            this.sort_order = sort_order;
            this.status = status;
        }
        return Story;
    }());
    WB.Story = Story;
})(WB || (WB = {}));
