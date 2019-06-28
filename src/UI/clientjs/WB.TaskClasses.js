"use strict";
/// <reference path="WB.BoardClasses.ts" />
/// <reference path="scrumboserverclient.ts" />
/// <reference path="../libs/all.d.ts" />
var WB;
(function (WB) {
    /*
    =========================================================================================
    */
    var TaskController = /** @class */ (function () {
        function TaskController() {
        }
        TaskController.TASK_ADD_TO_STORY = function (id, hash) {
            var _this = this;
            TaskAddView.render({ id: id, hash: hash });
            $("#btnsubmit").off("click").on("click", function (e) {
                e.preventDefault();
                $(e.target).attr("disabled", "disabled");
                _this.submitForm();
            });
        };
        TaskController.submitForm = function () {
            var form = App.GlobalCommon.getFormInputs($("#form1"));
            var client = new WB.ScrumboServerClient();
            var servertask = client.CallMethod("TaskAddToStory", form);
            $.when(servertask).then(function (resp) {
                App.GlobalCommon.processPostBack(resp, $("#form1"), function () { return window.history.back(); });
            });
        };
        TaskController.TASK_MOVE = function (data) {
            var client = new WB.ScrumboServerClient();
            client.CallMethod("TaskMove", data);
        };
        TaskController.TASK_UPDATE_STATUS = function (data) {
            var client = new WB.ScrumboServerClient();
            client.CallMethod("TaskUpdateStatus", data);
        };
        TaskController.TASK_DELETE = function (deleteData) {
            TaskDeleteView.render(deleteData);
        };
        TaskController.TASK_GET = function (id) {
            var client = new WB.ScrumboServerClient();
            var serverData = client.CallMethod("TaskGet", { id: id });
            $.when(serverData).then(function (resp) { return TaskEditView.render(resp); });
        };
        TaskController.TASK_ADD_LOG = function () {
        };
        TaskController.validate = function (data) {
            if (data.IsValid !== "undefined" && data.IsValid === false) {
                App.GlobalCommon.apply_validation(data, $("#form1"));
            }
            else {
                window.history.back();
            }
        };
        TaskController.TASK_DELETE_REPLY = function (data) {
            window.history.back();
        };
        return TaskController;
    }());
    WB.TaskController = TaskController;
    var TaskMenuView = /** @class */ (function () {
        function TaskMenuView() {
        }
        TaskMenuView.getHtml = function (task) {
            return App.ViewEngine.getHtml(this.getTemplate(), task);
        };
        TaskMenuView.getTemplate = function () {
            return "<div class='taskmenu' data-id={{id}}>"
                + "<a href='#' class='act'>Edit</a>"
                + "<a href='#' class='act'>Add Log</a>"
                + "<a href='#' class='act'>Add File</a>"
                + "<a href='#' class='act'>Archive</a>"
                + "<a href='#' class='act'>Delete</a>"
                + "</div>";
        };
        TaskMenuView.render = function (task) {
            App.ViewEngine.renderview(this.getTemplate(), task);
        };
        return TaskMenuView;
    }());
    WB.TaskMenuView = TaskMenuView;
    var LogNote = /** @class */ (function () {
        function LogNote(textof) {
            this.textof = textof;
        }
        return LogNote;
    }());
    WB.LogNote = LogNote;
    var LogNoteRowView = /** @class */ (function () {
        function LogNoteRowView() {
        }
        LogNoteRowView.render = function (note) {
            return App.ViewEngine.renderview(LogNoteRowView.getTemplate(), note);
        };
        LogNoteRowView.getHtml = function (note) {
            return App.ViewEngine.getHtml(LogNoteRowView.getTemplate(), note);
        };
        LogNoteRowView.getTemplate = function () {
            return "<div class='lognoterow'><span class='glyphicon glyphicon-pencil'>&nbsp;</span><span class='lognote'>{{textof}}</span></div>";
        };
        return LogNoteRowView;
    }());
    WB.LogNoteRowView = LogNoteRowView;
    var TaskView = /** @class */ (function () {
        function TaskView() {
        }
        TaskView.adjustModel = function (task) {
            if (!task.css_class)
                task.css_class = "task";
            task.isEditable = task.status === "TODO";
            task.showUser = (task.user_id > 0);
            task.fuzzyModified = moment.utc(task.date_modified).fromNow();
            task.textof = App.GlobalCommon.uiify(task.textof);
            return task;
        };
        TaskView.render = function (task) {
            this.adjustModel(task);
            App.ViewEngine.renderview(this.getTemplate(task), task);
        };
        TaskView.getHtml = function (task) {
            this.adjustModel(task);
            //task["archivelink"] = task.status === 'DONE' ? "<br><a class='btn btn_status btn-xs'  alt='Archive this task' href='#' data-status='ARCHIVE' data-id='{{id}}'>archive</a>" : ""
            return App.ViewEngine.getHtml(this.getTemplate(task), task);
        };
        // static tmpl : string;
        TaskView.getTemplate = function (task) {
            var tmpl = "";
            var logNoteRow = LogNoteRowView.getTemplate();
            var archive = task.status === "DONE" ? "<br><a class='btn btn_status btn-xs'  alt='Archive this task' href='#' data-status='ARCHIVE' data-id='{{id}}'>archive >></a>" : "";
            var tmpl = "<div class='task {{css_class}} clearfix' data-id='{{id}}' data-status='{{status}}'><div class='ttext'>  {{&textof}} <span class='more'>[more...]</span>" + archive + "<div class=lognotes>{{#log_notes}}" + logNoteRow + "{{/log_notes}}</div><div class='task-foot clearfix'>---<br><span class=''>#{{id}}</span> changed <span>{{fuzzyModified}} by {{display_name}}</span><span class='usercss_{{user_id}}'></span> <a data-id={{id}} class='taskmore' alt='View taskbar' href='#task/{{id}}'>[edit]</a> <a data-id={{id}} class='addlog' alt='Add a task comment' href='#'>[add notelog]</a>   <a data-id={{id}} class='' alt='View Task Log' href='#task/{{id}}/log'>[see {{note_count}} in note log]</a> </div></div></div>";
            return tmpl;
        };
        return TaskView;
    }());
    WB.TaskView = TaskView;
    var TaskDeleteView = /** @class */ (function () {
        function TaskDeleteView() {
        }
        TaskDeleteView.render = function (id) {
            App.ViewEngine.renderview(this.getTemplate(), { id: id });
            $("#btnsubmit").on("click", function (e) {
                e.preventDefault();
                var form = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new WB.ScrumboServerClient();
                var servertask = client.CallMethod("TaskDelete", form);
                $.when(servertask).then(function (resp) {
                    App.GlobalCommon.processPostBack(resp, $("#form1"), function () { return window.routie("board/" + amplify.store("last_board_hash")); });
                });
            });
        };
        TaskDeleteView.getTemplate = function () {
            var id = App.GlobalCommon.inputstring("id", "id", "{{id}}", "", "hidden");
            var form = App.GlobalCommon.form("<h2><span class='glyphicon glyphicon-trash'></span> Delete Task</h2>", id + " <span class='label label-danger'>Warning</span> <span>Pressing Submit will delete the task and any associated objects permenantly.</span><br><br>");
            return App.GlobalCommon.container(form);
        };
        return TaskDeleteView;
    }());
    WB.TaskDeleteView = TaskDeleteView;
    var TaskAddLogView = /** @class */ (function () {
        function TaskAddLogView() {
        }
        TaskAddLogView.render = function (data) {
            App.ViewEngine.renderview(this.getTemplate(), data);
        };
        TaskAddLogView.getHtml = function (data) {
            return App.ViewEngine.getHtml(this.getTemplate(), data);
        };
        TaskAddLogView.getTemplate = function () {
            $("#addlogid").remove();
            var lines = [];
            lines.push("<div class=\"addlogview\">");
            lines.push("<form role=\"form\" class=\"form-vertical\" id=\"formAddLog\">");
            lines.push("<input class=\"form-editing\" type=\"text\" id=\"textof\" name=\"addlogid\" value=\"\" maxlength=\"50\"/>");
            lines.push("<input class=\"form-editing\" type=\"hidden\" id=\"addlogid\" name=\"addlogid\" value=\"{{id}}\" maxlength=\"50\"/>");
            lines.push(" <button id=\"btnaddlog\" data-id=\"0\" class=\"btn btn-primary btn-xs clearfix\">add</button>");
            lines.push("<div id=\"errors\"></div>");
            lines.push("</form>");
            lines.push("</div>");
            return lines.join("");
        };
        return TaskAddLogView;
    }());
    WB.TaskAddLogView = TaskAddLogView;
    var TaskAddView = /** @class */ (function () {
        function TaskAddView() {
        }
        TaskAddView.render = function (taskViewData) {
            App.ViewEngine.renderview(this.getTemplate(), taskViewData);
        };
        TaskAddView.getTemplate = function () {
            var textof = App.GlobalCommon.textarea("textof", "textof", "{{textof}}", "", "4");
            var id = App.GlobalCommon.inputstring("story_id", "story_id", "{{id}}", "", "hidden");
            var css = "";
            css += App.GlobalCommon.radio("css_class", "taskyellow", "Yellow", "yellow taskmini", true);
            css += App.GlobalCommon.radio("css_class", "taskgreen", "Green", " green taskmini", false);
            css += App.GlobalCommon.radio("css_class", "taskorange", "Orange", "orange taskmini", false);
            css += App.GlobalCommon.radio("css_class", "taskpink", "Pink", "pink taskmini", false);
            css += App.GlobalCommon.radio("css_class", "taskblue", "Blue", "blue taskmini", false);
            css += App.GlobalCommon.radio("css_class", "taskpurple", "Purple", "purple taskmini", false);
            var hash = App.GlobalCommon.inputstring("hash", "hash", "{{hash}}", "", "hidden");
            var form = App.GlobalCommon.form("<h2><span class='glyphicon glyphicon-leaf'></span> New Task</h2>", textof + id + css + hash + "<br><br>");
            return App.GlobalCommon.container(form);
        };
        return TaskAddView;
    }());
    WB.TaskAddView = TaskAddView;
    var TaskEditView = /** @class */ (function () {
        function TaskEditView() {
        }
        TaskEditView.prototype.render = function (data) {
        };
        TaskEditView.prototype.registerEvents = function () {
        };
        TaskEditView.prototype.getHtml = function () {
            return "";
        };
        TaskEditView.render = function (taskViewData) {
            var html = App.ViewEngine.renderview(this.getTemplate(taskViewData), taskViewData);
            $("input:radio[value=" + taskViewData.css_class + "]").first().attr("checked", "checked");
            $("#btnsubmit").on("click", function (e) {
                e.preventDefault();
                $(e.target).attr("disabled", "disabled");
                var data = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new WB.ScrumboServerClient();
                var servertask = client.CallMethod("TaskUpdateText", data);
                $.when(servertask).then(function (resp) {
                    App.GlobalCommon.processPostBack(resp, $("#form1"), function () { return window.history.back(); });
                });
            });
            return html;
        };
        TaskEditView.getTemplate = function (data) {
            var textof = App.GlobalCommon.textarea("textof", "textof", "{{&textof}}", "", "4");
            var css = "<br>";
            css += App.GlobalCommon.radio("css_class", "taskyellow", "Yellow", "yellow taskmini", true);
            css += App.GlobalCommon.radio("css_class", "taskgreen", "Green", "green taskmini", false);
            css += App.GlobalCommon.radio("css_class", "taskorange", "Orange", "orange taskmini", false);
            css += App.GlobalCommon.radio("css_class", "taskpink", "Pink", "pink taskmini", false);
            css += App.GlobalCommon.radio("css_class", "taskblue", "Blue", "blue taskmini", false);
            css += App.GlobalCommon.radio("css_class", "taskpurple", "Purple", "purple taskmini", false);
            var id = "<input class='form-editing' type='hidden' id='id' name='id' value='{{id}}' maxlength='50'>";
            var form = App.GlobalCommon.form("<h2><span class='glyphicon glyphicon-edit'></span> Edit Task #{{id}}</h2>", textof + css + TaskSetStatusView.getHtml(data) + id);
            return App.GlobalCommon.container(form);
        };
        return TaskEditView;
    }());
    WB.TaskEditView = TaskEditView;
    var TaskSetStatusView = /** @class */ (function () {
        function TaskSetStatusView() {
        }
        TaskSetStatusView.getHtml = function (data) {
            this.init(data);
            return App.ViewEngine.getHtml(this.getTemplate(), data);
        };
        TaskSetStatusView.init = function (data) {
            $("body").off("click").on("click", ".btn_status", function (e) {
                e.preventDefault();
                var status = $(e.target).attr("data-status");
                var sort_order = $(e.target).attr("data-sortorder");
                var id = $(e.target).attr("data-id");
                var data = { status: status, sort_order: sort_order, id: id };
                var method = status && status == "DELETE" ? "TaskDelete" : status ? "TaskUpdateStatus" : sort_order ? "TaskUpdateSortOrder" : "";
                var client = new WB.ScrumboServerClient();
                client.CallMethod(method, data);
                window.history.back();
            });
        };
        TaskSetStatusView.render = function (data) {
            this.init(data);
            return App.ViewEngine.renderview(this.getTemplate(), data);
        };
        TaskSetStatusView.getTemplate = function () {
            var statusButtons = "<br><br>Status"
                + "<div class='clearfix'></div><div class='clearfix btn-group'>"
                + "<a class='btn btn-default btn_status' href='#' data-id='{{id}}' data-status='INPROGRESS'>In progress</a>"
                + "<a class='btn btn-default btn_status' href='#' data-id='{{id}}' data-status='TODO'>To do</a>"
                + "<a class='btn btn-default btn_status' href='#' data-id='{{id}}' data-status='DONE'>Done</a>"
                + "<a class='btn btn-default btn_status' href='#' data-id='{{id}}' data-status='ARCHIVE'>Archive</a>"
                + "<a class='btn btn-default btn_status btn-warning' href='#' data-id='{{id}}' data-status='DELETE'>Delete</a>"
                + "</div><br><br>";
            var sortOrderButtons = "Priority"
                + "<div class='clearfix'></div><div class='clearfix btn-group'>"
                + "<a class='btn btn-default btn_status' href='#' data-id='{{id}}' data-sortorder='1'>1</a>"
                + "<a class='btn btn-default btn_status' href='#' data-id='{{id}}' data-sortorder='2'>2</a>"
                + "<a class='btn btn-default btn_status' href='#' data-id='{{id}}' data-sortorder='3'>3</a>"
                + "<a class='btn btn-default btn_status' href='#' data-id='{{id}}' data-sortorder='4'>4</a>"
                + "<a class='btn btn-default btn_status' href='#' data-id='{{id}}' data-sortorder='5'>5</a>"
                + "</div><br><br>";
            return statusButtons + sortOrderButtons;
        };
        return TaskSetStatusView;
    }());
    WB.TaskSetStatusView = TaskSetStatusView;
    var TaskMoreBarView = /** @class */ (function () {
        function TaskMoreBarView() {
        }
        TaskMoreBarView.setData = function (data) {
            data.trashview = WB.BoardTrashView.getHtml();
            return data;
        };
        TaskMoreBarView.render = function (data) {
            this.setData(data);
            return App.ViewEngine.renderview(this.getTemplate(), this.setData(data));
        };
        TaskMoreBarView.setEvents = function () { };
        TaskMoreBarView.getHtml = function (data) {
            this.setData(data);
            return this.render(data);
        };
        TaskMoreBarView.getTemplate = function () {
            return "<div data-id=0 id='TaskMoreBarView' class='taskmoreviewbar'><strong>Task Bar</strong>"
                + " <a class = 'btntaskedit' alt='view and edit details' href='#'><i class='icon-edit'></i> edit</a>"
                + "  <a class = 'btntaskaddlog' alt='add log' href='#'><i class='icon-th-list'></i> add log</a>"
                + " <a class = 'btntaskarchive' alt='archive of the board' href='#'><i class='icon-folder-close'></i> archive</a>"
                + " <a class = 'btntaskclose' alt='close this' href='#' ><i class='icon-remove'></i> close </a>"
                + " <a class = 'btntaskdelete' alt='delete' href='#'><i class='icon-trash'></i> delete</a>"
                + " </div >";
        };
        return TaskMoreBarView;
    }());
    WB.TaskMoreBarView = TaskMoreBarView;
    var Task = /** @class */ (function () {
        function Task(id, nameof, textof, story_id, status, sort_order, isEditable, css_class, user_id, showUser, fuzzyModified, display_name, date_modified, note_count, log_notes) {
            this.id = id;
            this.nameof = nameof;
            this.textof = textof;
            this.story_id = story_id;
            this.status = status;
            this.sort_order = sort_order;
            this.isEditable = isEditable;
            this.css_class = css_class;
            this.user_id = user_id;
            this.showUser = showUser;
            this.fuzzyModified = fuzzyModified;
            this.display_name = display_name;
            this.date_modified = date_modified;
            this.note_count = note_count;
            this.log_notes = log_notes;
        }
        return Task;
    }());
    WB.Task = Task;
})(WB || (WB = {}));
