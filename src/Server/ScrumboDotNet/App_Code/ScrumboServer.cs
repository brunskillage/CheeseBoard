using System;
using System.Data;
using System.Linq;
using System.Web;
using Dapper;
using FluentValidation;
using FluentValidation.Results;
using Newtonsoft.Json.Linq;
using Tekphoria.Common;

namespace Tekphoria.Web.Server.Scrumbo
{
    public class ScrumboServer : JsonServer, IHttpHandler
    {
        private readonly string[] _columns = {"TODO", "INPROGRESS", "DONE"};
        public IDbConnection ScrumboCon;

        public new void ProcessRequest(HttpContext context)
        {
            try
            {
                base.ProcessRequest(context);
            }
            catch (Exception ex)
            {
                HandleError(ex);
            }
            finally
            {
                CloseConnection(ScrumboCon);
            }
        }

        public IDbConnection GetScrumboConnection()
        {
            if (ScrumboCon == null || ScrumboCon.State != ConnectionState.Open)
                ScrumboCon = GetOpenConnection(Config.GetScrumboConnectionString.Value);
            return ScrumboCon;
        }

        //done
        public object StorySetStatus(dynamic data)
        {
            var status = ((string) data.status).ToUpperInvariant().Trim();
            GetScrumboConnection().Execute("update stories set status=@status where id=@id", new {data.id, status});
            if (status == "DONE" || status == "ARCHIVE")
                GetScrumboConnection()
                    .Execute("update tasks set status=@status where story_id=@story_id",
                        new {story_id = data.id, status = "ARCHIVE"});
            return true;
        }

        // Done
        public object BoardGetArchiveByHash(dynamic data)
        {
            var board_id = GetBoardIdFromHash((string) data.hash);
            dynamic tasksAll =
                GetScrumboConnection().Query(
                    "select * from tasks where board_id=@board_id AND user_id=@user_id and status in('DONE','ARCHIVE') order by date_done desc limit 200;",
                    new {data.user_id, board_id}).ToList();
            return new {tasks = tasksAll};
        }

        // NA
        public object UserUpdate(IDbConnection conn, dynamic data)
        {
            conn.Execute("update users set display_name=@display_name,password=@password where id=@id;",
                new {data.id, data.password, data.display_name});
            return true;
        }

        // NA
        public object UserGet(dynamic data)
        {
            return GetScrumboConnection().Query("select * from users where id=@id;", new {data.id}).Single();
        }

        //NA
        public object UserAddSharedBoard(dynamic data)
        {
            GetScrumboConnection().Execute("insert into user_boards (user_id, board_hash) values (@user_id, @hash);",
                new {data.user_id, data.hash});
            return true;
        }

        // NA
        public object UserAdd(dynamic data)
        {
            dynamic res =
                GetScrumboConnection().Query<dynamic>(
                    "insert into users (email,display_name,password) values (@email,@display_name,@password);select last_insert_id() as newid;",
                    new
                    {
                        data.email,
                        data.password,
                        data.display_name
                    }).Single();
            return new {id = res.newid};
        }

        public object BoardSortStory(dynamic data)
        {
            var jTokens = ((JArray) data.story_order).ToArray();
            for (var i = 0; i < jTokens.Length; i++)
            {
                var valueof = (jTokens[i]).ToString();
                GetScrumboConnection().Execute("update stories set sort_order=@i where id=@valueof", new {i, valueof});
            }

            return true;
        }

        public ValidationResult Validate(IValidator validator, dynamic data)
        {
            ValidationResult result = validator.Validate(data);
            return result;
        }

        public object BoardSetConfiguration(dynamic data)
        {
            var validator = new Validators.BoardConfigValidator();
            ValidationResult result = validator.Validate(data);
            if (!result.IsValid)
                return new {result};

            var id = GetBoardIdFromHash((string) data.hash);
            var extra_status_1 = ((string) data.extra_status_1).ToUpperInvariant();
            var extra_status_2 = ((string) data.extra_status_2).ToUpperInvariant();
            return
                GetScrumboConnection().Execute(
                    "update boards set nameof=@nameof,extra_status_1=@extra_status_1,extra_status_2=@extra_status_2,more_info=@more_info,custom_css=@custom_css where id=@id;",
                    new {data.nameof, extra_status_1, extra_status_2, data.more_info, data.custom_css, id}
                );
        }

