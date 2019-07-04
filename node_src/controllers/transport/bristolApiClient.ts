import fetch from 'node-fetch'

class bristolApiClient {

    private apiKey : string = "D7OVIzqEGEGX26FQ1I5mVw"

    private get rootUrl() {
        return 'https://bristol.api.urbanthings.io/api/2.0'
    }

    agencies : any[] = []
    importSources : any[] = []

    constructor(){

        // console.log("Getting agencies...")
        // this.getData('/static/agencies',{ importSource: 'TNDS'}).then(res=> 
        //     {
        //         this.agencies = res.data
        //         console.dir(this.agencies)
        //     })

        // console.log("Getting import sources...")
        // this.getData('/static/importsources',{ }).then(res=> 
        //     {
        //         this.importSources = res.data
        //         console.dir(this.importSources)
        //     })
    }



    objectToQueryString(obj:any){

        obj.apiKey = this.apiKey

        var q = []

        for(var p in obj){
            q.push(p + '=' + obj[p])
        }

        return '?' + q.join('&')
    }

    getData(urlPath : string, data: any) {   
        
        let url = this.rootUrl + urlPath + this.objectToQueryString(data)
        console.log("getData with url..." + url)

        //return fetch('https://bristol.api.urbanthings.io/api/2.0/static/transitstops?centerLat=51.492946&centerLng=-2.646601&radius=500&apiKey=D7OVIzqEGEGX26FQ1I5mVw',
        return fetch(url,
        {
            headers:{ Accept: 'application/json' }
        }).then((result: any) => {
            // console.dir(result.json())
            return result.json()
        })
    }


    getStaticTransitStops(data : any) {
        return this.getData('/static/transitstops', data)
    }



    getReport(data : any) {
        return this.getData('/rti/report', data)
    }

    getAgencies() : Promise<any> {

        return new Promise((resolve, reject) =>{
            resolve(this.agencies),
            reject()  
        })
    }

    getImportSources() : Promise<any> {
        return new Promise((resolve, reject) =>{
            resolve(this.importSources),
            reject()  
        })
    }
}

export var BristolApiClient = new bristolApiClient()

class coordinates {
     constructor(
        public lat: number, public lng : number
     ) {}
}