

declare var window: Window;

module WB {
    export class Board {
        constructor(
            public id: string,
            public sort_order: number,
            public nameof: string,
            public columns?: string[],
            public stories?: Story[],
            public tasks?: Task[]
        ) {
        }
    }

    export class BoardSummary {
        constructor(
            public id: number,
            public nameof: string
        ) {
        }
    }

    export class BoardController {
        static BOARDS_LIST() {
            var boards: Board[] = [];
            var client = new ScrumboServerClient();
            var action = client.CallMethod("BoardsList", {});

            
            $.when(action).then(resp => {
                console.log(resp)
                BoardsView.render(resp)}
            );
        }

        static BOARD_ADD() {
            BoardAddView.render();
        }

        static BOARD_DELETE(hash: string) {
            DeleteBoardView.render(hash);
        }

        static BOARD_GET(hash: string) {
            var client = new ScrumboServerClient();
            var req1 = client.CallMethod("BoardGetByHash", { hash: hash });
            $.when(req1).then(resp1 => {
                // var accountClient = new Account.AccountClient();
                // var req2 = accountClient.CallMethod("GetUsersById", { id_list: Enumerable.From(resp1.tasks).Select(t => t.user_id).Distinct().ToArray().join(",") });
                var req2 = client.CallMethod("GetUsersById", { id_list: Enumerable.From(resp1.tasks).Select(t => t.user_id).Distinct().ToArray().join(",") });
                $.when(req2).then(resp2 => this.HandleBoardResponse(resp1, resp2));

                // remove to no user board
                // this.HandleBoardResponse(resp1, [1]);  
            });
        }

        static BOARD_GET_SIMPLE(hash: string) {
            var client = new ScrumboServerClient();
            var req1 = client.CallMethod("BoardGetByHash", { hash: hash }); //var getUsers = () => 


            $.when(req1).then(resp1 => {
                // var accountClient = new Account.AccountClient();
                var req2 = client.CallMethod("GetUsersById", { id_list: Enumerable.From(resp1.tasks).Select(t => t.user_id).Distinct().ToArray().join(",") });
                $.when(req2)
                    .then(
                        resp2 => this.HandleBoardResponse(resp1, resp2, "simple"));
            });
        }

        static BOARD_GET_LIST(hash: string) {
            var client = new ScrumboServerClient();
            var req1 = client.CallMethod("BoardGetByHash", { hash: hash }); //var getUsers = () => 


            $.when(req1).then(resp1 => {
                // var accountClient = new Account.AccountClient();
                var req2 = client.CallMethod("GetUsersById", { id_list: Enumerable.From(resp1.tasks).Select(t => t.user_id).Distinct().ToArray().join(",") });
                $.when(req2)
                    .then(
                        resp2 => this.HandleBoardResponse(resp1, resp2, "list"));
            });
        }

        static HandleBoardResponse(boardresp, usersresp, viewtype?: string) {
            var vdata = boardresp;
            vdata.users = usersresp.user_list;
            if (vdata.board) {
                if (viewtype=="simple") {
                    BoardViewSimple.render(vdata);
                    return true;
                } 
                if (viewtype=="list") {                                   
                    BoardViewList.render(vdata);
                    return true;
                } 
               
                return BoardView2.render(vdata)
             }
        }

        static BOARD_DELETE_REPLY() {

        }

        static BOARD_GET_CONFIGURATION(hash) {
            var client = new ScrumboServerClient();
            var action = client.CallMethod("BoardGetConfiguration", { hash: hash });
            $.when(action).then(resp => BoardConfigView.render(resp));
        }

        static BOARD_GET_ARCHIVE(hash) {
            var client = new ScrumboServerClient();
            var act = client.CallMethod("BoardGetArchiveByHash", { hash: hash });
            $.when(act).then(resp => BoardArchiveView.render(resp));
        }

        static USER_ADD_SHARED_BOARD(data) {
            AddSharedBoardView.render();
        }
    }

    /*
    =========================================================================================
    */

    export class BoardViewSimple {
        static render(data) {
            App.ViewEngine.renderview(this.getTemplate(data), data);
        }