        public object BoardGetConfiguration(dynamic data)
        {
            var board =
                GetScrumboConnection()
                    .Query(
                        "select id,nameof,hash,extra_status_1,extra_status_2,more_info,row_header_name,custom_css from boards where hash=@hash;",
                        new {data.hash})
                    .FirstOrDefault();
            return new {board};
        }

        public object StoryUpdateText(dynamic data)
        {
            GetScrumboConnection()
                .Execute("update stories set textof=@textof where id=@id;", new {data.textof, data.id});
            return true;
        }

        public object StoryGet(dynamic data)
        {
            dynamic story =
                GetScrumboConnection().Query("select * from stories where id=@id;", new {data.id}).FirstOrDefault();
            return story;
        }

        public object TaskUpdateText(dynamic data)
        {
            var textof = (string) data.textof;

            textof = textof.Replace("�", "&bull;");

            return
                GetScrumboConnection().Execute(
                    "update tasks set textof=@textof,css_class=@css_class,user_id=@user_id,date_modified=@date_modified where id=@id;",
                    new {data.id, textof, data.css_class, data.user_id, date_modified = DateTime.UtcNow});
        }

        public object TaskGet(dynamic data)
        {
            dynamic task =
                GetScrumboConnection()
                    .Query("select textof,id,css_class from tasks where id=@id", new {data.id})
                    .FirstOrDefault();
            return task;
        }

        public object TaskAddToStory(dynamic data)
        {
            var board_id = GetBoardIdFromHash((string) data.hash);
            return GetScrumboConnection().Execute(
                "insert into tasks (textof,story_id,board_id,sort_order,status,css_class) values (@textof, @story_id, @board_id, 100,'TODO',@css_class); SELECT last_insert_id() as Last_ID;"
                , new {data.textof, data.story_id, board_id, data.css_class}
            );
        }

        public object TaskDelete(dynamic data)
        {
            GetScrumboConnection().Execute("delete from tasks where id=@id", new {data.id});
            return true;
        }

        public object TaskUpdateStatus(dynamic data)
        {
            var status = ((string) data.status).ToUpperInvariant();
            GetScrumboConnection()
                .Execute("update tasks set status=@status,user_id=@user_id,date_modified=@date_modified where id=@id",
                    new {data.id, status, data.user_id, date_modified = DateTime.UtcNow}
                );
            return true;
        }

        public object TaskMove(dynamic data)
        {
            var arry = ((JArray) data.task_ordering).ToArray();
            for (var i = 0; i < arry.Length; i++)
            {
                var valueof = (arry[i]).ToString();
                GetScrumboConnection().Execute("update tasks set sort_order=@i where id=@valueof", new {i, valueof});
            }

            var status = ((string) data.status).ToUpperInvariant();
            GetScrumboConnection().Execute(
                "update tasks set story_id=@story_id, status=@status,story_id=@story_id, user_id=@user_id, date_modified=@date_modified where id=@id",
                new {data.story_id, data.sort_order, data.id, status, data.user_id, date_modified = DateTime.UtcNow}
            );
            if (status == "DONE" || status == "ARCHIVE")
                GetScrumboConnection().Execute(
                    "update tasks set date_done=@date_done where id=@id",
                    new {date_done = DateTime.UtcNow, data.id});
            data.textof = " to " + status;
            data.action = (int) ActionEnum.TASK_MOVE;
            data.board_id = GetBoardIdFromHash((string) data.board_id);
            InsertLogItem(data);
            return true;
        }

        public dynamic InsertLogItem(dynamic data)
        {
            data.board_id = GetBoardIdFromHash((string) data.board_id);

            var sql =
                "insert into log_items (board_id,story_id,task_id,user_id,action,textof) values (@board_id,@story_id,@task_id,@user_id,@action,@textof);update tasks set note_count = note_count + 1 where id=@task_id;";

            GetScrumboConnection().Execute(
                sql,
                new {data.board_id, data.story_id, task_id = data.id, data.user_id, data.action, data.textof}
            );
            return true;
        }

        public dynamic GetTaskLogItems(dynamic data)
        {
            var log_items = GetScrumboConnection().Query(
                "select textof,date_created,action from log_items where task_id=@task_id order by date_created desc;",
                new {data.task_id}
            );

            var actions = GetActions();

            return new {log_items, actions};
        }

        public int StoryAddToBoard(dynamic data)
        {
            var id = GetBoardIdFromHash((string) data.hash);
            var result = GetScrumboConnection().Query(
                "insert into stories (textof, board_id, sort_order, status) values (@textof, @board_id, @sort_order, @status); SELECT last_insert_id() as id;",
                new {data.textof, board_id = id, sort_order = -1, status = "TODO"}
            );
            return (int) result.First().id;
        }

