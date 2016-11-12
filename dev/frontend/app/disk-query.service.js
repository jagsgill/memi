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
var paths = require("path");
var DiskQueryService = (function () {
    function DiskQueryService() {
        this.diskQueryFinishedEvent = new core_1.EventEmitter();
        // http://onehungrymind.com/electron-angular-2-things/
        electron_1.ipcRenderer.on("clientRequestDiskUsageForPath", this.sendParsedDiskUsageForPath.bind(this));
    }
    DiskQueryService.prototype.diskUsage = function (path) {
        console.log("sending path: " + path);
        electron_1.ipcRenderer.send("clientRequestDiskUsageForPath", paths.normalize(path));
    };
    DiskQueryService.prototype.sendParsedDiskUsageForPath = function (event, output, dir) {
        var rawdata = output.split("\n");
        var entries_to_process = rawdata.slice(0, -3); // trim the total line and 2x
        var entries = entries_to_process.map(function (e) {
            var obj = {}, data = e.split(/:/);
            obj["fname"] = data[1].toString();
            obj["fsize"] = data[0].toString();
            obj["type"] = data[2].toString();
            return obj;
        });
        var summary = (function () {
            var data = rawdata[rawdata.length - 2].split(/:/), obj = {};
            console.log("summary data: ", data);
            obj["totalsize"] = data[0];
            obj["cwd"] = data[1];
            return obj;
        })();
        console.log(entries);
        console.log(summary);
        console.log("before emit");
        this.diskQueryFinishedEvent.emit({ "entries": entries, "summary": summary });
    };
    return DiskQueryService;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DiskQueryService.prototype, "diskQueryFinishedEvent", void 0);
DiskQueryService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], DiskQueryService);
exports.DiskQueryService = DiskQueryService;
//# sourceMappingURL=disk-query.service.js.map