        static getTemplate(data) {
            var lines = [];
            lines.push("<div class='container'>");
            lines.push("<h2>{{board.nameof}}</h2>");
            lines.push("<h3>{{&board.more_info}}</h3>");
            lines.push("<ul>");
            Enumerable.From(data.columns).ForEach(col => {
                lines.push(`<h4>${col}</h4>`);
            });
            Enumerable.From(data.stories).OrderBy((s: Story) => s.sort_order).ForEach((story: Story) => {
                lines.push(`<li><h4>#${story.id} ${story.textof}</h4></li>`);
                lines.push("<ul>");
                Enumerable.From(data.tasks).Where((t: Task) => t.story_id === story.id).OrderBy((t: Task) => t.sort_order).ForEach((t: Task) => {
                    var user = BoardView2.findUser(t.user_id, data.users);
                    t.display_name = user.display_name;
                    lines.push(`<li>${t.status.toLocaleUpperCase()} ${t.textof} by ${user.display_name}</li>`);
                });
                lines.push("</ul>");
            });
            lines.push("</ul>");
            lines.push("</div>");
            return lines.join("");
        }

    }

    export class BoardViewList {
        static render(data) {

            App.ViewEngine.renderview(this.getTemplate(data), data);
            
            
            $(".status").off("change").on("change", e => {
                //e.preventDefault()
                console.log($(e.currentTarget).val())
            })
        }

        static getTemplate(data) {
            var lines = [];

            lines.push("<div>");
            lines.push("<h1>{{board.nameof}}<h1>");
            lines.push("<table class='table table-condensed table-bordered'>");

            Enumerable.From(data.tasks).OrderBy((t: Task) => t.sort_order).ForEach((t: Task) => {

                    var story: Story = Enumerable.From(data.stories).First((s: Story) => t.story_id === s.id)


                    // var select = []
                    // select.push("<select class=status>")
                    // Enumerable.From(data.columns).ForEach((col:string)=>{
                    //     var selected = (col == t.status) ? "selected" : ""
                    //     select.push(`<option ${selected}>${col}</option>`)
                    // })
                    // select.push("</select") 

                   // lines.push(`<tr> <td><input type=text name=textof class=textof value='${t.textof}'/></td> <td>${select.join("")}</td></tr>`);

      
                lines.push(`<tr>`);
                lines.push(`<td>${story.textof}</td>`);
                lines.push(`<td>${t.textof}</td>`);
                lines.push(`<td>${t.status}</td>`);
                lines.push(`<td>${t.sort_order}</td>`);
                lines.push(`<td><a href=#task/${t.id} class='btn btn-default btn-xs'>edit</a></td>`);
                lines.push(`</tr>`);
            });

            lines.push("</table>");

            lines.push("</div>");
            return lines.join("");


        }
    }

    export class BoardView2 {
        static findUser(id, users) {

            for (var i = 0; i < users.length; i++) {
                if (users[i].id === id) {
                    return users[i];
                }
            }
            return { display_name: "unknown" };
        }

        static render(data: any): void {
            amplify.store("last_board_hash", data.board.hash);
            $("#custom_css").remove();
            if (data.board.custom_css) {
                $("link").last().after(`<style id=custom_css>${data.board.custom_css}</style>`);
            };


            if (data.board.extra_status_2)
                data.columns.splice(2, 0, data.board.extra_status_2);
            if (data.board.extra_status_1)
                data.columns.splice(2, 0, data.board.extra_status_1);

            var rows = "";
            Enumerable.From(data.stories).OrderBy((s: Story) => s.sort_order).ForEach((story: Story) => {
                rows += `<tr data-storyid=${story.id}>`;
                rows += `<td valign=top align=center>${StoryView.munged(story, data.board.hash)}</td>`;
                Enumerable.From(data.columns).ForEach((col, idx) => {
                    rows += `<td valign=middle align=center><div class='tasks' data-storyid='${story.id}' data-status='${col}'>`;
                    Enumerable.From(data.tasks).OrderBy((t: Task) => t.sort_order).ForEach((t: Task) => {
                        if (t.story_id === story.id && t.status === col) {
                            var user = this.findUser(t.user_id, data.users);
                            t.display_name = user.display_name;
                            t.log_notes = Enumerable.From(data.log_notes).Where(ln => ln.task_id == t.id).ToArray();

                            rows += TaskView.getHtml(t);
                        }
                    });
                    rows += "</div></td>";
                });
                rows += "</tr>";
            });

            if (data.stories.length < 6) {
                Enumerable.RangeTo(data.stories.length, 5).ForEach(i => {
                    rows += "<tr>";
                    Enumerable.RangeTo(0, data.columns.length).ForEach(i => {
                        rows += "<td></td>";
                    });
                    rows += "</tr>";
                });
            }
            data.rowsHtml = rows;

            var toolbar = App.ViewEngine.getHtml(this.getToolBarTemplate(), data);
            var takmoreView = TaskMoreBarView.getHtml({ id: 0 });
            TaskMoreBarView.setEvents();
            App.ViewEngine.renderview(this.getTemplate(), data);


            $("#board").append(toolbar);
            $("#board").before(takmoreView);
            this.makeTasksSortable();
            this.makeStoriesSortable();
            this.makeTaskArchivable(true);
            this.addtaskloglistener();
            this.addtaskExpandListener();
            this.resizetasks();
        }

