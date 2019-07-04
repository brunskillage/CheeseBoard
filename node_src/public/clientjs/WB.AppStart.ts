module WB {
    export class AppStart {
        //private window: Window;
        private static hasSetEvents = false;
        static IsLoggedIn = false;
        static UserId = 0;
        static Email = "";

        static start() {
            var html = Account.LoginBarView.getHtml();
            $("#user_bar").html(html);

            this.registerEvents();
            this.registerRoutes();
            this.gotoBoardIfExists();
        }

        static showSignedInBits() {
            var html = Account.LoginBarView.getHtml();
            $("#user_bar").html(html);
        }

        static hideSignedInBits() {
            $("#user_bar").html("");
        }

        static registerRoutes() {
            window.routie({
                'user/:id': (data:any) => UserController.USER_GET(data),
                'boards': () => BoardController.BOARDS_LIST(),
                'boards/addshared': (data:any) => BoardController.USER_ADD_SHARED_BOARD(data),
                'boards/add': () => BoardController.BOARD_ADD(),
                'board/:hash/config': (hash:any) => BoardController.BOARD_GET_CONFIGURATION(hash),
                'board/:hash/delete': (hash:any) => BoardController.BOARD_DELETE(hash),
                'board/:hash/addstory': (hash:any) => StoryController.STORY_ADD_TO_BOARD(hash),
                'board/:hash/archive': (hash:any) => BoardController.BOARD_GET_ARCHIVE(hash),
                'board/:hash/simple': (hash:any) => BoardController.BOARD_GET_SIMPLE(hash),
                'board/:hash/list': (hash:any) => BoardController.BOARD_GET_LIST(hash),
                'board/:hash': (hash:any) => BoardController.BOARD_GET(hash),
                'task/addtostory/:id/:hash': (id:any, hash:any) => TaskController.TASK_ADD_TO_STORY(id, hash),
                'task/:id': (id:any) => TaskController.TASK_GET(id),
                'task/delete/:id': (id:any) => TaskController.TASK_DELETE(id),
                'task/:id/addlog': (id:any) => TaskController.TASK_ADD_LOG(),
                'task/:id/log': (id:any) => LogController.SHOW_TASK_LOG(id),
                'story/:id/delete': (id:any) => StoryController.STORY_DELETE(id),
                'story/:id': (id:any) => StoryController.STORY_GET(id), // OK
                '/': () => BoardController.BOARDS_LIST(),
                '': () => BoardController.BOARDS_LIST()
            });
        }

        private static registerEvents() {
            if (!this.hasSetEvents) {

                amplify.subscribe("getLoginView", () => this.showSignedInBits());
                this.hasSetEvents = true;
            }
        }

        private static gotoBoardIfExists() {
            var lastBoard = amplify.store("last_board_hash");
            if (lastBoard) {
                window.routie("board/" + lastBoard)
            }
        }
    }
}

WB.AppStart.start();