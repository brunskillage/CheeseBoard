"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var sequelize_1 = __importDefault(require("sequelize"));
var app_1 = require("./../app");
var apiController = /** @class */ (function () {
    function apiController() {
    }
    apiController.prototype.process = function (req, resp) {
        console.dir(req.body);
        var payload = req.body;
        var methodName = payload.methodName;
        var data = payload.data;
        data.req = req;
        var thiz = this;
        console.log("Calling " + methodName);
        thiz[methodName](data).then(function (result) {
            resp.json(result);
        });
    };
    // return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.UPDATE })
    // .then((res:any) => {
    //     return true
    // })  
    apiController.prototype.BoardGetArchiveByHash = function (data) {
        var sql = "select * from tasks where board_id=:board_id AND user_id=:user_id and status in('DONE','ARCHIVE') order by date_done desc limit 200;";
        return this.GetBoardIdFromHash(data.hash)
            .then(function (res) {
            return app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.SELECT })
                .then(function (res) {
                return {
                    tasks: res
                };
            });
        });
    };
    apiController.prototype.GetUsersById = function (data) {
        return app_1.sequelize.query("select 1+ 1", { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.SELECT })
            .then(function (res) {
            return {
                user_list: [{ id: 1, display_name: 'BoardUser' }]
            };
        });
    };
    apiController.prototype.BoardsSort = function (data) {
        var sql = "update user_boards set sort_order=:i where user_id=:user_id AND board_hash=:board_hash";
        var promises = [];
        for (var i = 0; i < data.boards_order; i++) {
            data.board_hash = data.boards_order[i];
            var promise = app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.UPDATE })
                .then(function (res) {
                return true;
            });
            promises.push(promise);
        }
        Promise.all(promises)
            .then(function (res) {
            return true;
        });
    };
    apiController.prototype.StoryAddToBoard = function (data) {
        return this.GetBoardIdFromHash(data.hash)
            .then(function (res) {
            console.log("In XXXXXX");
            data.board_id = res.id;
            data.sort_order = -1;
            data.status = 'TODO';
            var sql = "insert into stories (textof, board_id, sort_order, status) values (:textof, :board_id, :sort_order, :status); SELECT last_insert_rowid() as id;";
            return app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.INSERT })
                .then(function (rows) {
                return rows[0];
            });
        });
    };
    apiController.prototype.GetBoardIdFromHash = function (hash) {
        var sql = "select id from boards where hash=:hash;";
        return app_1.sequelize.query(sql, { raw: false, replacements: { hash: hash }, type: sequelize_1.default.QueryTypes.SELECT })
            .then(function (res) {
            console.dir(res);
            if (res && res.length) {
                console.log("Returning board Id");
                return res[0];
            }
            return { id: 0 };
        });
    };
    apiController.prototype.TaskMove = function (data) {
        var updateTasksOrderingSql = "update tasks set sort_order=:sortorder where id=:valueof";
        var updateTasksSql = "update tasks set story_id=:story_id, status=:status,story_id=:story_id, user_id=:user_id, date_modified=:date_modified where id=:id";
        var updateTasksSqlDoneDate = "update tasks set date_done=:date_done where id=:id";
        data.status = data.status.toUpperCase();
        data.date_modified = new Date();
        data.date_done = new Date();
        for (var sortorder = 0; sortorder < data.task_ordering.length; sortorder++) {
            var valueof = data.task_ordering[sortorder];
            return app_1.sequelize.query(updateTasksOrderingSql, { raw: false, replacements: { sortorder: sortorder, valueof: valueof }, type: sequelize_1.default.QueryTypes.UPDATE })
                .then(function (res1) {
                return app_1.sequelize.query(updateTasksSql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.UPDATE })
                    .then(function (res2) {
                    if (data.status == "DONE" || data.status == "ARCHIVE") {
                        return app_1.sequelize.query(updateTasksSqlDoneDate, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.UPDATE })
                            .then(function (res3) {
                            return true;
                        });
                    }
                    return true;
                });
            });
        }
    };
    apiController.prototype.TaskUpdateStatus = function (data) {
        var sql = "update tasks set status=:status,user_id=:user_id,date_modified=:date_modified where id=:id";
        data.date_modified = new Date();
        return app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.UPDATE })
            .then(function (res) {
            return true;
        });
    };
    apiController.prototype.TaskUpdateSortOrder = function (data) {
        var sql = "update tasks set sort_order=:sort_order,user_id=:user_id,date_modified=:date_modified where id=:id";
        data.date_modified = new Date();
        return app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.UPDATE })
            .then(function (res) {
            return true;
        });
    };
    apiController.prototype.TaskDelete = function (data) {
        var sql = "delete from tasks where id=:id";
        return app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.DELETE })
            .then(function (res) {
            return true;
        });
    };
    apiController.prototype.TaskAddToStory = function (data) {
        return this.GetBoardIdFromHash(data.hash)
            .then(function (res) {
            data.board_id = res.id;
            var sql = "insert into tasks (textof,story_id,board_id,sort_order,status,css_class) values (:textof, :story_id, :board_id, 100,'TODO',:css_class); SELECT last_insert_rowid() as Last_ID;";
            return app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.INSERT })
                .then(function (res) {
                return true;
            });
        });
    };
    apiController.prototype.TaskGet = function (data) {
        var sql = "select textof,id,css_class from tasks where id=:id";
        return app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.SELECT })
            .then(function (task) {
            return task[0];
        });
    };
    apiController.prototype.TaskUpdateText = function (data) {
        var textof = data.textof;
        data.date_modified = new Date();
        textof = textof.replace("�", "&bull;");
        var sql = "update tasks set textof=:textof,css_class=:css_class,user_id=:user_id,date_modified=:date_modified where id=:id;";
        return app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.UPDATE })
            .then(function (res) {
            return true;
        });
    };
    apiController.prototype.StoryGet = function (data) {
        var sql = "select * from stories where id=:id;";
        return app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.SELECT })
            .then(function (stories) {
            return stories[0];
        });
    };
    apiController.prototype.StoryUpdateText = function (data) {
        var sql = "update stories set textof=:textof where id=:id;";
        return app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.UPDATE })
            .then(function (res) {
            return true;
        });
    };
    apiController.prototype.BoardGetConfiguration = function (data) {
        var sql = "select id,nameof,hash,extra_status_1,extra_status_2,more_info,row_header_name,custom_css from boards where hash=:hash;";
        return app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.SELECT })
            .then(function (res) {
            return { board: res[0] };
        });
    };
    apiController.prototype.BoardSetConfiguration = function (data) {
        this.GetBoardIdFromHash(data.hash)
            .then(function (boardid) {
            data.board_id = boardid;
            var extra_status_1 = data.extra_status_1 ? data.extra_status_1.toUpperCase() : "";
            var extra_status_2 = data.extra_status_1 ? data.extra_status_2.toUpperCase() : "";
            var sql = "update boards set nameof=:nameof,extra_status_1=:extra_status_1,extra_status_2=:extra_status_2,more_info=:more_info,custom_css=:custom_css where id=:id;";
            return app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.UPDATE })
                .then(function (res) {
                return res[0];
            });
        });
    };
    apiController.prototype.BoardSortStory = function (data) {
        var promises = [];
        var sql = "update stories set sort_order=:order where id=:id";
        for (var i = 0; i < data.sort_order; i++) {
            data.order = i;
            data.id = data.sort_order[i];
            var promise = app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.UPDATE })
                .then(function (res) {
                return true;
            });
            promises.push(promise);
        }
        return Promise.all(promises).then(function (res) { return true; });
    };
    // BoardGetArchiveByHash(data : any){
    //     this.GetBoardIdFromHash(data.hash)
    //     .then((boardid:number) => {
    //         data.board_id = boardid
    //         var sql = "select * from tasks where board_id=:board_id AND user_id=:user_id and status in('DONE','ARCHIVE') order by date_done desc limit 200;"
    //         return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.SELECT })
    //         .then((tasks:any) => {
    //             return {tasks: tasks}
    //         })
    //     })
    // }
    apiController.prototype.StorySetStatus = function (data) {
        data.status = data.status.toUpperCase();
        var sql1 = "update stories set status=:status where id=:id";
        var sql2 = "update tasks set status=:status where story_id=:story_id";
        return app_1.sequelize.query(sql1, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.UPDATE })
            .then(function (resp1) {
            if (data.status === "DONE" || data.status === "ARCHIVE") {
                data.story_id = data.id;
                return app_1.sequelize.query(sql2, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.UPDATE })
                    .then(function (resp2) {
                    return true;
                });
            }
            return true;
        });
    };
    apiController.prototype.BoardsList = function (data) {
        var sql = "SELECT boards.hash, nameof, sort_order FROM user_boards INNER JOIN boards ON user_boards.board_hash = boards.hash WHERE user_boards.user_id=:user_id ORDER BY sort_order;";
        return app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.SELECT })
            .then(function (res) {
            return { BoardSummaries: res };
        });
    };
    apiController.prototype.BoardGetByHash = function (data) {
        var boardSql = "select id,nameof,hash,group_hash,extra_status_1,extra_status_2,more_info,custom_css from boards where hash=:hash";
        var storiesSql = "select id,textof,board_id,sort_order,status,date_created from stories where board_id=:id and status not in ('DONE','ARCHIVE');";
        var tasksSql = "select id,textof,story_id,board_id,sort_order,status,css_class,user_id,date_created,date_modified,note_count from tasks where board_id=:id and status not in ('ARCHIVE');";
        var logNotesSql = "Select task_id,textof from log_items where action=29 and board_id=:id order by id desc;";
        // welcome to hell, pull up a chair and grab a whiskey
        return app_1.sequelize.query(boardSql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.SELECT })
            .then(function (boards) {
            console.log(boards);
            return boards[0]; // first board in array
        })
            .then(function (board) {
            var board_id = board.id;
            return app_1.sequelize.query(storiesSql, { raw: false, replacements: { id: board_id }, type: sequelize_1.default.QueryTypes.SELECT })
                .then(function (stories) {
                console.log('stories ' + board_id);
                return app_1.sequelize.query(tasksSql, { raw: false, replacements: { id: board_id }, type: sequelize_1.default.QueryTypes.SELECT })
                    .then(function (tasks) {
                    console.log('tasks ' + board_id);
                    return app_1.sequelize.query(logNotesSql, { raw: false, replacements: { id: board_id }, type: sequelize_1.default.QueryTypes.SELECT })
                        .then(function (logNotes) {
                        return {
                            board: board,
                            stories: stories,
                            tasks: tasks,
                            log_notes: logNotes,
                            columns: ['TODO', 'INPROGRESS', 'DONE'],
                            users: [{ id: 1, display_name: 'board_user' }]
                        };
                    });
                });
            });
        });
    };
    apiController.prototype.BoardAdd = function (data) {
        if (!data || !data.nameof || !data.hash || !data.user_id) {
            return { isValid: false, errors: ['name or hash incorrect'] };
        }
        var sql1 = 
        // "insert into boards (nameof, hash, more_info) values (:nameof, :hash, ''); SELECT last_insert_id() as newid;" //mysql
        "insert into boards (nameof, hash, more_info) values (:nameof, :hash, '');"; //sqlite
        var sql2 = "select last_insert_rowid() as newid;";
        var sql3 = "insert into user_boards (user_id, board_hash) values (:user_id, :hash);";
        return app_1.sequelize.query(sql1, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.INSERT })
            .then(function (res) {
            return app_1.sequelize.query(sql2, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.SELECT })
                .then(function (res2) {
                var newId = res2[0].newid;
                return app_1.sequelize.query(sql3, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.INSERT })
                    .then(function (res3) {
                    console.log('boardid=' + newId);
                    return { id: newId };
                });
            });
        });
    };
    apiController.prototype.UserAddSharedBoard = function (data) {
        var sql = "insert into user_boards (user_id, board_hash) values (:user_id, :hash);";
        return app_1.sequelize.query(sql, { raw: false, replacements: data, type: sequelize_1.default.QueryTypes.INSERT })
            .then(function (res) {
        });
    };
    return apiController;
}());
module.exports = new apiController();
