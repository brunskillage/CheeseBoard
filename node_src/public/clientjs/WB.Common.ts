///// <reference path="../../global_js/linq-2.2.d.ts" />
///// <reference path="../../global_js/jquery-1.9.1.d.ts" />
//declare module WB {

/// *
//=========================================================================================
//*/
//    export class Config {
//        public static RootPath: string = "/node/app2";
//        public static AppName: string = "Application 2";
//        public static AppEl: JQuery = $("#app");
//        public static ToolBarEl: JQuery = $("#toolbar_buttons");
//    }

/// *
//=========================================================================================
//*/
//    export class Common {
//        public static getnewGuid(): string {
//            return UUID.create(12, 36);
//        }
//        // utitlity
//        public static getFormInputs(form: JQuery): any {
//            var input = {};
//            form.find("input[type=text]").each((idx, item) => {
//                var jitem = $(item);   
//                input[jitem.attr('name')] = jitem.attr('value');
//            });

//            form.find("input[type=password]").each((idx, item) => {
//                var jitem = $(item);
//                input[jitem.attr('name')] = jitem.attr('value');
//            });

//            form.find("input[type=hidden]").each((idx, item) => {
//                var jitem = $(item);
//                input[jitem.attr('name')] = jitem.attr('value');
//            });

//            form.find("textarea").each((idx, item) => {
//                var jitem = $(item);
//                input[jitem.attr('name')] = jitem.attr('value');
//            });

//            form.find("input[type=radio]:checked").each((idx, item) => {
//                var jitem = $(item);

//                input[jitem.attr('name')] = jitem.attr('value');
//            });
//            return input;
//        } 
//        // utitlity

//        // utitlity
//        public static form(title: string, fields: string, buttonId? : string, formid? : string): string {

//            var tmp = "<div class='well span4'><form id='{formid}'><strong>{0}</strong><br><br><fieldset>{fields}<div id='errors'/><hr><button id={buttonId} class='btn clearfix'>Submit</button></fieldset></form></div>"
//                .replace("{0}", title)
//                .replace("{fields}", fields) 

//            if (formid) {  
//                tmp = tmp.replace("{formid}", formid)
//            }
//            else { 
//                tmp = tmp.replace("{formid}", "form1")
//            }

//            if (buttonId) {
//                tmp = tmp.replace("{buttonId}", buttonId);
//            }
//            else { 
//                tmp = tmp.replace("{buttonId}", "btnsubmit");
//            }

//            return tmp; 
//        }

//        public static textarea(id: string, name: string, text: string, help: string, rows: string) :string { 
//            return "<span class='help-block'>{3}</span><textarea id='{0}' name={1} rows={4}>{2}</textarea>"
//                .replace("{0}",id)
//                .replace("{1}",name)
//                .replace("{2}",text)
//                .replace("{3}",help)
//                .replace("{4}",rows);
//        }

//        // utitlity
//        public static inputstring(id: string, name: string, value: string, help: string, type: string): string {
//            var tmp =
//            "<span class='help-block'>{3}</span><input type={4} id='{0}' name='{1}' value='{2}' maxlength=50 ></input>"
//                .replace("{0}", id)
//                .replace("{1}", name)
//                .replace("{2}", value)
//                .replace("{3}", help)
//                .replace("{4}", type)
//            return tmp;
//        }

//        public static radio(name: string, value: string, text: string, wrapclass: string, selected: boolean): string { 
//               var tmp = "<label class='{3}'><input type='radio' name='{0}' value='{1}' {4}/> {2}</label>"
//                   .replace("{0}", name)
//                   .replace("{1}", value)
//                   .replace("{2}", text)
//                   .replace("{3}", wrapclass)
//                   .replace("{4}", selected ? "checked" : "");
//               return tmp;
//        }

//        // utitlity : applies error messages to their respective elements
//        public static apply_validation(validationResponse: ValidationReponse, form: JQuery): void {
//            $(".text-error, .alert").remove();
//            var first: JQuery;
//            Enumerable.From(validationResponse.Errors).Reverse().ForEach((v: ValidationError, idx) => {
//                var el : JQuery = $("#" + v.PropertyName);

//                if (idx === 0) first = el;
//                el.fadeOut().fadeIn().after("<div class='text-error'>" + v.ErrorMessage + "</div>");

//            });
//            first.focus();
//        }

//        public static Message(type: string, text: string): string { 
//            return "<div class='alert {0}'>{1}</div>".replace("{0}", type).replace("{1}", text);
//        }

//        // Takes an ISO time and returns a string representing how
//        // long ago the date represents.
//        public static prettyDate(time) {
//            var date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
//                diff = (((new Date()).getTime() - date.getTime()) / 1000),
//                day_diff = Math.floor(diff / 86400);

//            if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
//                return "just now";

//            var res = day_diff == 0 && (
//                    diff < 60 && "just now" ||
//                    diff < 120 && "1 minute ago" ||
//                    diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
//                    diff < 7200 && "1 hour ago" ||
//                    diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
//                day_diff == 1 && "Yesterday" ||
//                day_diff < 7 && day_diff + " days ago" ||
//                day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
//            return res;
//        }

//        public static truncate(input: string, n: number) {
//            var res = input.substr(0, n - 1) + (input.length > n ? '...' : '');
//            return res;
//        }

//        public static uiify(input: string) {
//            var res = input;
//            //res = res.replace(/(\r\n|\n|\r)/gm, '<br>')
//            //res = res.replace(/(http:\/\/[^\s]+)/gi, (match) => {
//            //    return '<a href="' + match + '">' + this.truncate(match, 40) + '</a>' ;
//            //})
//            return res;
//        }
//    }

//    export class ValidationReponse {
//        constructor(
//            public Errors: ValidationError[] = [],
//            public IsValid: boolean = false

//            ) { }
//    }

//    export class ValidationError {
//        constructor(public AttemptedValue: string,
//            public CustomState: any,
//            public ErrorMessage: string,
//            public PropertyName: string

//            ) { }
//    }

//    export class Event {
//        constructor(public sender: any, public payload: any) { }
//    }


//    export class StorageConstants {
//        public static Boardlabel: string = "BOARD-{0}";
//        public static TaskLabel: string = "TASK-{0}";
//        public static Storylabel: string = "STORY-{0}";
//        public static Userlabel: string = "USER-{0}";
//        public static Boards: string = "BOARDS";

//    }


//    export class Status {
//        public static Preparing: number = 1;
//        public static Todo: number = 2;
//        public static Done: number = 3;
//        public static InProgress: number = 4;
//        public static Blocked: number = 5;
//    }

//    //http://www.broofa.com/Tools/Math.uuid.js
//    export class UUID {
//        private static Chars: string[] = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ'.split('');

//        public static create(len: number, radix: number): string {

//            var chars = this.Chars, uuid = [], i;
//            radix = radix || chars.length;

//            if (len) {
//                // Compact form
//                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
//            } else {
//                // rfc4122, version 4 form
//                var r;

//                // rfc4122 requires these characters
//                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
//                uuid[14] = '4';

//                // Fill in random data.  At i==19 set the high bits of clock sequence as
//                // per rfc4122, sec. 4.1.5
//                for (i = 0; i < 36; i++) {
//                    if (!uuid[i]) {
//                        r = 0 | Math.random() * 16;
//                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
//                    }
//                }
//            }

//            return uuid.join('');
//        }
//    }
//}
