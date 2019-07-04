namespace Transport {
    
    
    class App {
        init() {
            console.log("Application Intialising...")
        }
    }
    export let app = new App()
    

    class StopsPage {

        get selectedButton() {
            return $("#selectedButton")
        }
        get stopSelections() {
            return $(".stopSelection")
        }

        onSelectedClick(event: any) {
            console.log("Selected button is clicked...")
            
            let stops: string[] = []
            $.each(this.stopSelections,(index, item) =>{

                if( $(item).is(":checked")) {
                    console.log("Add selected stops to array..." +  $(item).attr('data-primaryCode'))
                    stops.push('' + $(item).attr('data-primaryCode'))
                }
            })

            let qarray = [
                "/transport/report?",
                "stopId=" + stops.join(","),
                "multi=" + (stops.length > 1),
                "lookAheadMinutes=120"
            ]

            window.location.href =  qarray.join("&")
        }
    }

    export let stopsPage = new StopsPage()

}
