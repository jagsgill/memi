"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var electron_1 = require("electron");
var DiskQueryService = (function () {
    function DiskQueryService() {
    }
    DiskQueryService.prototype.ngOnInit = function () {
    };
    DiskQueryService.prototype.diskUsage = function (path) {
        var result;
        // set listener
        electron_1.ipcRenderer.once('clientRequestDiskUsageCurrDir', function (event, output, dir) {
            // TODO inject correct logic depending on platform/command output
            // OR enforce an output format for this command for all platforms
            // i.e. simplify logic in either the backend or in the frontend
            var rawdata = output.split("\n");
            var entries_to_process = rawdata.slice(0, -3); // trim total line, 2x ""
            var entries = entries_to_process.map(function (e) {
                var obj = {}, data = e.split(/:/);
                obj['fname'] = data[1].toString();
                obj['fsize'] = data[0].toString();
                obj['type'] = data[2].toString();
                return obj;
            });
            var summary = (function () {
                var data = rawdata[rawdata.length - 3].split(/:/), obj = {};
                obj['totalsize'] = data[0];
                obj['curr_dir'] = dir;
                return obj;
            })();
            console.log(entries);
            console.log(summary);
            result = { 'entries': entries, 'summary': summary };
        });
        // submit query
        console.log("sending path: " + path);
        electron_1.ipcRenderer.send('clientRequestDiskUsageForPath', path);
        // return once async call completes
        // TODO ensure non-empty string is sent for queries that return no result
        // TODO use Promises/deferred?
        setTimeout(function () {
            if (result)
                return result;
        }, 500);
    };
    return DiskQueryService;
}());
DiskQueryService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], DiskQueryService);
exports.DiskQueryService = DiskQueryService;
//# sourceMappingURL=disk-query.service.js.map