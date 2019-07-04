import stringService from './../services/stringService'
import dbService from './../db/dbService'
import Sequelize from 'sequelize'
import {sequelize} from './../app'

import {Story} from './../db/dbTableModels'

class apiController {

        public process(req: any, resp: any){
            console.dir(req.body)
  
            let payload : any = req.body
            let methodName:any = payload.methodName
            let data = payload.data
            data.req = req
            
            let thiz : any = this;  
            console.log("Calling " + methodName)
            thiz[methodName](data).then((result:any)=>{
                resp.json(result)
            });
        }

        // return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.UPDATE })
        // .then((res:any) => {
        //     return true
        // })  


        BoardGetArchiveByHash(data:any) {
            
            var sql = "select * from tasks where board_id=:board_id AND user_id=:user_id and status in('DONE','ARCHIVE') order by date_done desc limit 200;"

            return this.GetBoardIdFromHash(data.hash)
            .then((res:any) => {

                return sequelize.query(sql, { raw: false, replacements : data, type: Sequelize.QueryTypes.SELECT })
                .then((res:any) => {
                    return {
                        tasks:  res
                    }  
                })  
            })   
            
        }

        GetUsersById(data:any){  
            return sequelize.query("select 1+ 1", { raw: false, replacements : data, type: Sequelize.QueryTypes.SELECT })
            .then((res:any) => {
                return {
                    user_list:  [{id:1, display_name: 'BoardUser'}]
                }  
            })           
        }  

        BoardsSort(data: any) {
            var sql ="update user_boards set sort_order=:i where user_id=:user_id AND board_hash=:board_hash"
            
            var promises = []

            for(var i = 0; i < data.boards_order; i++){

                data.board_hash = data.boards_order[i]
                var promise = sequelize.query(sql, { raw: false, replacements : data, type: Sequelize.QueryTypes.UPDATE })
                .then((res:any) => {
                    return true;
                })
                promises.push(promise)
            }

            Promise.all(promises)
                .then(res => {
                    return true 
                })  
        }

