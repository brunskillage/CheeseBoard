"use strict";
/// <reference path="App.GlobalCommon.ts" />
var App;
(function (App) {
    var ViewCommon = /** @class */ (function () {
        function ViewCommon() {
        }
        ViewCommon.FormInput = function (id, inputtype, label, classes, placeholder) {
            var tmp = "<div class = \"control-group\">";
            tmp += "<label class=\"control-label\" for=\"" + id + "\">" + label + "</label>";
            tmp += "<div class = \"controls\" >";
            tmp += "<input type=\"" + inputtype + "\" id=\"" + id + "\" class=\"" + classes + "\" placeholder=\"" + placeholder + "\"></input>";
            tmp += "</div>";
            tmp += "</div>";
        };
        return ViewCommon;
    }());
    App.ViewCommon = ViewCommon;
    var View = /** @class */ (function () {
        function View() {
        }
        View.test = function () {
            return 1;
        };
        // utitlity
        View.getFormInputs = function (form) {
            var input = {};
            form.find("input[type=text]").each(function (idx, item) {
                var jitem = $(item);
                input[jitem.attr("name")] = jitem.attr("value");
            });
            form.find("input[type=password]").each(function (idx, item) {
                var jitem = $(item);
                input[jitem.attr("name")] = jitem.attr("value");
            });
            form.find("input[type=hidden]").each(function (idx, item) {
                var jitem = $(item);
                input[jitem.attr("name")] = jitem.attr("value");
            });
            form.find("textarea").each(function (idx, item) {
                var jitem = $(item);
                input[jitem.attr("name")] = jitem.attr("value");
            });
            form.find("select").each(function (idx, item) {
                var jitem = $(item);
                input[jitem.attr("name")] = jitem.val();
            });
            form.find("input[type=radio]:checked").each(function (idx, item) {
                var jitem = $(item);
                input[jitem.attr("name")] = jitem.attr("value");
            });
            form.find("input[type=checkbox]").each(function (idx, item) {
                var jitem = $(item);
                input[jitem.attr("name")] = jitem.attr("checked") === "checked" ? 1 : 0;
            });
            return input;
        };
        View.control = function (content) {
            return this.div("", "control-group", content);
        };
        View.upload = function (title) {
            var help = "<label class='control-label' for='file_upload'>{title}</label>".replace("{title}", title);
            var q = "<div class='controls'><div id='queue'></div>";
            var in2 = "<input id=\"file_upload\" name=\"file_upload\" type=\"file\" multiple=\"multiple\"></input>";
            var click = "&nbsp;&nbsp;&nbsp;<a href=" + "javascript:$('#file_upload').uploadifive('upload')" + ">start</a></div>";
            return this.control(help + q + in2 + click);
        };
        View.dropdown = function (title, id, nameof, data, selectedvalue) {
            var help = "<label class='control-label' for='{id}'>{title}</label>".replace("{title}", title).replace("{id}", id);
            var option = "<option value='{id}' {selected}>{valueof}</option>";
            var select = "<div class='controls'><select name='{nameof}' id='{id}'>{options}</select></div>".replace("{nameof}", nameof).replace("{id}", id);
            var selected = "", options = "";
            options += "<option value='-1'>...</option>";
            Enumerable.From(data).ForEach(function (item) {
                if (selectedvalue === item) {
                    selected = "selected";
                }
                options += option.replace("{id}", item.id).replace("{valueof}", item.valueof).replace("{selected}", selected);
            });
            return this.control(help + select.replace("{options}", options));
        };
        // utitlity
        View.form = function (title, fields, buttonId, formid) {
            var tmp = "<div class='span12'><form class='form-horizontal' id='{formid}'>{0}<fieldset>{fields}<div id='errors'/><hr><button id={buttonId} class='btn clearfix'>Submit</button></fieldset></form></div>"
                .replace("{0}", title)
                .replace("{fields}", fields);
            if (formid) {
                tmp = tmp.replace("{formid}", formid);
            }
            else {
                tmp = tmp.replace("{formid}", "form1");
            }
            if (buttonId) {
                tmp = tmp.replace("{buttonId}", buttonId);
            }
            else {
                tmp = tmp.replace("{buttonId}", "btnsubmit");
            }
            return tmp;
        };
        View.input_data_string = function (nameof, label, prefix) {
            return this.inputstring(nameof, nameof, "{{" + prefix + "." + nameof + "}}", label, "text");
        };
        View.datadiv = function (nameof, label, prefix) {
            var label = this.div(nameof, nameof + " span2 datalabel", label);
            var data = this.div(nameof, nameof + " span3 ", "<strong>{{" + prefix + "." + nameof + "}}</strong>");
            return this.div("", "row", label + data);
        };
        View.div = function (id, cssclass, content) {
            var tmp = "<div id='{id}' class='{class}'>{content}</div>";
            if (!cssclass) {
                cssclass = "";
            }
            if (!id) {
                id = "";
            }
            return tmp.replace("{id}", id).replace("{class}", cssclass).replace("{content}", content);
        };
        View.textarea = function (id, name, text, help, rows) {
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
        };
        // utitlity
        View.inputstring = function (id, name, value, help, type) {
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
        };
        View.checkbox = function (id, name, help, selected) {
            var tmp = this.inputstring(id, name, "", help, "checkbox");
            if (selected === "1") {
                tmp.replace("></input>", "checked></input>");
            }
            return tmp;
        };
        View.radio = function (name, value, text, wrapclass, selected) {
            var tmp = "<label class='{3}'><input type='radio' name='{0}' value='{1}' {4}/> {2}</label>"
                .replace("{0}", name)
                .replace("{1}", value)
                .replace("{2}", text)
                .replace("{3}", wrapclass)
                .replace("{4}", selected ? "checked" : "");
            return tmp;
        };
        // utitlity : applies error messages to their respective elements
        View.apply_validation = function (validationResponse, form) {
            $(".text-error, .alert").remove();
            var first;
            Enumerable.From(validationResponse.Errors).ForEach(function (v, idx) {
                var el = $("#" + v.PropertyName);
                if (idx === 0)
                    first = el;
                el.fadeOut().fadeIn().before("<div class='text-error'>" + v.ErrorMessage + "</div>");
            });
            first.focus();
        };
        View.Message = function (type, text) {
            return "<div class='alert {0}'>{1}</div>".replace("{0}", type).replace("{1}", text);
        };
        return View;
    }());
    App.View = View;
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
})(App || (App = {}));
