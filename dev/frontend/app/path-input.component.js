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
var rxjs_1 = require("rxjs");
var paths = require("path");
var disk_usage_for_path_service_1 = require("./disk-usage-for-path.service");
var list_contents_for_path_service_1 = require("./list-contents-for-path.service");
var STATUS = require("../../util/errorcodes.js").STATUS;
var PathInputComponent = (function () {
    function PathInputComponent(diskQueryService, listDirService, changeDetectorRef) {
        var _this = this;
        this.diskQueryService = diskQueryService;
        this.listDirService = listDirService;
        this.changeDetectorRef = changeDetectorRef;
        // TODO path completio
        this.iconToParentDir = require("./icons/ic_subdirectory_arrow_right_black_24px.svg");
        this.path = ""; // user path in input box
        this.dirname = ""; // directory path for autocomplete entries
        this.autocompletePaths = [];
        this.autocompleteActive = false;
        this.listDirResultStream = listDirService.getResultStream()
            .subscribe(function (result) { return _this.listDirQueryHandler(result); });
    }
    PathInputComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.diskQueryService.diskQueryFinishedEvent.subscribe(function (result) { return _this.diskQueryFinishedHandler(result); });
    };
    PathInputComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.inputBoxStreamSource = rxjs_1.Observable.fromEvent(this.pathInputBox.nativeElement, "input", function (x) { return x.target.value; });
        this.inputBoxStream = this.inputBoxStreamSource
            .map(function (x) {
            var regexDir = /.*\/$/; // directories end in '/'
            if (regexDir.test(x)) {
                _this.dirname = x;
                return x; // identity mapping if its a dir
            }
            else {
                _this.dirname = paths.dirname(x) + "/";
                return paths.dirname(x) + "/"; // map to parent dir otherwise
            }
        })
            .subscribe(function (x) { _this.listDirQuery(x); });
    };
    PathInputComponent.prototype.sendDiskUsageQuery = function (path) {
        // TODO replace console.log with dev logging
        console.log("Analyzing path: " + path);
        this.diskQueryService.diskUsage(path);
    };
    PathInputComponent.prototype.diskQueryFinishedHandler = function (result) {
        this.cwd = result.summary.cwd;
        this.path = result.summary.cwd;
        this.changeDetectorRef.detectChanges();
    };
    PathInputComponent.prototype.listDirQuery = function (path) {
        this.listDirService.listDirContents(path);
    };
    PathInputComponent.prototype.listDirQueryHandler = function (result) {
        var _this = this;
        this.autocompletePaths = [];
        var onlyDirStream = rxjs_1.Observable.from(result)
            .filter(function (entry) {
            return entry.charAt(entry.length - 1) === "/"; // only dirs
        });
        var s = onlyDirStream.subscribe(function (entry) {
            _this.autocompletePaths.push("" + _this.dirname + entry);
        });
        this.changeDetectorRef.detectChanges();
    };
    PathInputComponent.prototype.toParentDir = function () {
        this.sendDiskUsageQuery(this.cwd + "/..");
    };
    return PathInputComponent;
}());
__decorate([
    core_1.ViewChild("pathInputBox"),
    __metadata("design:type", Object)
], PathInputComponent.prototype, "pathInputBox", void 0);
PathInputComponent = __decorate([
    core_1.Component({
        selector: "path-input",
        templateUrl: "path-input.component.html",
        styleUrls: [
            "path-input.style.css"
        ]
    }),
    __metadata("design:paramtypes", [disk_usage_for_path_service_1.DiskUsageService,
        list_contents_for_path_service_1.ListDirService,
        core_1.ChangeDetectorRef])
], PathInputComponent);
exports.PathInputComponent = PathInputComponent;
//# sourceMappingURL=path-input.component.js.map