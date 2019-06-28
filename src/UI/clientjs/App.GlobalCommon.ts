
module App {
    export class ValidationReponse {
        constructor(
            public Errors: ValidationError[]= [],
            public IsValid: boolean = false
        ) {}
    }

    export class ValidationError {
        constructor(public AttemptedValue: string,
            public CustomState: any,
            public ErrorMessage: string,
            public PropertyName: string
        ) {}
    }

    export class GlobalCommon {
        static timers = [];

        static clearTimers() {
            for (var i = 0; i < GlobalCommon.timers.length; i++) {
                clearTimeout(GlobalCommon.timers[i]);
            }
            GlobalCommon.timers = [];
        }

        static clearTimer(id:number) {
            for (var i = 0; i < GlobalCommon.timers.length; i++) {
                if (GlobalCommon.timers[i] === id) {
                    clearTimeout(GlobalCommon.timers[i]);
                }
            }
        }

        static processPostBack(resp:any, form: JQuery, after: Function) {
            if (resp.IsValid !== "undefined" && resp.IsValid === false) {
                this.apply_validation(resp, form);
            } else {
                after();
            }
        }

        static getFormInputs(form: JQuery): any {
            let input : any = {
            };

            form.find("input[type=text]").each(function(idx, item) {
                var jitem :JQuery = $(item);
                let nameof : any = jitem.attr('name') + ''
                let jitemVal : any = jitem.val()
                input[nameof] = jitemVal;
            });

            form.find("input[type=password]").each(function(idx, item) {
                var jitem = $(item);
                input[jitem.attr("name") + ''] = jitem.val();
            });

            form.find("input[type=hidden]").each(function(idx, item) {
                var jitem = $(item);
                input[jitem.attr("name") + ''] = jitem.val();
            });

            form.find("textarea").each(function(idx, item) {
                var jitem = $(item);

                var txt = jitem.val(); //txt = txt.replace(/</gi, '&lt;');
                //txt = txt.replace(/>/gi, '&gt;');

                input[jitem.attr("name") + ''] = txt;
                //input[jitem.attr('name')] = jitem.val();
            });
            form.find("select").each(function(idx, item) {
                var jitem = $(item);
                input[jitem.attr("name") + ''] = jitem.val();
            });
            form.find("input[type=radio]:checked").each(function(idx, item) {
                var jitem = $(item);
                input[jitem.attr("name") +''] = jitem.val();
            });
            form.find("input[type=checkbox]").each(function(idx, item) {
                var jitem = $(item);
                input[jitem.attr("name") + ''] = jitem.is(":checked") ? 1 : 0;
            });
            return input;
        }

        // utitlity : applies error messages to their respective elements
        static apply_validation(validationResponse: ValidationReponse, form: JQuery): void {
            $(".text-danger, .alert").remove();
            let first: any = null;
            $.each(validationResponse.Errors, (idx, v) => {
                var el = $(`#${v.PropertyName}`);
                if (idx === 0) first = el;
                var message = $(`<div class='text-danger'>${v.ErrorMessage}</div>`).hide();
                el.before(message.fadeIn().fadeOut().fadeIn());
            });
            first.focus();
        }

        static clearErrors() {
            $(".text-danger, .alert").remove();
        }

        static uiify(input: string) {
            var res = input;

            res = res.replace(/</gi, "&lt;");
            res = res.replace(/>/gi, "&gt;");
            res = res.replace(/(\r\n|\n|\r)/gm, "<br>"); //var links = $("<div>" + input + "</div>").find("a");
            //for (var i = 0; i < links.length; i++) {
            //    var link = links[i]
            //    var href = $(link).attr("href");
            //}

            //res = res.replace(/(http:\/\/[^\s]+)/gi, (match) => {
            //   // return '<a href="' + match + '">' + this.truncate(match, 40) + '</a>';
            //    return '<a href="' + match + '" target="_blank">Open</a>'+ match;
            //})
            return res;
        }

        static uploadify(title: string) {
            var help = "<label class='control-label' for='file_upload_1'>{title}</label>".replace("{title}", title);
            var input = "<div class=\"controls\"><input type=\"file\" name=\"file_upload_1\" id=\"file_upload_1\"></input></div>";
            return this.control(help + input);
        }

        static upload(title: string) {
            var help = "<label class='control-label' for='file_upload'>{title}</label>".replace("{title}", title);
            var q = "<div class='controls'><div id='queue'></div>";
            var in2 = "<input id=\"file_upload\" name=\"file_upload\" type=\"file\" multiple=\"multiple\"></input>";
            var click = "&nbsp;&nbsp;&nbsp;<a href=" + "javascript:$('#file_upload').uploadifive('upload')" + ">start</a></div>";
            return this.control(help + q + in2 + click);
        }

        static dropdown(title: string, id: string, nameof: string, data: any[], selectedvalue: string) {
            var help = "<label class='control-label' for='{id}'>{title}</label>".replace("{title}", title).replace("{id}", id);
            var option = "<option value='{id}' {selected}>{valueof}</option>";
            var select = "<div class='controls'><select name='{nameof}' id='{id}'>{options}</select></div>".replace("{nameof}", nameof).replace("{id}", id);
            var selected = "", options = "";

            options += "<option value='-1'>...</option>";
            Enumerable.From(data).ForEach((item) => {
                if (selectedvalue === item) {
                    selected = "selected";
                }
                options += option.replace("{id}", item.id).replace("{valueof}", item.valueof).replace("{selected}", selected);
            });
            return this.control(help + select.replace("{options}", options));
        }