        static addLog(e) {
            e.preventDefault();
            var taskId = $("#addlogid").val();
            var textof = $(".addlogview #textof").val();
            var storyId = $(e.currentTarget).first().closest(".tasks").attr("data-storyid");
            var boardId = $("#board").attr("data-id");
            var client = new ScrumboServerClient();
            client.CallMethod("InsertLogItem", { board_id: boardId, story_id: storyId, id: taskId, textof: textof, action: "NOTE" });
        }

        static timerids = [];

        static addtaskloglistener() {
            $(".addlog").off("click").on("click", e => {
                e.preventDefault();
                $(".addlogview").remove();
                $(".addlog").show();
                var id = $(e.currentTarget).attr("data-id");
                var view = TaskAddLogView.getHtml({ id: id });
                var target = $(e.currentTarget);
                var task = target.closest(".task");
                var lognotes = task.find(".lognotes").first();
                task.after(view);
                $("#textof").focus();

                $("#btnaddlog").off("click").on("click", e => {
                    e.preventDefault();
                    var taskId = $("#addlogid").val();
                    var textof = $(".addlogview #textof").val();
                    var storyId = $(e.currentTarget).first().closest(".tasks").attr("data-storyid");
                    var boardId = $("#board").attr("data-id");
                    var client = new ScrumboServerClient();
                    var act = client.CallMethod("InsertLogItem",
                    {
                        board_id: boardId,
                        story_id: storyId,
                        id: taskId,
                        textof: textof,
                        action: "29"
                    });
                    $.when(act).then(() => {

                        var logNoteRow = LogNoteRowView.getHtml(new LogNote(textof));
                        lognotes.prepend(logNoteRow);
                        $(".addlogview").fadeOut();
                    });
                });
                App.GlobalCommon.clearTimers();
                var timerid = setTimeout(() => $(".addlogview").remove(), 60000);
                App.GlobalCommon.timers.push(timerid);
            });
        }


        static addtaskExpandListener() {
            $(".task .more").off("click").on("click", e => {
                e.preventDefault();
                var task = $(e.currentTarget).closest(".task");
                var foot = task.find(".task-foot").first();
                var height = task.height();
                foot.slideDown();
                var timedfunc = (task) => {
                    task.css({ height: height });
                    $(".task-foot").slideUp();
                };
                setTimeout(() => timedfunc(task), 60000);
            });
        }

        static resizetasks() {
            var tasks = $(".task");
            var width = tasks.first().width();
            var larger = width * 1.6;
            Enumerable.From(tasks).ForEach((t: Task) => {
                var ttext = $(t).find(".ttext");
                var length = ttext.text().length;
                if (length > 200) {
                    $(t).width(larger);
                }

            });
        }

