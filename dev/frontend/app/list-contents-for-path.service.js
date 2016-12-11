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
var rxjs_1 = require("rxjs");
var STATUS = require("../../util/errorcodes.js").STATUS;
var ListDirService = (function () {
    function ListDirService() {
        var _this = this;
        this.listDirFinishedEvent = new core_1.EventEmitter();
        this.channel = "requestListDirContents";
        this.resultStream = rxjs_1.Observable.fromEvent(electron_1.ipcRenderer, this.channel, function (event, output) {
            return _this.parseListDirResults(output);
        });
    }
    ListDirService.prototype.getResultStream = function () {
        return this.resultStream;
    };
    ListDirService.prototype.listDirContents = function (path) {
        console.log("sending path for list dir contents: " + path);
        electron_1.ipcRenderer.send(this.channel, path);
    };
    ListDirService.prototype.parseListDirResults = function (output) {
        var entries;
        if (output.status === STATUS.OK) {
            entries = output.content.split("\n");
        }
        else if (output.status === STATUS.DIR_NOT_EXIST) {
            entries = ["Path does not exist."];
        }
        return { entries: entries, dir: output.dir };
    };
    return ListDirService;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ListDirService.prototype, "listDirFinishedEvent", void 0);
ListDirService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], ListDirService);
exports.ListDirService = ListDirService;
//# sourceMappingURL=list-contents-for-path.service.js.map