        static input_data_string(nameof: string, label: string, prefix: string) {
            return this.inputstring(nameof, nameof, `{{${prefix}.${nameof}}}`, label, "text");
        }

        static container(content: string) {
            return this.div("", "container", content);
        }

        static isNumber(n : any) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        static form(title: string, fields: string, buttonId?: string, formid?: string, dataid?: string): string {
            var tmp = "<div><form role='form' class='form-vertical' id='{formid}'><div><h3>{0}</h3></div><fieldset>{fields}<div id='errors'/><div><button id={buttonId} {dataid} class='btn btn-primary clearfix'>Submit</button></div></fieldset></form></div>"
                .replace("{0}", title)
                .replace("{fields}", fields);
            if (formid) {
                tmp = tmp.replace("{formid}", formid);
            } else {
                tmp = tmp.replace("{formid}", "form1");
            }

            if (buttonId) {
                tmp = tmp.replace("{buttonId}", buttonId);
            } else {
                tmp = tmp.replace("{buttonId}", "btnsubmit");
            }

            if (dataid) {
                tmp = tmp.replace("{dataid}", `data-id=${dataid}`);
            } else {
                tmp = tmp.replace("{dataid}", "data-id=0");
            }

            return tmp;
        }

        static textarea(id: string, name: string, text: string, help: string, rows: string): string {
            var tmp = "<label class='control-label' for='{5}'>{3}</label>";
            tmp += "<div class='controls'>"; // "ckeditor" cols="80" id="editor1" name="editor1"
            tmp += "<textarea class='form-editing' id='{0}' name='{1}' rows='{4}'>{2}</textarea>";
            if (text === "" || text.indexOf("{{") === 0) {
            } else {
                tmp += "<div class='form-viewing'>Current: {6}</div>";
            }
            tmp += "</div>";
            tmp = tmp.replace("{0}", id)
                .replace("{1}", name)
                .replace("{2}", text.replace(/<br>/gi, "\n"))
                .replace("{3}", help)
                .replace("{4}", rows)
                .replace("{5}", name)
                .replace("{6}", text);
            return this.control(tmp);
        }

        static control(content : any) {
            return this.div("", "control-group", content);
        }

        static div(id: string, cssclass: string, content: string, itemtype?: string) {
            var tmp = "<div {id} {class} {itemtype}>{content}</div>";
            var css = cssclass ? `class='${cssclass}'` : "";
            var ident = id ? `id='${id}'` : "";
            var item = itemtype ? `itemscope itemtype='${itemtype}'` : "";
            return tmp.replace("{id}", ident).replace("{class}", css).replace("{content}", content).replace("{itemtype}", item);
        }

        static checkbox(id: string, name: string, help: string, selected: string) {
            var tmp = this.inputstring(id, name, "", help, "checkbox");
            if (selected === "1") {
                tmp.replace("></input>", "checked></input>");
            }
            return tmp;
        }

        static radio(name: string, value: string, text: string, wrapclass: string, selected: boolean): string {
            var tmp = "<label class='{3}'><input type='radio' name='{0}' value='{1}' {4}/> {2}</label>"
                .replace("{0}", name)
                .replace("{1}", value)
                .replace("{2}", text)
                .replace("{3}", wrapclass)
                .replace("{4}", selected ? "checked" : "");
            return tmp;
        }

        // utitlity
        static inputstring(id: string, name: string, value: string, help: string, type: string, maxlength?: string): string {
            var tmp = "<label class='control-label' for='{5}'>{3}</label>";
            tmp += "<div class='controls'>";
            tmp += "<input class='form-editing' type={4} id='{0}' name='{1}' value='{2}' maxlength={7} ></input>";
            if (help) {
                tmp += "<div class='form-viewing'>{8}</div>";
            }

            tmp += "</div>";
            if (!maxlength) maxlength = "50";
            //"<div class='control-group'><div class='controls'><span class='control-label' for='{5}' >{3}</span><input type={4} id='{0}' placeholder='' name='{1}' value='{2}' maxlength=50 ></input></div></div>"
            tmp = tmp.replace("{0}", id)
                .replace("{1}", name)
                .replace("{2}", value)
                .replace("{3}", help)
                .replace("{4}", type)
                .replace("{5}", id)
                .replace("{6}", help)
                .replace("{7}", maxlength)
                .replace("{8}", value);
            return this.control(tmp);
        }

        private static Chars = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ".split("");

        static truncate(input: string, n: number) {
            var res = input.substr(0, n - 1) + (input.length > n ? "..." : "");
            return res;
        }

        static createUUID(len: number, radix: number): string {
            var chars = this.Chars, uuid = [], i: number;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                // rfc4122, version 4 form
                var r: number;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
                uuid[14] = "4";

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join("");
        }

        static getUrlParams() {
            var result : any = {};
            var match: any,
                pl = /\+/g, // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = (s : string) => decodeURIComponent(s.replace(pl, " ")),
                query = window.location.search.substring(1);
            while (match = search.exec(query))
                result[decode(match[1])] = decode(match[2]);

            return result;
        }

        static readCookie(name : string, c?: any, C?: any, i?: string) {
            //var cookies = app.main.cookies;
            //if (cookies) { return cookies[name]; }

            c = document.cookie.split("; ");
            let cookies : any = {};

            for (let i :number = c.length - 1; i >= 0; i--) {
                C = c[i].split("=");
                cookies[C[0]] = C[1];
            }

            return cookies[name];
        }
    }
}