/// <reference path="App.GlobalCommon.ts" />
module App {
    export class Payload {
        constructor(public methodName: string, public data: any) {
        }
    }

    export class ServerClientBase {
        private _endpoint = "";

        constructor(endpoint: string) {
            if (!endpoint) {
                throw Error("No endpoint");              
            }

            this._endpoint = endpoint;
        }

        private translate(input: string) {
            var res = "";
            for (var i = 0; i < input.length; i++) {
                res += String.fromCharCode(1083756 ^ input.charCodeAt(i));  
            }
            return res;
        }

        private sendPayload(payload: Payload, next: Function) {
            if (!payload) {
                throw Error("No payload");
            }

            return $.ajax({
                type: "POST",
                url: this._endpoint,
                headers: {
                    "UserId": GlobalCommon.readCookie("UserId"),
                    "Auth": GlobalCommon.readCookie("Auth")
                },
                dataType: "JSON",
                cache: false,
                contentType: "application/json; charset=utf-8",
                //data: this.translate(JSON.stringify(payload)),
                data: JSON.stringify(payload),
                success: (data, b, c) => {
                    if (data && data.code && data.code === 401) {
                        window.location.href = "/login";
                        return;
                    }
                    next(data);
                },
                error: () => {},
                statusCode: {
                    // 401: () => window.location.href = '/login',
                    404: (resp) => this.SetError(resp),
                    403: () => window.location.href = "/login",
                    500: (resp) => this.SetError(resp)
                }
            });
        }

         private SetError(resp) {
            $(".navbar-fixed-bottom").empty();
            $("#user_bar").empty();
            ViewEngine.setAppHtml(resp.responseText);
        }

        CallMethod(methodName: string, data: any, simple? : boolean) {
            var payload = new Payload(methodName, data);
            data.user_id = 1;
            return this.sendPayload(payload, (data) => {
                //amplify.publish(methodName + "_reply", data);
            });
        }
    }
}