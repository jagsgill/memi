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
var STATUS = require("../../util/errorcodes.js").STATUS;
var DiskUsageService = (function () {
    function DiskUsageService() {
        this.diskQueryFinishedEvent = new core_1.EventEmitter();
        // http://onehungrymind.com/electron-angular-2-things/
        electron_1.ipcRenderer.on("clientRequestDiskUsageForPath", this.sendParsedDiskUsageForPath.bind(this));
    }
    DiskUsageService.prototype.diskUsage = function (path) {
        console.log("sending path: " + path);
        electron_1.ipcRenderer.send("clientRequestDiskUsageForPath", paths.normalize(path));
    };
    DiskUsageService.prototype.sendParsedDiskUsageForPath = function (event, output, dir) {
        var rawdata = output.content.split("\n"), entries_to_process = rawdata.slice(0, -2), // trim the total line and 2x
        entries, summary;
        if (output.status === STATUS.OK) {
            entries = entries_to_process.map(function (e) {
                var obj = {}, data = e.split(/:/);
                obj["fname"] = data[1].toString();
                obj["fsize"] = data[0].toString();
                obj["type"] = data[2].toString();
                return obj;
            });
            summary = (function () {
                var data = rawdata[rawdata.length - 1].split(/:/), obj = {};
                obj["totalsize"] = data[0];
                obj["cwd"] = data[1]; // normalized path from system
                return obj;
            })();
        }
        else if (output.status === STATUS.DIR_NOT_EXIST) {
            entries = {};
            summary = { totalsize: "0", cwd: dir };
        }
        console.log(output.status);
        console.log(entries);
        console.log(summary);
        this.diskQueryFinishedEvent.emit(new DiskUsageResult(output.status, entries, summary));
    };
    return DiskUsageService;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DiskUsageService.prototype, "diskQueryFinishedEvent", void 0);
DiskUsageService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], DiskUsageService);
exports.DiskUsageService = DiskUsageService;
var DiskUsageResult = (function () {
    function DiskUsageResult(status, entries, summary) {
        this.status = status;
        this.entries = entries;
        this.summary = summary;
    }
    return DiskUsageResult;
}());
exports.DiskUsageResult = DiskUsageResult;
//# sourceMappingURL=disk-usage-for-path.service.js.map