"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var CounterArgs = /** @class */ (function () {
    function CounterArgs() {
        this.current = 0;
        this.prefix = "A";
    }
    return CounterArgs;
}());
exports.CounterArgs = CounterArgs;
var CounterAllProps = /** @class */ (function () {
    function CounterAllProps(counterArgs) {
        this.current = 0;
        this.prefix = '';
        this.value = '';
        this.next = '';
        this.current = counterArgs.current;
        this.prefix = counterArgs.prefix;
    }
    return CounterAllProps;
}());
exports.CounterAllProps = CounterAllProps;
var counterController = /** @class */ (function () {
    function counterController() {
        this.counters = [];
        this.error = '';
        if (!fs_1.default.existsSync(this.getFilePath())) {
            this.save();
        }
        else {
            this.load();
        }
    }
    counterController.prototype.addTestCounters = function () {
        var counter1 = new CounterArgs();
        counter1.prefix = 'C';
        counter1.current = 0;
        this.counters.push(new CounterAllProps(counter1));
        var counter2 = new CounterArgs();
        counter1.prefix = 'P';
        counter1.current = 100;
        this.counters.push(new CounterAllProps(counter2));
        this.save();
    };
    counterController.prototype.index = function (req) {
        return {
            counters: this.counters
        };
    };
    counterController.prototype.add = function (req) {
        this.error = '';
        var counter = new CounterArgs();
        counter.prefix = req.params.prefix;
        counter.current = req.params.startNum;
        if (this.findIndex(counter.prefix) >= 0) {
            this.error = 'Counter ' + counter.prefix + ' already exists, not added.';
        }
        else {
            this.counters.push(new CounterAllProps(counter));
        }
        this.save();
        return { counters: this.counters, error: this.error };
    };
    counterController.prototype.set = function (req) {
        console.log("Calling set..." + req.params.number);
        this.change(req, "=", req.params.number);
    };
    counterController.prototype.tick = function (req) {
        console.log("Calling tick...");
        this.change(req, "+", 1);
    };
    counterController.prototype.back = function (req) {
        console.log("Calling back...");
        this.change(req, "-", 1);
    };
    counterController.prototype.getChangeFunction = function (operator, amount) {
        if (operator === "+")
            return function (item, amount) { return item + amount; };
        else if (operator === "-")
            return function (item, amount) { return item - amount; };
        else if (operator === "=")
            return function (item, amount) { return item = amount; };
        else
            return function (item, amount) { return item + 0; };
    };
    counterController.prototype.change = function (req, operator, amount) {
        this.error = '';
        var func = this.getChangeFunction(operator, amount);
        var index = this.findIndex(req.params.prefix);
        if (index >= 0) {
            var item = this.counters[index];
            console.log("item.Current=" + item.current);
            item.current = func(item.current, +amount);
            console.log("item.Current=" + item.current);
            item.next = item.prefix + (item.current + 1);
            item.value = item.prefix + item.current;
            this.save();
        }
        else {
            this.error = 'Counter ' + req.params.prefix + ' not found.';
        }
        return { counters: this.counters, error: this.error };
    };
    counterController.prototype.findIndex = function (prefix) {
        for (var i = 0; i < this.counters.length; i++) {
            var item = this.counters[i];
            if (item.prefix === prefix) {
                console.log("Found counter with prefix " + prefix);
                return i;
            }
        }
        return -1;
    };
    counterController.prototype.save = function () {
        console.log("Saving file...");
        fs_1.default.writeFile(this.getFilePath(), JSON.stringify(this.counters), function (err) {
            if (err)
                return console.log(err);
            console.log('file written to ' + exports.CounterController.getFilePath());
        });
    };
    counterController.prototype.load = function () {
        console.log('Loading counters...');
        fs_1.default.readFile(this.getFilePath(), function (err, data) {
            exports.CounterController.counters = JSON.parse(data);
        });
    };
    counterController.prototype.getFilePath = function () {
        return path_1.default.join(__dirname, './../db/counters.txt');
    };
    return counterController;
}());
exports.counterController = counterController;
exports.CounterController = new counterController();