        static makeTasksSortable() {
            var tasklists = $(".tasks");
            tasklists.sortable(<SortableOptions>{
                connectWith: ".tasks",
                cursor: "move",
                placeholder: "hover",
                distance: 1,
                tolerance: "pointer",
                start: (event, ui) => {
                    var id = $(ui.item).attr("data-id");
                    var tasks = $(ui.item).parent();
                    var storyId = tasks.attr("data-storyid");
                    var status = tasks.attr("data-status");
                    var startIndex = ui.item.index();
                    var startData = "" + storyId + status + startIndex;
                    // create a key to determin current state so as not to update unecessarily
                    tasks.attr("data-start_data", startData);
                },
                stop: (event, ui) => {
                    var tasks = $(ui.item).parent();
                    var boardId = $("#board_id").val();
                    var tasksAll = tasks.find(".task");
                    var storyId = tasks.attr("data-storyid");
                    var status = tasks.attr("data-status");
                    var id = $(ui.item).attr("data-id");
                    var newIndex = ui.item.index();
                    // read start data to determin id a server method needs to be sent
                    var startData = tasks.attr("data-start_data");
                    var newData = "" + storyId + status + newIndex;
                    if (newData === startData) {
                        return;
                    } else {
                        if (status === "archive") {
                            TaskController.TASK_UPDATE_STATUS({ id: id, status: "archive" });
                            return;
                        }

                        var taskOrdering = Enumerable.From(tasksAll).Select((t: Task) => { return +$(t).attr("data-id"); }).ToArray();

                        TaskController.TASK_MOVE({
                            board_id: boardId,
                            story_id: storyId,
                            id: id,
                            status: status,
                            task_ordering: taskOrdering
                        });
                    }
                }
            }).disableSelection();
        }

        static makeStoriesSortable() {
            if (!document.hasOwnProperty("ontouchend")) {
                $("#board tbody").sortable(<SortableOptions>{
                    placeholder: "hover",
                    cursor: "move",
                    stop: (event, ui) => {
                        var stories = $(ui.item).parent();
                        var stories_all = stories.find(".story");
                        var id = $(ui.item).attr("data-storyid");
                        var story_order = Enumerable.From(stories_all).Select((s: Story) => {
                                return +$(s).attr("data-id");
                            })
                            .ToArray();

                        var data = { id: id, story_order: story_order };
                        var client = new ScrumboServerClient();
                        client.CallMethod("BoardSortStory", data);
                    }
                });
            }
        }

        static makeTaskArchivable(removeAfter: boolean) {
            $("body").off("click", ".btn_status").on("click", ".btn_status", e => {
                e.preventDefault();
                var status = $(e.target).attr("data-status");
                var id = $(e.target).attr("data-id");
                var data = { status: status, id: id };
                var client = new ScrumboServerClient();
                var act = client.CallMethod("TaskUpdateStatus", data);
                $.when(act).then(resp => {

                    if (removeAfter) {
                        var selector = $(`.task[data-id='${id}']`); // $(selector).fadeOut()
                        selector.css({
                                position: "absolute",
                                'z-order': 1000
                            })
                            .animate(
                            { 'margin-left': "3000px" }, 2000, () => selector.remove());
                    } else {
                        window.location.reload();
                    }
                });
            });
        }

        static getTemplate() {

            if (this.hasOwnProperty("tmpl")) {

            } else {
                var lines = [];
                lines.push("<table width=100%>");
                lines.push("<tr>");
                lines.push("<td>");
                lines.push("<div class='board-header'><h2 class='board-name'><span class='board-title'>{{board.nameof}}</span></h2>");
                lines.push("<div class='board-moreinfo'>{{&board.more_info}}</div>");
                lines.push("</div></td>");
                lines.push("<td align=right>");
                lines.push("<div class='pagination-right'>");
                lines.push("<a href='#boards' class='btn btn-default btn-xs'>All Boards</a>");
                lines.push(" <a href='#board/{{board.hash}}/list' class='btn btn-default btn-xs'>List View</a> ");
                lines.push(" <a href='#board/{{board.hash}}/config' class='btn btn-default btn-xs'>Configure</a> ");
                lines.push(" <a  href='#board/{{board.hash}}/archive' class='btn btn-default btn-xs'>Archive</a> ");
                lines.push("</div>");
                lines.push("</td>");
                lines.push("</tr>");
                lines.push("</table>");
                lines.push("<table id='board' class='table' align=center data-id={{board.hash}}>");
                lines.push("<thead>");
                lines.push("<th>Story <a class='btn btn-default btn-xs' href='#board/{{board.hash}}/addstory'>Add</a></th>");
                lines.push("{{#columns}}<th>{{.}}</th>{{/columns}}");
                lines.push("</tr>");
                lines.push("</thead>");
                lines.push("<tbody>");
                lines.push("{{&rowsHtml}}");
                lines.push("</tbody>");
                lines.push("</table>");
                lines.push("{{&board.taskMoreBarViewHtml}}");
                lines.push("<input type=hidden id=board_id value='{{board.hash}}'></input>");
                this["tmpl"] = lines.join("");
            }
            return this["tmpl"];
        }

