
import path from 'path'
import Sequelize from 'sequelize'

import {sequelize} from './../app'
import {Board, Story, Task,User, UserBoard} from './../db/dbTableModels'


class dbService {

    statuses = ["TODO", "INPROGRESS", "DONE"]

    StorySetStatus(data:any) {
        return sequelize
        .query(
            'SELECT * FROM projects WHERE status = :status ',
            { raw: true, replacements: data }
        ).then(() => {
            if (data.status == "DONE" || data.status == "ARCHIVE")
                sequelize
                .query("update tasks set status=@status where story_id=:story_id",
                        {story_id : data.id, status : "ARCHIVE"});
        })
    }

    BoardsList(data:any){  
        var sql =
                "SELECT boards.hash, nameof, sort_order FROM user_boards INNER JOIN boards ON user_boards.board_hash = boards.hash WHERE user_boards.user_id=:user_id ORDER BY sort_order;";

        return sequelize.query(sql, { raw: true, replacements: data })
    }
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

    public check(){

        sequelize
        .authenticate()
        .then(() => {
            console.log('Database connection to has been established successfully.');
        })
        .catch((err : any) => {
            console.error('Unable to connect to the database:', err);  
        });
    }

    public migrate() {

        // User.hasMany(Board)
        // Board.hasMany(Task)
        // Task.belongsTo(User)
         
        //Board.sync()  

        sequelize.sync({force:true}).then(()=>{
            console.log("DB Synced")

            User.create({
               id:1, nameof :'Allan', status:'ACTIVE'    
            })

            Board.create({
                id:1, nameof:'Test Board 1', hash:'GDXVC78GH'
            })

            UserBoard.create({
                id:1, user_id:1 ,board_hash:'GDXVC78GH'
            })
  
            Story.create({
                id:1,textof:'story 1', board_id:1,sort_order:1,status:'TODO'
            })


        })

    }
}


export = new dbService()
