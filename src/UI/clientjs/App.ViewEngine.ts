/// <reference path="../libs/all.d.ts" />

module App {
    export class ViewEngine {
        static renderview(viewname: string, data: any, partials?: any) {
            var html = Mustache.render(viewname, data, partials);
            this.setAppHtml(html);
            return html;
        }

        static getHtml(viewname: string, data: any, partials?: any): string {
            return Mustache.render(viewname, data, partials);
        }

        static setAppHtml(html: string) {
            //getAppEl().hide().html(html).fadeIn();

            amplify.store("last_page", window.location.toString());
            this.getAppEl().html(html);
        }

        static getAppEl(): JQuery {
            return $("#app");
        }

        static setElHtml(selector: string, html: string): JQuery {
            var el = $(selector);
            el.html(html);
            return el;
        }

        static ClearScreen() {
            this.getAppEl().html("");
        }

        static ReloadPage() {
            //window.location.reload();
        }

        static tmpl: any = {};

        static parseTemplateHtml(html: string) {
            var h = $(html);
            var alldivs = h.filter("div");
            $.each(alldivs, (idx, div) => {
                var d = $(div);
                ViewEngine.tmpl[d.attr("data-tmpl")] = d.html().trim().replace(/\s+/g, " ");
            });
        }
    }
}