        static getToolBarTemplate() {
            return "<div>"
                //+ " <a href='#board/{{board.hash}}/config'>Configure</a> "
                //+ " <a  href='#board/{{board.hash}}/archive'>Archive</a> "
                //+ " <a  href='#board/{{board.slug}}/{{board.hash}}'>Link</a>"
                + "</div>";
        }
    }

    /*
    =========================================================================================
    */
    export class BoardConfigView {
        static render(boardConfigData: any) {
            App.ViewEngine.renderview(this.getTemplate(), boardConfigData);
            $("#btnsubmit").off("click").on("click", (e: any) => {
                e.preventDefault();
                var formdata = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new ScrumboServerClient();
                var act = client.CallMethod("BoardSetConfiguration", formdata);
                $.when(act).then(resp => App.GlobalCommon.processPostBack(resp,
                    $("#form1"),
                    window.history.back()));
            });
        }

        static getTemplate(): string {
            var nameof = App.GlobalCommon.inputstring("nameof", "nameof", "{{board.nameof}}", "The name of the board", "text"); // var top = App.GlobalCommon.inputstring('top_status', 'top_status', '{{board.top_status}}', 'Status for the top section', 'text')
            var info = App.GlobalCommon.textarea("more_info", "more_info", "{{board.more_info}}", "Extra infomation to be displayed.", "5");
            var custom_css = App.GlobalCommon.textarea("custom_css", "custom_css", "{{board.custom_css}}", "The Custom css values.", "5");
            var status1 = App.GlobalCommon.inputstring("extra_status_1", "extra_status_1", "{{board.extra_status_1}}", "Status Column 1 after between inprogress and done.", "text");
            var status2 = App.GlobalCommon.inputstring("extra_status_2", "extra_status_2", "{{board.extra_status_2}}", "Status Column 2 after between inprogress and done.", "text");
            var hash = App.GlobalCommon.inputstring("hash", "hash", "{{board.hash}}", "", "hidden");
            return App.GlobalCommon.container(`<h2><span class='glyphicon glyphicon-cog'></span> Board Configuration</h2><a class-'btn btn-link' href='#board/{{board.hash}}/delete'>Delete board</a><hr>${App.GlobalCommon.form("Board Details", nameof + info + status1 + status2 + custom_css + hash)}`);
        }
    }


    /*
    =========================================================================================
    */
    export class BoardTrashView {
        static render() {
            this.registerEvents();
            App.ViewEngine.renderview(this.getTemplate(), {});
        }

        static getHtml() {
            return this.getTemplate();
        }

        static registerEvents() {

        }

        static getTemplate() {
            this.registerEvents();
            return "<div class='trash'><img src='/img/trash.png'/></div>";
        }
    }

    /*
    =========================================================================================
    */
    export class BoardAddView {

        private static getFormInputsAsObject(): any {
            var form = $("#form1");
            return App.GlobalCommon.getFormInputs(form);
        }

        static render(): void {
            App.ViewEngine.renderview(this.getTemplate(), {}); //events
            var submitbtn = $("#btnsubmit");
            var hash = $("#hash");

            submitbtn.on("click", (e: any) => {
                e.preventDefault();
                hash.val(App.GlobalCommon.createUUID(12, 36));
                var data = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new ScrumboServerClient();
                var act = client.CallMethod("BoardAdd", data);
                $.when(act).then(resp => App.GlobalCommon.processPostBack(resp, $("#form1"), () => window.history.back()));
            });
        }

        static getTemplate(): string {
            var nameof = App.GlobalCommon.inputstring("nameof", "nameof", "", "The name of the board", "text");
            var hash = App.GlobalCommon.inputstring("hash", "hash", App.GlobalCommon.createUUID(12, 36), "", "hidden");
            var form = App.GlobalCommon.form("<h2>Add a board</h2><hr>", nameof + hash);
            return App.GlobalCommon.container(form);
        }
    }


    /*
     =========================================================================================
     */
    export class BoardsView {
        static render(data: any): void {
            App.ViewEngine.renderview(this.getTemplate(), data);
            this.registerEvents();
        }

