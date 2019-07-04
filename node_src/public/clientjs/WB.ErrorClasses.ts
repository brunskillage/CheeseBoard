/// <reference path="../libs/all.d.ts" />
module WB {

    export class Error {
        constructor(public title: string, public message: string, public exception: any) {}
    }

    export class ErrorController {
        static Show(error: Error) {
            ErrorView.render(error);
        }
    }

    export class ErrorView {
        static render(error: Error): void {
            var munge = this.getErrorView(error.title, error.message);
            $("#errors").html(munge);
        }

        static getErrorView(title: string, message: string) {
            var tmp = this.getTemplate();
            return tmp
                .replace("{0}", title)
                .replace("{1}", message);
        }

        static getTemplate() {
            return "<div class=row><div class='span4 alert alert-error'><strong>{0}</strong> {1}</div></div>";
        }
    }
}