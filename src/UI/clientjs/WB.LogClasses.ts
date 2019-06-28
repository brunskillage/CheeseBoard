/// <reference path="wb.userclasses.ts" />
module WB {
    /*
    =========================================================================================
    */
    export class Log_Item {
        constructor(
            public id: number,
            public board_id: string,
            public story_id: number,
            public task_id: string,
            public user_id: string,
            public textof: boolean,
            public display_text: string,
            public date_created: string,
            public action: number
        ) {}
    }

    export class LogController {
        static SHOW_TASK_LOG(id: number) {
            LogView.render({ task_id: id });
        }
    }

    export class LogView {

        constructor() {}

        static render(args: any) {
            var client = new ScrumboServerClient();
            var act = client.CallMethod("GetTaskLogItems", args);
            $.when(act).then(data => {
                data.log_items.forEach(t => {
                        t.fuzzy_date = moment.utc(t.date_created).fromNow();
                        t.action_name = data.actions[t.action];
                        App.ViewEngine.renderview(this.getTemplate(), data);
                    }
                );
            });
        }

        static getTemplate(): string {
            var tmp = "<div class='logitems clearfix'>"
                + "<h1>Task Activity</h1>"
                + "{{#log_items}}<div class=logitem>"
                + "<span class='text'>{{action_name}} {{&textof}}</span>"
                + "<span class='date'>{{fuzzy_date}}</span>"
                + "</div>{{/log_items}}</div>";
            return tmp;
        }

        static getHtml(data) {
            //Enumerable.From(data.log_items).ForEach((logitem: Log_Item) => {
            //    var actionname = this.getActionName(logitem.action, data.actions);
            //    var user = this.getUserName(logitem.user_id, data.users)
            //    var fuzzytime = App.GlobalCommon.prettyDate(logitem.date_created); 
            //    logitem.display_text = user + " " + " <br> " + fuzzytime + " <br> " + actionname + "  [" + logitem.task_id + "] " + logitem.textof
            //})

            return App.ViewEngine.getHtml(this.getTemplate(), data);
        }
    }
}