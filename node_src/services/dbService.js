"use strict";
var app_1 = require("./../app");
var dbTableModels_1 = require("./../db/dbTableModels");
var dbService = /** @class */ (function () {
    function dbService() {
        this.statuses = ["TODO", "INPROGRESS", "DONE"];
    }
    dbService.prototype.StorySetStatus = function (data) {
        return app_1.sequelize
            .query('SELECT * FROM projects WHERE status = :status ', { raw: true, replacements: data }).then(function () {
            if (data.status == "DONE" || data.status == "ARCHIVE")
                app_1.sequelize
                    .query("update tasks set status=@status where story_id=:story_id", { story_id: data.id, status: "ARCHIVE" });
        });
    };
    dbService.prototype.BoardsList = function (data) {
        var sql = "SELECT boards.hash, nameof, sort_order FROM user_boards INNER JOIN boards ON user_boards.board_hash = boards.hash WHERE user_boards.user_id=:user_id ORDER BY sort_order;";
        return app_1.sequelize.query(sql, { raw: true, replacements: data });
    };
    // public object BoardsList(dynamic data)
    // {
    //     var sql =
    //         "SELECT boards.hash, nameof, sort_order FROM user_boards INNER JOIN boards ON user_boards.board_hash = boards.hash WHERE user_boards.user_id=@user_id ORDER BY sort_order;";
    //     return new
    //     {
    //         BoardSummaries =
    //             GetScrumboConnection().Query(
    //                 sql,
    //                 new {data.user_id}).ToList()
    //     };
    // }
    dbService.prototype.check = function () {
        app_1.sequelize
            .authenticate()
            .then(function () {
            console.log('Database connection to has been established successfully.');
        })
            .catch(function (err) {
            console.error('Unable to connect to the database:', err);
        });
    };
    dbService.prototype.migrate = function () {
        // User.hasMany(Board)
        // Board.hasMany(Task)
        // Task.belongsTo(User)
        //Board.sync()  
        app_1.sequelize.sync({ force: true }).then(function () {
            console.log("DB Synced");
            dbTableModels_1.User.create({
                id: 1, nameof: 'Allan', status: 'ACTIVE'
            });
            dbTableModels_1.Board.create({
                id: 1, nameof: 'Test Board 1', hash: 'GDXVC78GH'
            });
            dbTableModels_1.UserBoard.create({
                id: 1, user_id: 1, board_hash: 'GDXVC78GH'
            });
            dbTableModels_1.Story.create({
                id: 1, textof: 'story 1', board_id: 1, sort_order: 1, status: 'TODO'
            });
        });
    };
    return dbService;
}());
module.exports = new dbService();
