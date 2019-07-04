/// <reference path="WB.BoardClasses.ts" />
/// <reference path="scrumboserverclient.ts" />
/// <reference path="../libs/all.d.ts" />

declare var window: Window;

module WB {
    /*
    =========================================================================================
    */
    export class TaskController {
        static TASK_ADD_TO_STORY(id, hash) {
            TaskAddView.render(
                { id: id, hash: hash }
            );

            $("#btnsubmit").off("click").on("click", (e) => {
                e.preventDefault();
                $(e.target).attr("disabled", "disabled");
                this.submitForm();
            });
        }

        static submitForm() {
            var form = App.GlobalCommon.getFormInputs($("#form1"));
            var client = new ScrumboServerClient();
            var servertask = client.CallMethod("TaskAddToStory", form);
            $.when(servertask).then(resp => {
                App.GlobalCommon.processPostBack(resp, $("#form1"), () => window.history.back());
            });
        }

        static TASK_MOVE(data: any): void {
            var client = new ScrumboServerClient();
            client.CallMethod("TaskMove", data);
        }

        static TASK_UPDATE_STATUS(data: any): void {
            var client = new ScrumboServerClient();
            client.CallMethod("TaskUpdateStatus", data);
        }

        static TASK_DELETE(deleteData: any) {
            TaskDeleteView.render(deleteData);
        }

        static TASK_GET(id: string) {
            var client = new ScrumboServerClient();
            var serverData = client.CallMethod("TaskGet", { id: id });
            $.when(serverData).then(resp => TaskEditView.render(resp));
        }

        static TASK_ADD_LOG() {
        }

        static validate(data) {
            if (data.IsValid !== "undefined" && data.IsValid === false) {
                App.GlobalCommon.apply_validation(data, $("#form1"));
            } else {
                window.history.back();
            }
        }

        static TASK_DELETE_REPLY(data) {
            window.history.back();
        }
    }

    export class TaskMenuView {
        static getHtml(task: Task): string {
            return App.ViewEngine.getHtml(this.getTemplate(), task);
        }

        static getTemplate(): string {
            return "<div class='taskmenu' data-id={{id}}>"
                + "<a href='#' class='act'>Edit</a>"
                + "<a href='#' class='act'>Add Log</a>"
                + "<a href='#' class='act'>Add File</a>"
                + "<a href='#' class='act'>Archive</a>"
                + "<a href='#' class='act'>Delete</a>"
                + "</div>";
        }

        static render(task) {
            App.ViewEngine.renderview(this.getTemplate(), task);
        }
    }

    export class LogNote {
        constructor(
            public textof: string
        ) {}
    }

    export class LogNoteRowView {
        static render(note: LogNote) {
            return App.ViewEngine.renderview(LogNoteRowView.getTemplate(), note);
        }

        static getHtml(note: LogNote) {
            return App.ViewEngine.getHtml(LogNoteRowView.getTemplate(), note);
        }

        static getTemplate(): string {
            return "<div class='lognoterow'><span class='glyphicon glyphicon-pencil'>&nbsp;</span><span class='lognote'>{{textof}}</span></div>";
        }
    }

    export class TaskView {
        static adjustModel(task: Task): Task {
            if (!task.css_class) task.css_class = "task";
            task.isEditable = task.status === "TODO";
            task.showUser = (task.user_id > 0);
            task.fuzzyModified = moment.utc(task.date_modified).fromNow();
            task.textof = App.GlobalCommon.uiify(task.textof);
            return task;
        }

        static render(task: Task) {
            this.adjustModel(task);
            App.ViewEngine.renderview(this.getTemplate(task), task);
        }

        static getHtml(task: Task): string {
            this.adjustModel(task);
            //task["archivelink"] = task.status === 'DONE' ? "<br><a class='btn btn_status btn-xs'  alt='Archive this task' href='#' data-status='ARCHIVE' data-id='{{id}}'>archive</a>" : ""
            return App.ViewEngine.getHtml(this.getTemplate(task), task);
        }

        // static tmpl : string;

        static getTemplate(task: Task): string {

            var tmpl = "";
            var logNoteRow = LogNoteRowView.getTemplate();
            var archive = task.status === "DONE" ? "<br><a class='btn btn_status btn-xs'  alt='Archive this task' href='#' data-status='ARCHIVE' data-id='{{id}}'>archive >></a>" : "";
            var tmpl = `<div class='task {{css_class}} clearfix' data-id='{{id}}' data-status='{{status}}'><div class='ttext'>  {{&textof}} <span class='more'>[more...]</span>${archive}<div class=lognotes>{{#log_notes}}${logNoteRow}{{/log_notes}}</div><div class='task-foot clearfix'>---<br><span class=''>#{{id}}</span> changed <span>{{fuzzyModified}} by {{display_name}}</span><span class='usercss_{{user_id}}'></span> <a data-id={{id}} class='taskmore' alt='View taskbar' href='#task/{{id}}'>[edit]</a> <a data-id={{id}} class='addlog' alt='Add a task comment' href='#'>[add notelog]</a>   <a data-id={{id}} class='' alt='View Task Log' href='#task/{{id}}/log'>[see {{note_count}} in note log]</a> </div></div></div>`;
            return tmpl;
        }
    }