        StoryAddToBoard(data:any) {
            return this.GetBoardIdFromHash(data.hash)
                .then((res:any) => {

                    console.log("In XXXXXX")  
                    data.board_id = res.id
                    data.sort_order = -1
                    data.status = 'TODO'  

                    var sql = "insert into stories (textof, board_id, sort_order, status) values (:textof, :board_id, :sort_order, :status); SELECT last_insert_rowid() as id;"

                    return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.INSERT })
                    .then((rows:any) => {
                        return rows[0]
                    })
                })   
        }

        
        GetBoardIdFromHash(hash:string){
            var sql = "select id from boards where hash=:hash;"
            return sequelize.query(sql, { raw: false, replacements : {hash:hash}, type: Sequelize.QueryTypes.SELECT })
                .then((res:any) => {
                    console.dir(res)
                    if(res && res.length){
                        console.log("Returning board Id")
                       
                        return res[0]
                    }

                    return {id : 0}
                })
        }

        TaskMove(data : any) {

            var updateTasksOrderingSql = "update tasks set sort_order=:sortorder where id=:valueof"
            var updateTasksSql = "update tasks set story_id=:story_id, status=:status,story_id=:story_id, user_id=:user_id, date_modified=:date_modified where id=:id"
            var updateTasksSqlDoneDate = "update tasks set date_done=:date_done where id=:id"

            data.status = data.status.toUpperCase()
            data.date_modified = new Date()
            data.date_done = new Date()

            for(var sortorder = 0; sortorder < data.task_ordering.length; sortorder++) {
                 var valueof = data.task_ordering[sortorder]

                 return sequelize.query(updateTasksOrderingSql, { raw: false, replacements: {sortorder:sortorder, valueof:valueof}, type: Sequelize.QueryTypes.UPDATE })
                 .then((res1:any) => {

                    return sequelize.query(updateTasksSql, { raw: false, replacements: data, type: Sequelize.QueryTypes.UPDATE })
                    .then((res2:any) => {
                        
                        if (data.status == "DONE" || data.status == "ARCHIVE"){
                            return sequelize.query(updateTasksSqlDoneDate, { raw: false, replacements: data, type: Sequelize.QueryTypes.UPDATE })
                            .then((res3:any) => {
                                return true
                            })
                        }

                        return true
                    })
                 })
            } 
        } 

        TaskUpdateStatus(data: any) {
            var sql = "update tasks set status=:status,user_id=:user_id,date_modified=:date_modified where id=:id"
            data.date_modified = new Date()
            return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.UPDATE })
            .then((res:any) => {
                return true
            })
        }

        TaskUpdateSortOrder(data: any) {
            var sql = "update tasks set sort_order=:sort_order,user_id=:user_id,date_modified=:date_modified where id=:id"
            data.date_modified = new Date()
            return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.UPDATE })
            .then((res:any) => {
                return true
            })
        }

        TaskDelete(data: any) {
            var sql = "delete from tasks where id=:id"
            return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.DELETE })
            .then((res:any) => {
                return true
            })
        }

        TaskAddToStory(data: any) {

            return this.GetBoardIdFromHash(data.hash)
            .then((res: any) => {
                data.board_id = res.id

                    var sql = "insert into tasks (textof,story_id,board_id,sort_order,status,css_class) values (:textof, :story_id, :board_id, 100,'TODO',:css_class); SELECT last_insert_rowid() as Last_ID;"
                    return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.INSERT })
                            
                    .then((res:any) => {
                        return true
                    })

                })
        }

        TaskGet(data: any) {
            var sql = "select textof,id,css_class from tasks where id=:id"
            return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.SELECT })
            .then((task:any) => {
                return task[0]
            })
        }

        TaskUpdateText(data: any) {
            var textof = data.textof
            data.date_modified = new Date()
            textof = textof.replace("�", "&bull;");
            var sql = "update tasks set textof=:textof,css_class=:css_class,user_id=:user_id,date_modified=:date_modified where id=:id;"
            return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.UPDATE })
            .then((res:any) => {
                return true
            })
        }

        StoryGet(data:any) {
            var sql = "select * from stories where id=:id;"
            return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.SELECT })
             .then((stories:any) => {
                 return stories[0]
            })
        }

        StoryUpdateText(data: any) {
            var sql = "update stories set textof=:textof where id=:id;"
            return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.UPDATE })
            .then((res:any) => {
                return true
            })
        }

        BoardGetConfiguration(data: any) {
            var sql = "select id,nameof,hash,extra_status_1,extra_status_2,more_info,row_header_name,custom_css from boards where hash=:hash;"

            return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.SELECT })
            .then((res:any) => {
                return { board: res[0] }
            })

        }

        BoardSetConfiguration(data:any) {
            this.GetBoardIdFromHash(data.hash)
            .then((boardid:number) => {
                data.board_id = boardid
                var extra_status_1 = data.extra_status_1 ? data.extra_status_1.toUpperCase() : "";
                var extra_status_2 = data.extra_status_1 ? data.extra_status_2.toUpperCase() : "";
                var sql = "update boards set nameof=:nameof,extra_status_1=:extra_status_1,extra_status_2=:extra_status_2,more_info=:more_info,custom_css=:custom_css where id=:id;"
                return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.UPDATE })
                .then((res:any) => {
                    return res[0]
                }) 
            
            })

        }

        BoardSortStory(data : any){

            var promises = []

            var sql = "update stories set sort_order=:order where id=:id"
            
            for (var i = 0; i < data.sort_order; i++)
            {
                data.order = i
                data.id = data.sort_order[i]
                let promise = sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.UPDATE })
                .then((res:any) => {
                    return true
                })

                promises.push(promise)
            }

            return Promise.all(promises).then(res => {return true})  
        }

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



        StorySetStatus(data: any)
        {
            data.status = data.status.toUpperCase();
            var sql1 ="update stories set status=:status where id=:id"
            var sql2 ="update tasks set status=:status where story_id=:story_id"

            return sequelize.query(sql1, { raw: false, replacements: data, type: Sequelize.QueryTypes.UPDATE })
            .then((resp1:any) => {
                
                if (data.status === "DONE" || data.status === "ARCHIVE"){
                    data.story_id = data.id
                    return sequelize.query(sql2, { raw: false, replacements: data, type: Sequelize.QueryTypes.UPDATE })
                    .then((resp2:any) => {
                        return true
                    })
                }
                return true;
            })
        }

        BoardsList(data:any) {
            var sql =
                 "SELECT boards.hash, nameof, sort_order FROM user_boards INNER JOIN boards ON user_boards.board_hash = boards.hash WHERE user_boards.user_id=:user_id ORDER BY sort_order;";
            return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.SELECT })
                .then((res:any) => {
                    return {  BoardSummaries : res }                
            })
        }

        BoardGetByHash(data:any){

            let boardSql = "select id,nameof,hash,group_hash,extra_status_1,extra_status_2,more_info,custom_css from boards where hash=:hash"
            let storiesSql ="select id,textof,board_id,sort_order,status,date_created from stories where board_id=:id and status not in ('DONE','ARCHIVE');"
            let tasksSql =  "select id,textof,story_id,board_id,sort_order,status,css_class,user_id,date_created,date_modified,note_count from tasks where board_id=:id and status not in ('ARCHIVE');"
            let logNotesSql = "Select task_id,textof from log_items where action=29 and board_id=:id order by id desc;"

            // welcome to hell, pull up a chair and grab a whiskey
            return sequelize.query(boardSql, { raw: false, replacements: data, type: Sequelize.QueryTypes.SELECT })
            .then((boards:any) =>{ 
                console.log(boards)

               return boards[0]; // first board in array
             })
             .then((board:any)=>{

                 let board_id = board.id;
                 return sequelize.query(storiesSql, { raw: false, replacements: {id:board_id}, type: Sequelize.QueryTypes.SELECT })
                    .then((stories:any)=>{

                        console.log('stories ' + board_id)
                         return sequelize.query(tasksSql, { raw: false, replacements: {id:board_id}, type: Sequelize.QueryTypes.SELECT })
                         .then((tasks:any)=>{

                            console.log('tasks ' + board_id)
                             return sequelize.query(logNotesSql, { raw: false, replacements: {id:board_id}, type: Sequelize.QueryTypes.SELECT })
                             .then((logNotes:any)=>{

                                    return {
                                        board:board,
                                        stories: stories,
                                        tasks: tasks,
                                        log_notes: logNotes,
                                        columns:['TODO', 'INPROGRESS','DONE'],
                                        users: [{id: 1, display_name: 'board_user'}]   
                                    }
                             })
                         })
                    })
             })
        }


        BoardAdd(data:any) {

            if(!data || !data.nameof || !data.hash || !data.user_id ){
                return {isValid:false, errors: ['name or hash incorrect']}
            }

            var sql1 =
            // "insert into boards (nameof, hash, more_info) values (:nameof, :hash, ''); SELECT last_insert_id() as newid;" //mysql
            "insert into boards (nameof, hash, more_info) values (:nameof, :hash, '');" //sqlite
            var sql2 = "select last_insert_rowid() as newid;"
            var sql3 = "insert into user_boards (user_id, board_hash) values (:user_id, :hash);"
            
            
            return sequelize.query(sql1, { raw: false, replacements: data, type: Sequelize.QueryTypes.INSERT })
            .then((res:any) => {
                return sequelize.query(sql2, { raw: false, replacements: data, type: Sequelize.QueryTypes.SELECT })
                .then((res2:any)=>{
                    let newId = res2[0].newid
                    return sequelize.query(sql3, { raw: false, replacements: data, type: Sequelize.QueryTypes.INSERT })
                    .then((res3:any) => {
                        console.log('boardid=' + newId)
                        return {  id : newId }  
                    })
                })                
            })
        }

        UserAddSharedBoard(data:any) {
            var sql =
            "insert into user_boards (user_id, board_hash) values (:user_id, :hash);"
            return sequelize.query(sql, { raw: false, replacements: data, type: Sequelize.QueryTypes.INSERT })
                .then((res:any) => {
                                   
            })
        }



}

export = new apiController()