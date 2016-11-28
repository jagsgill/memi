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
var ListDirService = (function () {
    function ListDirService() {
        this.listDirFinishedEvent = new core_1.EventEmitter();
        this.channel = "requestListDirContents";
        electron_1.ipcRenderer.on(this.channel, this.listDirContentsHandler.bind(this));
    }
    ListDirService.prototype.listDirContents = function (path) {
        console.log("sending path for list dir contents: " + path);
        electron_1.ipcRenderer.send(this.channel, paths.normalize(path));
    };
    ListDirService.prototype.listDirContentsHandler = function (event, output, dir) {
        console.log("ls event:");
        console.log(event);
        console.log("received result");
        console.log(output);
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