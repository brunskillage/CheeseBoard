namespace server {
    export class stringService {
        get sitename() : string {
            return "Node js full template site"
        }

    }
}

export = new server.stringService();  