        static registerEvents() {
            if (!document.hasOwnProperty("ontouchend")) {
                var boardrows = $("#boards tbody");
                boardrows.sortable(<SortableOptions>{
                    placeholder: "hover",
                    cursor: "move",
                    stop: (event, ui) => {

                        //var stories = $(ui.item).parent();
                        var boardsummaries = $(".boardsummary");
                        var id = $(ui.item).attr("data-boardid");
                        var boards_order = Enumerable.From(boardsummaries).Select(summary => {
                                return $(summary).attr("data-boardid");
                            })
                            .ToArray();

                        var data = { id: id, boards_order: boards_order };
                        var client = new ScrumboServerClient();
                        client.CallMethod("BoardsSort", data);
                    }
                });
            }
        }

        static getTemplate(): string {
            return "<div class=container><h2><span class='glyphicon glyphicon-list'></span> Boards</h2>"
                + "<div class='pull-right'><a class='btn btn-success btn-xs' href='#boards/add'>New Board</a> <a class='btn btn-primary btn-xs' href='#boards/addshared'>Add Shared Board</a> </div><br><br>"
                + "<table id='boards' class='table table-hover'><tbody>"
                + "{{#BoardSummaries}}"
                + "<tr data-boardid='{{hash}}' class='boardsummary'><td><a class='' href='#board/{{hash}}'><strong>{{nameof}}</strong></a> </td>"
                + "<td></td><td><span class=muted>key:  {{hash}}</span></td>"
                //+ "<td></td>"
                + "</tr>{{/BoardSummaries}}"
                + "</tbody></table></div>";
        }
    }

    /*
    =========================================================================================
    */
    export class DeleteBoardView {
        static render(hash): void {
            App.ViewEngine.renderview(this.getViewTemplate(), { "hash": hash });

            $("#btnsubmit").off("click").on("click", (e: any) => {
                e.preventDefault();
                var data = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new ScrumboServerClient();
                var act = client.CallMethod("BoardDelete", data);

                $.when(act)
                    .then(resp => App.GlobalCommon.processPostBack(resp, $("#form1"),
                    () => window["routie"]("boards")));
            });
        }

        static getViewTemplate(): string {
            var form = App.GlobalCommon.form("<h2><span class='glyphicon glyphicon-warning-sign'></span> Delete Board and Contents</h2><div class='alert alert-danger'>DANGER ZONE! Actions taken will delete a board</div>",
                `To Cancel use the back button or press submit to delete the board${App.GlobalCommon.inputstring("hash", "hash", "{{hash}}", "", "hidden")}`
            );
            return App.GlobalCommon.container(form);
        }
    }

    /*
    =========================================================================================
    */
    export class BoardArchiveView {
        static render(data): void {

            var tasksHtml = "";
            Enumerable.From(data.tasks).ForEach((t: Task) => {
                tasksHtml += TaskView.getHtml(t);
            });

            data.tasksHtml = tasksHtml;
            var taskMoreBarViewHtml = TaskMoreBarView.render(data);

            App.ViewEngine.renderview(this.getViewTemplate() + taskMoreBarViewHtml, data);

            BoardView2.makeTaskArchivable(false);
            $(".task-foot").show();
            $("#archivedtasks").masonry({
                itemSelector: ".task",
            });


        }

        static getViewTemplate(): string {
            var page = "<div class=\"clearfix board_archive\"><h2>Board Archive</h2><hr><div id=\"archivedtasks\" >{{&tasksHtml}}</div></div>";
            return App.GlobalCommon.container(page);
        }
    }

    export class AddSharedBoardView {
        static render() {
            App.ViewEngine.renderview(this.getTemplate(), {});
            $("#btnsubmit").off("click").on("click", (e: any) => {
                e.preventDefault();
                var data = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new ScrumboServerClient();
                var act = client.CallMethod("UserAddSharedBoard", data);

                $.when(act)
                    .then(resp => App.GlobalCommon.processPostBack(resp, $("#form1"),
                    () => window["routie"]("boards")));
            });
        }

        static getTemplate(): string {
            var hash = App.GlobalCommon.inputstring("hash", "hash", "", "The shared boards hash", "text"); // var id = App.GlobalCommon.inputstring('id', 'id', "{{id}}", '', 'hidden')
            var form = App.GlobalCommon.form("<h2>Link shared board</h2><hr>", hash);
            return App.GlobalCommon.container(form);
        }
    }

}