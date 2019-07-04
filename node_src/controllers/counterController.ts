import fs from 'fs'
import path from 'path'

export class CounterArgs {

    public current = 0
    public prefix = "A"

}

export class CounterAllProps {

    constructor(counterArgs: CounterArgs){
        this.current = counterArgs.current
        this.prefix = counterArgs.prefix
    }

    public current = 0;
    public prefix = '';
    public value = '';
    public next = '';
}

export class counterController {

        counters : CounterAllProps[] = []
        error: string = ''

        constructor() {
             if(!fs.existsSync(this.getFilePath())) {
                this.save()
             }
             else {
                 this.load()  
             } 
        }

        addTestCounters() {

            var counter1 = new CounterArgs()
            counter1.prefix = 'C';
            counter1.current = 0;

            this.counters.push(new CounterAllProps(counter1))

            var counter2 = new CounterArgs()
            counter1.prefix = 'P';
            counter1.current = 100;
            this.counters.push(new CounterAllProps(counter2)) 

            this.save()
        }

        index(req: any){
            return {
                counters: this.counters
            }
        }

        add(req:any){
            this.error = ''
            var counter = new CounterArgs()
            counter.prefix = req.params.prefix;
            counter.current = req.params.startNum;

            if(this.findIndex(counter.prefix) >= 0){
               this.error = 'Counter ' + counter.prefix + ' already exists, not added.' 
            }
            else {
                this.counters.push(new CounterAllProps(counter))
            }
            this.save()
            return {counters : this.counters, error : this.error};
        }

        
        set(req:any){

            console.log("Calling set..." +req.params.number )  

            this.change(req, "=", req.params.number)
        }

        tick(req: any) {

            console.log("Calling tick...")  

            this.change(req, "+", 1)
        }

        back(req: any) {

            console.log("Calling back...")  

            this.change(req, "-", 1)
        }

        private getChangeFunction (operator: string, amount: number) : Function  {

            if(operator === "+")
                return (item: number, amount: number) => item + amount 
            else if(operator === "-")
                return (item: number,amount: number) => item - amount
            else if(operator === "=")
                return (item: number,amount: number) => item = amount 
            else
                return (item: number,amount: number) => item + 0
        }

        private change(req: any, operator: string, amount: number){
            
            this.error = ''

            var func = this.getChangeFunction(operator, amount)

            let index = this.findIndex(req.params.prefix)

            if(index >= 0) {
                let item = this.counters[index]
                console.log("item.Current=" + item.current)
                item.current = func(item.current, +amount)
                console.log("item.Current=" + item.current)
                item.next = item.prefix + (item.current + 1);
                item.value = item.prefix + item.current;
                this.save()
             }
             else {
                 this.error = 'Counter ' + req.params.prefix + ' not found.'  
             }
             
             return {counters : this.counters, error : this.error};
        }

        private findIndex(prefix: string) : number {

            for(var i = 0; i < this.counters.length; i++) {
                let item = this.counters[i]
                if(item.prefix === prefix) {
                    console.log("Found counter with prefix " + prefix )
                    return i;
                }
            }

            return -1;            
        }   

        private save(){
            console.log("Saving file...")
            fs.writeFile(this.getFilePath(), JSON.stringify(this.counters),  (err) => {
                if (err) return console.log(err);
                console.log('file written to ' + CounterController.getFilePath());
            });
        }

        load(){
            console.log('Loading counters...')
            fs.readFile(this.getFilePath(), (err, data: any) => {
                CounterController.counters = JSON.parse(data);
            })
        }

        private getFilePath() {
            return path.join(__dirname, './../db/counters.txt')  
        }
}

export var CounterController = new counterController()


  