        public int StoryAddToBoardByid(dynamic data)
        {
            var result = GetScrumboConnection().Query(
                "insert into stories (textof, board_id, sort_order, status) values (@textof, @board_id, @sort_order, @status); SELECT last_insert_id() as id;",
                new {data.textof, data.board_id, sort_order = -1, status = "TODO"}
            );
            return (int) result.First().id;
        }

        public object StoryDelete(dynamic data)
        {
            GetScrumboConnection().Execute("delete from stories where id=@id;delete from tasks where story_id=@id;",
                new {data.id}
            );
            return true;
        }

        public object BoardDelete(dynamic data)
        {
            var id = GetBoardIdFromHash((string) data.hash);
            GetScrumboConnection().Execute(
                "delete from boards where id=@id;delete from user_boards where board_hash=@hash;delete from stories where board_id=@id;delete from tasks where board_id=@id;",
                new {id, data.hash});
            return true;
        }

        public int GetBoardIdFromHash(string hash)
        {
            dynamic boardrow =
                GetScrumboConnection().Query("select id from boards where hash=@hash;", new {hash}).ToList();
            if (boardrow.Count == 0)
                return 0;
            return (int) boardrow[0].id;
        }

        public object BoardGetByHash(dynamic data)
        {
            dynamic board =
                GetScrumboConnection().Query<dynamic>(
                    "select id,nameof,hash,group_hash,extra_status_1,extra_status_2,more_info,custom_css from boards where hash=@hash",
                    new {data.hash}).FirstOrDefault();

            if (board == null)
                return new {board};

            // and status in(@StoryDisplayStatuses);

            dynamic stories =
                GetScrumboConnection().Query(
                    "select id,textof,board_id,sort_order,status,date_created from stories where board_id=@id and status not in ('DONE','ARCHIVE');",
                    new {board.id}).ToList();

            dynamic tasks =
                GetScrumboConnection().Query(
                    "select id,textof,story_id,board_id,sort_order,status,css_class,user_id,date_created,date_modified,note_count from tasks where board_id=@id and status not in ('ARCHIVE');",
                    new {board.id}).ToList();

            var log_notes =
                GetScrumboConnection().Query(
                    "Select task_id,textof from log_items where action=29 and board_id=@id order by id desc;",
                    new {board.id}).ToList();

            return new {board, stories, tasks, log_notes, columns = _columns, actions = GetActions()};
        }

        public dynamic GetActions()
        {
            return Enum.GetNames(typeof(ActionEnum));
        }

        public object BoardsList(dynamic data)
        {
            var sql =
                "SELECT boards.hash, nameof, sort_order FROM user_boards INNER JOIN boards ON user_boards.board_hash = boards.hash WHERE user_boards.user_id=@user_id ORDER BY sort_order;";
            return new
            {
                BoardSummaries =
                    GetScrumboConnection().Query(
                        sql,
                        new {data.user_id}).ToList()
            };
        }

        public dynamic BoardAdd(dynamic data)
        {
            var validator = new Validators.BoardValidator();
            ValidationResult validationResult = validator.Validate(data);
            if (!validationResult.IsValid)
                return validationResult;

            dynamic result = GetScrumboConnection().Query<dynamic>(
                    "insert into boards (nameof, hash, more_info) values (@nameof, @hash, ''); SELECT last_insert_id() as newid;",
                    new {data.nameof, data.hash})
                .Single();
            UserAddSharedBoard(data);
            StoryAddToBoardByid(new {textof = "General Work", board_id = result.newid});
            return new {id = result.newid};
        }

        public object UserRecentTasks(dynamic data)
        {
            dynamic tasks =
                GetScrumboConnection().Query("select * from tasks where user_id=@user_id", new {data.user_id})
                    .ToArray();
            return new {tasks};
        }

        public dynamic BoardsSort(dynamic data)
        {
            var user_id = (int) data.user_id;
            var jTokens = ((JArray) data.boards_order).ToArray();
            for (var i = 0; i < jTokens.Length; i++)
            {
                var board_hash = (jTokens[i]).ToString();
                GetScrumboConnection()
                    .Execute("update user_boards set sort_order=@i where user_id=@user_id AND board_hash=@board_hash",
                        new {i, user_id, board_hash});
            }

            return true;
        }
    }
}