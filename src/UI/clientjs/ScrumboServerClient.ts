/// <reference path="app.serviceclient.ts" />
module WB {
    export class ScrumboServerClient extends App.ServerClientBase {
        constructor() {
            super("/api/v1/call");
        }
        // test
    }
}