    export class TaskDeleteView {
        static render(id: any) {
            App.ViewEngine.renderview(this.getTemplate(), { id: id });
            $("#btnsubmit").on("click", (e) => {
                e.preventDefault();
                var form = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new ScrumboServerClient();
                var servertask = client.CallMethod("TaskDelete", form);
                $.when(servertask).then(resp => {
                    App.GlobalCommon.processPostBack(resp, $("#form1"), () => window.routie(`board/${amplify.store("last_board_hash")}`));
                });
            });
        }

        static getTemplate() {
            var id = App.GlobalCommon.inputstring("id", "id", "{{id}}", "", "hidden");
            var form = App.GlobalCommon.form("<h2><span class='glyphicon glyphicon-trash'></span> Delete Task</h2>", id + " <span class='label label-danger'>Warning</span> <span>Pressing Submit will delete the task and any associated objects permenantly.</span><br><br>");
            return App.GlobalCommon.container(form);
        }
    }

    export class TaskAddLogView {
        static render(data) {
            App.ViewEngine.renderview(this.getTemplate(), data);
        }

        static getHtml(data) {
            return App.ViewEngine.getHtml(this.getTemplate(), data);
        }

        static getTemplate() {
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
        }
    }

    export class TaskAddView {
        static render(taskViewData: any): void {
            App.ViewEngine.renderview(this.getTemplate(), taskViewData);
        }

        static getTemplate() {
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
        }
    }

    export interface IView {
        render(data: any);
        registerEvents(): void;
        getHtml(): string;
    }

    export class TaskEditView implements IView {
        render(data: any) {
        }

        registerEvents() {
        }

        getHtml(): string {
            return "";
        }

        static render(taskViewData: any) {
            var html = App.ViewEngine.renderview(this.getTemplate(taskViewData), taskViewData);
            $(`input:radio[value=${taskViewData.css_class}]`).first().attr("checked", "checked");

            $("#btnsubmit").on("click", e => {
                e.preventDefault();
                $(e.target).attr("disabled", "disabled");
                var data = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new ScrumboServerClient();
                var servertask = client.CallMethod("TaskUpdateText", data);
                $.when(servertask).then(resp => {
                    App.GlobalCommon.processPostBack(resp, $("#form1"), () => window.history.back());
                });
            });
            return html;
        }

        static getTemplate(data) {
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
        }
    }

    export class TaskSetStatusView {
        static getHtml(data) {
            this.init(data);
            return App.ViewEngine.getHtml(this.getTemplate(), data);
        }

        static init(data) {
            $("body").off("click").on("click", ".btn_status", e => {
                e.preventDefault();
                var status = $(e.target).attr("data-status");
                var sort_order = $(e.target).attr("data-sortorder");
                var id = $(e.target).attr("data-id");
                var data = { status: status, sort_order:sort_order,  id: id };
                

                var method = status && status == "DELETE" ? "TaskDelete" : status ? "TaskUpdateStatus" : sort_order ? "TaskUpdateSortOrder" : ""

                var client = new ScrumboServerClient();
                client.CallMethod(method, data);
                window.history.back();
            });
        }

        static render(data) {
            this.init(data);
            return App.ViewEngine.renderview(this.getTemplate(), data);
        }

        static getTemplate() {

        

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
        }
    }

    export class TaskMoreBarView {
        static setData(data: any) {
            data.trashview = BoardTrashView.getHtml();
            return data;
        }

        static render(data: any) {
            this.setData(data);

            return App.ViewEngine.renderview(this.getTemplate(), this.setData(data));
        }

        static setEvents() {}

        static getHtml(data) {
            this.setData(data);

            return this.render(data);
        }

        static getTemplate() {
            return "<div data-id=0 id='TaskMoreBarView' class='taskmoreviewbar'><strong>Task Bar</strong>"
                + " <a class = 'btntaskedit' alt='view and edit details' href='#'><i class='icon-edit'></i> edit</a>"
                + "  <a class = 'btntaskaddlog' alt='add log' href='#'><i class='icon-th-list'></i> add log</a>"
                + " <a class = 'btntaskarchive' alt='archive of the board' href='#'><i class='icon-folder-close'></i> archive</a>"
                + " <a class = 'btntaskclose' alt='close this' href='#' ><i class='icon-remove'></i> close </a>"
                + " <a class = 'btntaskdelete' alt='delete' href='#'><i class='icon-trash'></i> delete</a>"
                + " </div >";
        }
    }

    export class Task {
        constructor(
            public id: number,
            public nameof: string,
            public textof: string,
            public story_id: number,
            public status: string,
            public sort_order: string,
            public isEditable: boolean,
            public css_class: string,
            public user_id: number,
            public showUser: boolean,
            public fuzzyModified: string,
            public display_name: string,
            public date_modified: string,
            public note_count: number,
            public log_notes: any[]
        ) {}
    }
}