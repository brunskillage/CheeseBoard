/// <reference path="App.GlobalCommon.ts" />
module App {
    export class ViewCommon {
        static FormInput(id: string, inputtype: string, label: string, classes: string, placeholder: string) {
            var tmp = "<div class = \"control-group\">";
            tmp += `<label class="control-label" for="${id}">${label}</label>`;
            tmp += "<div class = \"controls\" >";
            tmp += `<input type="${inputtype}" id="${id}" class="${classes}" placeholder="${placeholder}"></input>`;
            tmp += "</div>";
            tmp += "</div>";
        }
    }

    export class View {
        static test() {
            return 1;
        }

// utitlity
        static getFormInputs(form: JQuery): any {
            var input:any = {};
            form.find("input[type=text]").each((idx, item) => {
                let jitem : JQuery = $(item);
                input[jitem.attr("name")] = jitem.attr("value");
            });

            form.find("input[type=password]").each((idx, item) => {
                var jitem = $(item);
                input[jitem.attr("name")] = jitem.attr("value");
            });

            form.find("input[type=hidden]").each((idx, item) => {
                var jitem = $(item);
                input[jitem.attr("name")] = jitem.attr("value");
            });

            form.find("textarea").each((idx, item) => {
                var jitem = $(item);
                input[jitem.attr("name")] = jitem.attr("value");
            });

            form.find("select").each((idx, item) => {
                var jitem = $(item);
                input[jitem.attr("name")] = jitem.val();
            });

            form.find("input[type=radio]:checked").each((idx, item) => {
                var jitem = $(item);

                input[jitem.attr("name")] = jitem.attr("value");
            });

            form.find("input[type=checkbox]").each((idx, item) => {
                var jitem = $(item);
                input[jitem.attr("name")] = jitem.attr("checked") === "checked" ? 1 : 0;
            });
            return input;
        }

        static control(content) {
            return this.div("", "control-group", content);
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
            var option = "<option value='{id}' {selected}>{valueof}</option>"
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

        // utitlity
        static form(title: string, fields: string, buttonId?: string, formid?: string): string {
            var tmp = "<div class='span12'><form class='form-horizontal' id='{formid}'>{0}<fieldset>{fields}<div id='errors'/><hr><button id={buttonId} class='btn clearfix'>Submit</button></fieldset></form></div>"
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

            return tmp;
        }

        static input_data_string(nameof: string, label, prefix: string) {
            return this.inputstring(nameof, nameof, `{{${prefix}.${nameof}}}`, label, "text");
        }

        static datadiv(nameof: string, label: string, prefix: string) {
            var label = this.div(nameof, nameof + " span2 datalabel", label);
            var data = this.div(nameof, nameof + " span3 ", `<strong>{{${prefix}.${nameof}}}</strong>`);
            return this.div("", "row", label + data);
        }

        static div(id: string, cssclass: string, content: string) {
            var tmp = "<div id='{id}' class='{class}'>{content}</div>";
            if (!cssclass) {
                cssclass = "";
            }
            if (!id) {
                id = "";
            }
            return tmp.replace("{id}", id).replace("{class}", cssclass).replace("{content}", content);
        }

        static textarea(id: string, name: string, text: string, help: string, rows: string): string {
            var tmp = "<label class='control-label' for='{5}'>{3}</label>";
            tmp += "<div class='controls'>";
            tmp += "<textarea id='{0}' name={1} rows={4}>{2}</textarea>";
            tmp += "</div>";
            tmp = tmp.replace("{0}", id)
                .replace("{1}", name)
                .replace("{2}", text)
                .replace("{3}", help)
                .replace("{4}", rows);

            return this.control(tmp);
        }

        // utitlity
        static inputstring(id: string, name: string, value: string, help: string, type: string): string {
            var tmp = "<label class='control-label' for='{5}'>{3}</label>";
            tmp += "<div class='controls'>";
            tmp += "<input  type={4} id='{0}' name='{1}' value='{2}' maxlength=50 ></input>";
            tmp += "</div>"; //"<div class='control-group'><div class='controls'><span class='control-label' for='{5}' >{3}</span><input type={4} id='{0}' placeholder='' name='{1}' value='{2}' maxlength=50 ></input></div></div>"
            tmp = tmp.replace("{0}", id)
                .replace("{1}", name)
                .replace("{2}", value)
                .replace("{3}", help)
                .replace("{4}", type)
                .replace("{5}", id)
                .replace("{6}", help);
            return this.control(tmp);
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

        // utitlity : applies error messages to their respective elements
        static apply_validation(validationResponse: ValidationReponse, form: JQuery): void {
            $(".text-error, .alert").remove();
            var first: JQuery;
            Enumerable.From(validationResponse.Errors).ForEach((v: ValidationError, idx) => {
                var el = $(`#${v.PropertyName}`);

                if (idx === 0) first = el;
                el.fadeOut().fadeIn().before(`<div class='text-error'>${v.ErrorMessage}</div>`);
            });
            first.focus();
        }

        static Message(type: string, text: string): string {
            return "<div class='alert {0}'>{1}</div>".replace("{0}", type).replace("{1}", text);
        }
    }

    //export class ValidationReponse {
    //    constructor(
    //        public Errors: ValidationError[] = [],
    //        public IsValid: boolean = false

    //        ) { }
    //}

    //export class ValidationError {
    //    constructor(public AttemptedValue: string,
    //        public CustomState: any,
    //        public ErrorMessage: string,
    //        public PropertyName: string

    //        ) { }
    //}
}