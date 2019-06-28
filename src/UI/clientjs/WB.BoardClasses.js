"use strict";
var WB;
(function (WB) {
    var Board = /** @class */ (function () {
        function Board(id, sort_order, nameof, columns, stories, tasks) {
            this.id = id;
            this.sort_order = sort_order;
            this.nameof = nameof;
            this.columns = columns;
            this.stories = stories;
            this.tasks = tasks;
        }
        return Board;
    }());
    WB.Board = Board;
    var BoardSummary = /** @class */ (function () {
        function BoardSummary(id, nameof) {
            this.id = id;
            this.nameof = nameof;
        }
        return BoardSummary;
    }());
    WB.BoardSummary = BoardSummary;
    var BoardController = /** @class */ (function () {
        function BoardController() {
        }
        BoardController.BOARDS_LIST = function () {
            var boards = [];
            var client = new WB.ScrumboServerClient();
            var action = client.CallMethod("BoardsList", {});
            $.when(action).then(function (resp) {
                console.log(resp);
                BoardsView.render(resp);
            });
        };
        BoardController.BOARD_ADD = function () {
            BoardAddView.render();
        };
        BoardController.BOARD_DELETE = function (hash) {
            DeleteBoardView.render(hash);
        };
        BoardController.BOARD_GET = function (hash) {
            var _this = this;
            var client = new WB.ScrumboServerClient();
            var req1 = client.CallMethod("BoardGetByHash", { hash: hash });
            $.when(req1).then(function (resp1) {
                // var accountClient = new Account.AccountClient();
                // var req2 = accountClient.CallMethod("GetUsersById", { id_list: Enumerable.From(resp1.tasks).Select(t => t.user_id).Distinct().ToArray().join(",") });
                var req2 = client.CallMethod("GetUsersById", { id_list: Enumerable.From(resp1.tasks).Select(function (t) { return t.user_id; }).Distinct().ToArray().join(",") });
                $.when(req2).then(function (resp2) { return _this.HandleBoardResponse(resp1, resp2); });
                // remove to no user board
                // this.HandleBoardResponse(resp1, [1]);  
            });
        };
        BoardController.BOARD_GET_SIMPLE = function (hash) {
            var _this = this;
            var client = new WB.ScrumboServerClient();
            var req1 = client.CallMethod("BoardGetByHash", { hash: hash }); //var getUsers = () => 
            $.when(req1).then(function (resp1) {
                // var accountClient = new Account.AccountClient();
                var req2 = client.CallMethod("GetUsersById", { id_list: Enumerable.From(resp1.tasks).Select(function (t) { return t.user_id; }).Distinct().ToArray().join(",") });
                $.when(req2)
                    .then(function (resp2) { return _this.HandleBoardResponse(resp1, resp2, "simple"); });
            });
        };
        BoardController.BOARD_GET_LIST = function (hash) {
            var _this = this;
            var client = new WB.ScrumboServerClient();
            var req1 = client.CallMethod("BoardGetByHash", { hash: hash }); //var getUsers = () => 
            $.when(req1).then(function (resp1) {
                // var accountClient = new Account.AccountClient();
                var req2 = client.CallMethod("GetUsersById", { id_list: Enumerable.From(resp1.tasks).Select(function (t) { return t.user_id; }).Distinct().ToArray().join(",") });
                $.when(req2)
                    .then(function (resp2) { return _this.HandleBoardResponse(resp1, resp2, "list"); });
            });
        };
        BoardController.HandleBoardResponse = function (boardresp, usersresp, viewtype) {
            var vdata = boardresp;
            vdata.users = usersresp.user_list;
            if (vdata.board) {
                if (viewtype == "simple") {
                    BoardViewSimple.render(vdata);
                    return true;
                }
                if (viewtype == "list") {
                    BoardViewList.render(vdata);
                    return true;
                }
                return BoardView2.render(vdata);
            }
        };
        BoardController.BOARD_DELETE_REPLY = function () {
        };
        BoardController.BOARD_GET_CONFIGURATION = function (hash) {
            var client = new WB.ScrumboServerClient();
            var action = client.CallMethod("BoardGetConfiguration", { hash: hash });
            $.when(action).then(function (resp) { return BoardConfigView.render(resp); });
        };
        BoardController.BOARD_GET_ARCHIVE = function (hash) {
            var client = new WB.ScrumboServerClient();
            var act = client.CallMethod("BoardGetArchiveByHash", { hash: hash });
            $.when(act).then(function (resp) { return BoardArchiveView.render(resp); });
        };
        BoardController.USER_ADD_SHARED_BOARD = function (data) {
            AddSharedBoardView.render();
        };
        return BoardController;
    }());
    WB.BoardController = BoardController;
    /*
    =========================================================================================
    */
    var BoardViewSimple = /** @class */ (function () {
        function BoardViewSimple() {
        }
        BoardViewSimple.render = function (data) {
            App.ViewEngine.renderview(this.getTemplate(data), data);
        };
        BoardViewSimple.getTemplate = function (data) {
            var lines = [];
            lines.push("<div class='container'>");
            lines.push("<h2>{{board.nameof}}</h2>");
            lines.push("<h3>{{&board.more_info}}</h3>");
            lines.push("<ul>");
            Enumerable.From(data.columns).ForEach(function (col) {
                lines.push("<h4>" + col + "</h4>");
            });
            Enumerable.From(data.stories).OrderBy(function (s) { return s.sort_order; }).ForEach(function (story) {
                lines.push("<li><h4>#" + story.id + " " + story.textof + "</h4></li>");
                lines.push("<ul>");
                Enumerable.From(data.tasks).Where(function (t) { return t.story_id === story.id; }).OrderBy(function (t) { return t.sort_order; }).ForEach(function (t) {
                    var user = BoardView2.findUser(t.user_id, data.users);
                    t.display_name = user.display_name;
                    lines.push("<li>" + t.status.toLocaleUpperCase() + " " + t.textof + " by " + user.display_name + "</li>");
                });
                lines.push("</ul>");
            });
            lines.push("</ul>");
            lines.push("</div>");
            return lines.join("");
        };
        return BoardViewSimple;
    }());
    WB.BoardViewSimple = BoardViewSimple;
    var BoardViewList = /** @class */ (function () {
        function BoardViewList() {
        }
        BoardViewList.render = function (data) {
            App.ViewEngine.renderview(this.getTemplate(data), data);
            $(".status").off("change").on("change", function (e) {
                //e.preventDefault()
                console.log($(e.currentTarget).val());
            });
        };
        BoardViewList.getTemplate = function (data) {
            var lines = [];
            lines.push("<div>");
            lines.push("<h1>{{board.nameof}}<h1>");
            lines.push("<table class='table table-condensed table-bordered'>");
            Enumerable.From(data.tasks).OrderBy(function (t) { return t.sort_order; }).ForEach(function (t) {
                var story = Enumerable.From(data.stories).First(function (s) { return t.story_id === s.id; });
                // var select = []
                // select.push("<select class=status>")
                // Enumerable.From(data.columns).ForEach((col:string)=>{
                //     var selected = (col == t.status) ? "selected" : ""
                //     select.push(`<option ${selected}>${col}</option>`)
                // })
                // select.push("</select") 
                // lines.push(`<tr> <td><input type=text name=textof class=textof value='${t.textof}'/></td> <td>${select.join("")}</td></tr>`);
                lines.push("<tr>");
                lines.push("<td>" + story.textof + "</td>");
                lines.push("<td>" + t.textof + "</td>");
                lines.push("<td>" + t.status + "</td>");
                lines.push("<td>" + t.sort_order + "</td>");
                lines.push("<td><a href=#task/" + t.id + " class='btn btn-default btn-xs'>edit</a></td>");
                lines.push("</tr>");
            });
            lines.push("</table>");
            lines.push("</div>");
            return lines.join("");
        };
        return BoardViewList;
    }());
    WB.BoardViewList = BoardViewList;
    var BoardView2 = /** @class */ (function () {
        function BoardView2() {
        }
        BoardView2.findUser = function (id, users) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === id) {
                    return users[i];
                }
            }
            return { display_name: "unknown" };
        };
        BoardView2.render = function (data) {
            var _this = this;
            amplify.store("last_board_hash", data.board.hash);
            $("#custom_css").remove();
            if (data.board.custom_css) {
                $("link").last().after("<style id=custom_css>" + data.board.custom_css + "</style>");
            }
            ;
            if (data.board.extra_status_2)
                data.columns.splice(2, 0, data.board.extra_status_2);
            if (data.board.extra_status_1)
                data.columns.splice(2, 0, data.board.extra_status_1);
            var rows = "";
            Enumerable.From(data.stories).OrderBy(function (s) { return s.sort_order; }).ForEach(function (story) {
                rows += "<tr data-storyid=" + story.id + ">";
                rows += "<td valign=top align=center>" + WB.StoryView.munged(story, data.board.hash) + "</td>";
                Enumerable.From(data.columns).ForEach(function (col, idx) {
                    rows += "<td valign=middle align=center><div class='tasks' data-storyid='" + story.id + "' data-status='" + col + "'>";
                    Enumerable.From(data.tasks).OrderBy(function (t) { return t.sort_order; }).ForEach(function (t) {
                        if (t.story_id === story.id && t.status === col) {
                            var user = _this.findUser(t.user_id, data.users);
                            t.display_name = user.display_name;
                            t.log_notes = Enumerable.From(data.log_notes).Where(function (ln) { return ln.task_id == t.id; }).ToArray();
                            rows += WB.TaskView.getHtml(t);
                        }
                    });
                    rows += "</div></td>";
                });
                rows += "</tr>";
            });
            if (data.stories.length < 6) {
                Enumerable.RangeTo(data.stories.length, 5).ForEach(function (i) {
                    rows += "<tr>";
                    Enumerable.RangeTo(0, data.columns.length).ForEach(function (i) {
                        rows += "<td></td>";
                    });
                    rows += "</tr>";
                });
            }
            data.rowsHtml = rows;
            var toolbar = App.ViewEngine.getHtml(this.getToolBarTemplate(), data);
            var takmoreView = WB.TaskMoreBarView.getHtml({ id: 0 });
            WB.TaskMoreBarView.setEvents();
            App.ViewEngine.renderview(this.getTemplate(), data);
            $("#board").append(toolbar);
            $("#board").before(takmoreView);
            this.makeTasksSortable();
            this.makeStoriesSortable();
            this.makeTaskArchivable(true);
            this.addtaskloglistener();
            this.addtaskExpandListener();
            this.resizetasks();
        };
        BoardView2.addLog = function (e) {
            e.preventDefault();
            var taskId = $("#addlogid").val();
            var textof = $(".addlogview #textof").val();
            var storyId = $(e.currentTarget).first().closest(".tasks").attr("data-storyid");
            var boardId = $("#board").attr("data-id");
            var client = new WB.ScrumboServerClient();
            client.CallMethod("InsertLogItem", { board_id: boardId, story_id: storyId, id: taskId, textof: textof, action: "NOTE" });
        };
        BoardView2.addtaskloglistener = function () {
            $(".addlog").off("click").on("click", function (e) {
                e.preventDefault();
                $(".addlogview").remove();
                $(".addlog").show();
                var id = $(e.currentTarget).attr("data-id");
                var view = WB.TaskAddLogView.getHtml({ id: id });
                var target = $(e.currentTarget);
                var task = target.closest(".task");
                var lognotes = task.find(".lognotes").first();
                task.after(view);
                $("#textof").focus();
                $("#btnaddlog").off("click").on("click", function (e) {
                    e.preventDefault();
                    var taskId = $("#addlogid").val();
                    var textof = $(".addlogview #textof").val();
                    var storyId = $(e.currentTarget).first().closest(".tasks").attr("data-storyid");
                    var boardId = $("#board").attr("data-id");
                    var client = new WB.ScrumboServerClient();
                    var act = client.CallMethod("InsertLogItem", {
                        board_id: boardId,
                        story_id: storyId,
                        id: taskId,
                        textof: textof,
                        action: "29"
                    });
                    $.when(act).then(function () {
                        var logNoteRow = WB.LogNoteRowView.getHtml(new WB.LogNote(textof));
                        lognotes.prepend(logNoteRow);
                        $(".addlogview").fadeOut();
                    });
                });
                App.GlobalCommon.clearTimers();
                var timerid = setTimeout(function () { return $(".addlogview").remove(); }, 60000);
                App.GlobalCommon.timers.push(timerid);
            });
        };
        BoardView2.addtaskExpandListener = function () {
            $(".task .more").off("click").on("click", function (e) {
                e.preventDefault();
                var task = $(e.currentTarget).closest(".task");
                var foot = task.find(".task-foot").first();
                var height = task.height();
                foot.slideDown();
                var timedfunc = function (task) {
                    task.css({ height: height });
                    $(".task-foot").slideUp();
                };
                setTimeout(function () { return timedfunc(task); }, 60000);
            });
        };
        BoardView2.resizetasks = function () {
            var tasks = $(".task");
            var width = tasks.first().width();
            var larger = width * 1.6;
            Enumerable.From(tasks).ForEach(function (t) {
                var ttext = $(t).find(".ttext");
                var length = ttext.text().length;
                if (length > 200) {
                    $(t).width(larger);
                }
            });
        };
        BoardView2.makeTasksSortable = function () {
            var tasklists = $(".tasks");
            tasklists.sortable({
                connectWith: ".tasks",
                cursor: "move",
                placeholder: "hover",
                distance: 1,
                tolerance: "pointer",
                start: function (event, ui) {
                    var id = $(ui.item).attr("data-id");
                    var tasks = $(ui.item).parent();
                    var storyId = tasks.attr("data-storyid");
                    var status = tasks.attr("data-status");
                    var startIndex = ui.item.index();
                    var startData = "" + storyId + status + startIndex;
                    // create a key to determin current state so as not to update unecessarily
                    tasks.attr("data-start_data", startData);
                },
                stop: function (event, ui) {
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
                    }
                    else {
                        if (status === "archive") {
                            WB.TaskController.TASK_UPDATE_STATUS({ id: id, status: "archive" });
                            return;
                        }
                        var taskOrdering = Enumerable.From(tasksAll).Select(function (t) { return +$(t).attr("data-id"); }).ToArray();
                        WB.TaskController.TASK_MOVE({
                            board_id: boardId,
                            story_id: storyId,
                            id: id,
                            status: status,
                            task_ordering: taskOrdering
                        });
                    }
                }
            }).disableSelection();
        };
        BoardView2.makeStoriesSortable = function () {
            if (!document.hasOwnProperty("ontouchend")) {
                $("#board tbody").sortable({
                    placeholder: "hover",
                    cursor: "move",
                    stop: function (event, ui) {
                        var stories = $(ui.item).parent();
                        var stories_all = stories.find(".story");
                        var id = $(ui.item).attr("data-storyid");
                        var story_order = Enumerable.From(stories_all).Select(function (s) {
                            return +$(s).attr("data-id");
                        })
                            .ToArray();
                        var data = { id: id, story_order: story_order };
                        var client = new WB.ScrumboServerClient();
                        client.CallMethod("BoardSortStory", data);
                    }
                });
            }
        };
        BoardView2.makeTaskArchivable = function (removeAfter) {
            $("body").off("click", ".btn_status").on("click", ".btn_status", function (e) {
                e.preventDefault();
                var status = $(e.target).attr("data-status");
                var id = $(e.target).attr("data-id");
                var data = { status: status, id: id };
                var client = new WB.ScrumboServerClient();
                var act = client.CallMethod("TaskUpdateStatus", data);
                $.when(act).then(function (resp) {
                    if (removeAfter) {
                        var selector = $(".task[data-id='" + id + "']"); // $(selector).fadeOut()
                        selector.css({
                            position: "absolute",
                            'z-order': 1000
                        })
                            .animate({ 'margin-left': "3000px" }, 2000, function () { return selector.remove(); });
                    }
                    else {
                        window.location.reload();
                    }
                });
            });
        };
        BoardView2.getTemplate = function () {
            if (this.hasOwnProperty("tmpl")) {
            }
            else {
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
        };
        BoardView2.getToolBarTemplate = function () {
            return "<div>"
                //+ " <a href='#board/{{board.hash}}/config'>Configure</a> "
                //+ " <a  href='#board/{{board.hash}}/archive'>Archive</a> "
                //+ " <a  href='#board/{{board.slug}}/{{board.hash}}'>Link</a>"
                + "</div>";
        };
        BoardView2.timerids = [];
        return BoardView2;
    }());
    WB.BoardView2 = BoardView2;
    /*
    =========================================================================================
    */
    var BoardConfigView = /** @class */ (function () {
        function BoardConfigView() {
        }
        BoardConfigView.render = function (boardConfigData) {
            App.ViewEngine.renderview(this.getTemplate(), boardConfigData);
            $("#btnsubmit").off("click").on("click", function (e) {
                e.preventDefault();
                var formdata = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new WB.ScrumboServerClient();
                var act = client.CallMethod("BoardSetConfiguration", formdata);
                $.when(act).then(function (resp) { return App.GlobalCommon.processPostBack(resp, $("#form1"), window.history.back()); });
            });
        };
        BoardConfigView.getTemplate = function () {
            var nameof = App.GlobalCommon.inputstring("nameof", "nameof", "{{board.nameof}}", "The name of the board", "text"); // var top = App.GlobalCommon.inputstring('top_status', 'top_status', '{{board.top_status}}', 'Status for the top section', 'text')
            var info = App.GlobalCommon.textarea("more_info", "more_info", "{{board.more_info}}", "Extra infomation to be displayed.", "5");
            var custom_css = App.GlobalCommon.textarea("custom_css", "custom_css", "{{board.custom_css}}", "The Custom css values.", "5");
            var status1 = App.GlobalCommon.inputstring("extra_status_1", "extra_status_1", "{{board.extra_status_1}}", "Status Column 1 after between inprogress and done.", "text");
            var status2 = App.GlobalCommon.inputstring("extra_status_2", "extra_status_2", "{{board.extra_status_2}}", "Status Column 2 after between inprogress and done.", "text");
            var hash = App.GlobalCommon.inputstring("hash", "hash", "{{board.hash}}", "", "hidden");
            return App.GlobalCommon.container("<h2><span class='glyphicon glyphicon-cog'></span> Board Configuration</h2><a class-'btn btn-link' href='#board/{{board.hash}}/delete'>Delete board</a><hr>" + App.GlobalCommon.form("Board Details", nameof + info + status1 + status2 + custom_css + hash));
        };
        return BoardConfigView;
    }());
    WB.BoardConfigView = BoardConfigView;
    /*
    =========================================================================================
    */
    var BoardTrashView = /** @class */ (function () {
        function BoardTrashView() {
        }
        BoardTrashView.render = function () {
            this.registerEvents();
            App.ViewEngine.renderview(this.getTemplate(), {});
        };
        BoardTrashView.getHtml = function () {
            return this.getTemplate();
        };
        BoardTrashView.registerEvents = function () {
        };
        BoardTrashView.getTemplate = function () {
            this.registerEvents();
            return "<div class='trash'><img src='/img/trash.png'/></div>";
        };
        return BoardTrashView;
    }());
    WB.BoardTrashView = BoardTrashView;
    /*
    =========================================================================================
    */
    var BoardAddView = /** @class */ (function () {
        function BoardAddView() {
        }
        BoardAddView.getFormInputsAsObject = function () {
            var form = $("#form1");
            return App.GlobalCommon.getFormInputs(form);
        };
        BoardAddView.render = function () {
            App.ViewEngine.renderview(this.getTemplate(), {}); //events
            var submitbtn = $("#btnsubmit");
            var hash = $("#hash");
            submitbtn.on("click", function (e) {
                e.preventDefault();
                hash.val(App.GlobalCommon.createUUID(12, 36));
                var data = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new WB.ScrumboServerClient();
                var act = client.CallMethod("BoardAdd", data);
                $.when(act).then(function (resp) { return App.GlobalCommon.processPostBack(resp, $("#form1"), function () { return window.history.back(); }); });
            });
        };
        BoardAddView.getTemplate = function () {
            var nameof = App.GlobalCommon.inputstring("nameof", "nameof", "", "The name of the board", "text");
            var hash = App.GlobalCommon.inputstring("hash", "hash", App.GlobalCommon.createUUID(12, 36), "", "hidden");
            var form = App.GlobalCommon.form("<h2>Add a board</h2><hr>", nameof + hash);
            return App.GlobalCommon.container(form);
        };
        return BoardAddView;
    }());
    WB.BoardAddView = BoardAddView;
    /*
     =========================================================================================
     */
    var BoardsView = /** @class */ (function () {
        function BoardsView() {
        }
        BoardsView.render = function (data) {
            App.ViewEngine.renderview(this.getTemplate(), data);
            this.registerEvents();
        };
        BoardsView.registerEvents = function () {
            if (!document.hasOwnProperty("ontouchend")) {
                var boardrows = $("#boards tbody");
                boardrows.sortable({
                    placeholder: "hover",
                    cursor: "move",
                    stop: function (event, ui) {
                        //var stories = $(ui.item).parent();
                        var boardsummaries = $(".boardsummary");
                        var id = $(ui.item).attr("data-boardid");
                        var boards_order = Enumerable.From(boardsummaries).Select(function (summary) {
                            return $(summary).attr("data-boardid");
                        })
                            .ToArray();
                        var data = { id: id, boards_order: boards_order };
                        var client = new WB.ScrumboServerClient();
                        client.CallMethod("BoardsSort", data);
                    }
                });
            }
        };
        BoardsView.getTemplate = function () {
            return "<div class=container><h2><span class='glyphicon glyphicon-list'></span> Boards</h2>"
                + "<div class='pull-right'><a class='btn btn-success btn-xs' href='#boards/add'>New Board</a> <a class='btn btn-primary btn-xs' href='#boards/addshared'>Add Shared Board</a> </div><br><br>"
                + "<table id='boards' class='table table-hover'><tbody>"
                + "{{#BoardSummaries}}"
                + "<tr data-boardid='{{hash}}' class='boardsummary'><td><a class='' href='#board/{{hash}}'><strong>{{nameof}}</strong></a> </td>"
                + "<td></td><td><span class=muted>key:  {{hash}}</span></td>"
                //+ "<td></td>"
                + "</tr>{{/BoardSummaries}}"
                + "</tbody></table></div>";
        };
        return BoardsView;
    }());
    WB.BoardsView = BoardsView;
    /*
    =========================================================================================
    */
    var DeleteBoardView = /** @class */ (function () {
        function DeleteBoardView() {
        }
        DeleteBoardView.render = function (hash) {
            App.ViewEngine.renderview(this.getViewTemplate(), { "hash": hash });
            $("#btnsubmit").off("click").on("click", function (e) {
                e.preventDefault();
                var data = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new WB.ScrumboServerClient();
                var act = client.CallMethod("BoardDelete", data);
                $.when(act)
                    .then(function (resp) { return App.GlobalCommon.processPostBack(resp, $("#form1"), function () { return window["routie"]("boards"); }); });
            });
        };
        DeleteBoardView.getViewTemplate = function () {
            var form = App.GlobalCommon.form("<h2><span class='glyphicon glyphicon-warning-sign'></span> Delete Board and Contents</h2><div class='alert alert-danger'>DANGER ZONE! Actions taken will delete a board</div>", "To Cancel use the back button or press submit to delete the board" + App.GlobalCommon.inputstring("hash", "hash", "{{hash}}", "", "hidden"));
            return App.GlobalCommon.container(form);
        };
        return DeleteBoardView;
    }());
    WB.DeleteBoardView = DeleteBoardView;
    /*
    =========================================================================================
    */
    var BoardArchiveView = /** @class */ (function () {
        function BoardArchiveView() {
        }
        BoardArchiveView.render = function (data) {
            var tasksHtml = "";
            Enumerable.From(data.tasks).ForEach(function (t) {
                tasksHtml += WB.TaskView.getHtml(t);
            });
            data.tasksHtml = tasksHtml;
            var taskMoreBarViewHtml = WB.TaskMoreBarView.render(data);
            App.ViewEngine.renderview(this.getViewTemplate() + taskMoreBarViewHtml, data);
            BoardView2.makeTaskArchivable(false);
            $(".task-foot").show();
            $("#archivedtasks").masonry({
                itemSelector: ".task",
            });
        };
        BoardArchiveView.getViewTemplate = function () {
            var page = "<div class=\"clearfix board_archive\"><h2>Board Archive</h2><hr><div id=\"archivedtasks\" >{{&tasksHtml}}</div></div>";
            return App.GlobalCommon.container(page);
        };
        return BoardArchiveView;
    }());
    WB.BoardArchiveView = BoardArchiveView;
    var AddSharedBoardView = /** @class */ (function () {
        function AddSharedBoardView() {
        }
        AddSharedBoardView.render = function () {
            App.ViewEngine.renderview(this.getTemplate(), {});
            $("#btnsubmit").off("click").on("click", function (e) {
                e.preventDefault();
                var data = App.GlobalCommon.getFormInputs($("#form1"));
                var client = new WB.ScrumboServerClient();
                var act = client.CallMethod("UserAddSharedBoard", data);
                $.when(act)
                    .then(function (resp) { return App.GlobalCommon.processPostBack(resp, $("#form1"), function () { return window["routie"]("boards"); }); });
            });
        };
        AddSharedBoardView.getTemplate = function () {
            var hash = App.GlobalCommon.inputstring("hash", "hash", "", "The shared boards hash", "text"); // var id = App.GlobalCommon.inputstring('id', 'id', "{{id}}", '', 'hidden')
            var form = App.GlobalCommon.form("<h2>Link shared board</h2><hr>", hash);
            return App.GlobalCommon.container(form);
        };
        return AddSharedBoardView;
    }());
    WB.AddSharedBoardView = AddSharedBoardView;
})(WB || (WB = {}));
