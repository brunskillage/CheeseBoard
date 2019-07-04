import {BristolApiClient} from './bristolApiClient'
import moment from 'moment'
import { resolve } from 'dns';

export class transportController {

    constructor(){
        //this.getAgencies().then(result => console.dir(this.agencies))
    }

    sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    report(data : any){

      console.dir(data)

       if(data.stopId.length){

           let stopIds = data.stopId.split(",")
          console.dir("stopids are " + stopIds)

           let promises: Promise<any>[]  = []
           stopIds.forEach((element: any) => {
             console.log("Element is " + element)
               let req = data;
               req.stopId = element

               promises.push(BristolApiClient.getReport(data))
               
           })


          return Promise.all(promises).then(results => {
            
            console.dir(results);
            let merged = results[0] 
            for(let i = 0; i < results.length; i++){
              let currentResult = results[i];

              for(let i = 0;i<currentResult.data.rtiReports.length;i++){

                  let rtiReport = currentResult.data.rtiReports[i]
                  
                  for(let j = 0;j<rtiReport.upcomingCalls.length;j++){
                      
                      let upcomingCall = rtiReport.upcomingCalls[j]
                      
                      this.setNiceDate(upcomingCall)
                      console.dir(upcomingCall)
                  }
              }
    
              currentResult.data.primaryExpectedMinutes = currentResult.data.rtiReports[0].upcomingCalls[0].expectedMinutes
              currentResult.data.minuteText = this.getMinutesText( currentResult.data.primaryExpectedMinutes );
            }

            return {results: results};
          })
       }
    }

    getMinutesText(minutes : number) {
      return minutes > 1 ? 'minutes' : 'minute'
    }

    stops(data: any) {
        return BristolApiClient.getStaticTransitStops(data).then((result: any) => {
            for(let j = 0;j<result.data.length;j++){
                    
                let transitStop = result.data[j]
                
                transitStop.cardinalBearing = this.getCardinalBearing(<number>transitStop.bearing)
                console.dir(transitStop)
            }

            return result;  
        })
    }



    private setNiceDate(upcomingCall: any){

        if(upcomingCall.expectedArrivalTime){
            var a = moment(upcomingCall.expectedArrivalTime)
            var b = moment(upcomingCall.scheduledCall.scheduledArrivalTime)

            var difference = a.diff(b,'minutes')
            var expectedMinutes = a.diff(moment(),'minutes')
            upcomingCall.expectedArrivalTimeNice = expectedMinutes +  ' ' + this.getMinutesText(expectedMinutes) 

            if(difference > 0){
                upcomingCall.difference = difference
                upcomingCall.expectedMinutes = a.diff(moment(),'minutes')
            }
        }

        upcomingCall.scheduledCall.scheduledArrivalTimeNice = moment(upcomingCall.scheduledCall.scheduledArrivalTime).format("HH:mm");
    }

    private getCardinalBearing(deg:number): string{
        if (deg>11.25 && deg<33.75){
            return "NNE";
          }else if (deg>33.75 && deg<56.25){
            return "ENE";
          }else if (deg>56.25 && deg<78.75){
            return "E";
          }else if (deg>78.75 && deg<101.25){
            return "ESE";
          }else if (deg>101.25 && deg<123.75){
            return "ESE";
          }else if (deg>123.75 && deg<146.25){
            return "SE";
          }else if (deg>146.25 && deg<168.75){
            return "SSE";
          }else if (deg>168.75 && deg<191.25){
            return "S";
          }else if (deg>191.25 && deg<213.75){
            return "SSW";
          }else if (deg>213.75 && deg<236.25){
            return "SW";
          }else if (deg>236.25 && deg<258.75){
            return "WSW";
          }else if (deg>258.75 && deg<281.25){
            return "W";
          }else if (deg>281.25 && deg<303.75){
            return "WNW";
          }else if (deg>303.75 && deg<326.25){
            return "NW";
          }else if (deg>326.25 && deg<348.75){
            return "NNW";
          }else{
            return "N"; 
          }
    }

}

export var TransportController = new transportController()


