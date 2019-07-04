import stringService from './../services/stringService'

class homeController {
        public index(req: any, res: any){
            return {
                sitename : stringService.sitename 
            }
        }
}


export = new homeController()