
/// <reference path="../libs/all.d.ts" />
/// <reference path="ScrumboServerClient.ts" />
/// <reference path="WB.Storage.ts" />

declare var window : Window;

module WB {
    /*
    =========================================================================================
    */
    export class StoryController {
        static STORY_GET(id: string) {
            var client = new ScrumboServerClient();
            var action = client.CallMethod("StoryGet", { id: id });
            $.when(action).then(resp => StoryEditView.render(resp));
        }

        static STORY_ADD_TO_BOARD(boardid: string) {
            StoryAddView.render(boardid);
        }

        static STORY_DELETE(storyId) {
            StoryDeleteView.render({ id: storyId });
        }
    }

/* 
    =========================================================================================
    */
    export class StoryView {
        static render(data) {

            this.setStatus(data);
            App.ViewEngine.renderview(this.getTemplate(), data);
        }

        static munged(data, boardhash): string {
            data.board_hash = boardhash;
            data.textof = App.GlobalCommon.uiify(data.textof);
            this.setStatus(data);
            return App.ViewEngine.getHtml(this.getTemplate(), data);
        }

        static setStatus(data) {
            if (data && !data.status) {
                data.status = "TODO";
            }
        }

        static getTemplate(): string {
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
        }
    }

/*
    =========================================================================================
    */
    export class StoryDeleteView {
        static render(data) {
            App.ViewEngine.renderview(this.getTemplate(), data);
            $("#btnsubmit").on("click", (e) => {
                e.preventDefault();
                var data = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new ScrumboServerClient();
                var act = client.CallMethod("StoryDelete", data);
                $.when(act).then(resp => window.history.back());
            });
        }

        static getTemplate() {
            var id = App.GlobalCommon.inputstring("id", "id", "{{id}}", "", "hidden");
            var hash = App.GlobalCommon.inputstring("hash", "hash", "{{hash}}", "", "hidden");
            var form = App.GlobalCommon.form("Delete Story?", hash + id);
            return form;
        }
    }

/*
    =========================================================================================
    */
    export class StoryChangeStatusView {
        private static render(data: any) {

            $("body").off("click").on("click", ".btn_status", (e) => {
                e.preventDefault();
                var id = $(e.target).attr("data-id");
                var status = $(e.target).attr("data-status");
                var client = new ScrumboServerClient();
                var act = client.CallMethod("StorySetStatus", { id: id, status: status });
                $.when(act).then((resp) => {
                        $("#BoardChangeStatusView").prepend("<div id=changeOk class='alert alert-success'>Done, going back to board...</div>")
                            .fadeOut()
                            .fadeIn();
                        setTimeout(() => window.history.back(), 3000);
                    }
                );
            });

            return App.ViewEngine.renderview(this.getTemplate(), data);
        }

        static getHtml(data) {
            return this.render(data);
        }

        static getTemplate() {
            var form = "<div id='BoardChangeStatusView'><h3>Story Status</h3>"
                + " <div class=''>CURRENT: {{status}}</div>"
                + "<br><br>Change to : <br>"
                + " <a class='btn btn-primary btn_status' data-id='{{id}}' data-status='TODO' href='#'>To Do</a>"
                + " <a class='btn btn-primary btn_status' data-id='{{id}}' data-status='INPROGRESS' href='#'>In Progress</a>"
                + " <a class='btn btn-primary btn_status' data-id='{{id}}' data-status='DONE' href='#'>Done</a>"
                + " <a class='btn btn-primary btn_status' data-id='{{id}}' data-status='ARCHIVE' href='#'>Archive</a>"
                + "</div>";
            return App.GlobalCommon.container(form);
        }
    }

    /*
    =========================================================================================
    */
    export class StoryEditView {
        static render(data) {
            var setstatus = StoryChangeStatusView.getHtml(data);

            var wrapper = `<div class=form-wrap>${this.getTemplate()}${setstatus}</div>`;
            App.ViewEngine.renderview(wrapper, data);
            $("#btnsubmit").off("click").on("click", (e) => {
                e.preventDefault();
                $(e.target).attr("disabled", "disabled");
                var form = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new ScrumboServerClient();
                var act = client.CallMethod("StoryUpdateText", form);
                $.when(act).then(resp => App.GlobalCommon.processPostBack(resp, $("#form1"), window.history.back()));
            });
        }

        static getTemplate() {
            var textof = App.GlobalCommon.textarea("textof", "textof", "{{textof}}", "", "4");
            var id = App.GlobalCommon.inputstring("id", "id", "{{id}}", "", "hidden");
            var form = App.GlobalCommon.form("<h2><span class='glyphicon glyphicon-edit'></span> Story Details</h2>", textof + id);
            return App.GlobalCommon.container(form);
        }
    }

/*
    =========================================================================================
    */
    export class StoryAddView {
        static render(hash: string) {
            App.ViewEngine.renderview(this.getTemplate(hash), {});

            $("#btnsubmit").off("click").on("click", (e) => {
                e.preventDefault();
                $(e.target).attr("disabled", "disabled");
                var data = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new ScrumboServerClient();
                var act = client.CallMethod("StoryAddToBoard", data);
                $.when(act).then(resp => App.GlobalCommon.processPostBack(resp, $("#form1"), window.history.back()));
            });
        }

        static getTemplate(hash: string) {
            var nameof = App.GlobalCommon.textarea("textof", "textof", "", "", "4");
            var hash = App.GlobalCommon.inputstring("hash", "hash", hash, "", "hidden");
            var form = App.GlobalCommon.form("<h2><span class='glyphicon glyphicon-leaf'></span> Add Story to board</h2>", nameof + hash);
            return App.GlobalCommon.container(form);
        }
    }

/*
    =========================================================================================
    */
    export class Story {
        constructor(
            public id: number,
            public priority: number,
            public textof: string,
            public sort_order: number,
            public status: string
        ) {}
    }

}