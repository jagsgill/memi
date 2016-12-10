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
        // TODO path completion
        // TODO use observables & eventemitters to simplify ui actions
        this.iconToParentDir = require("./icons/ic_subdirectory_arrow_right_black_24px.svg");
        this.path = ""; // user path in input box
        this.dirname = ""; // directory path for autocomplete entries
        this.autocompleteActive = false;
        this.streamListDirResults = listDirService.getResultStream()
            .distinctUntilChanged()
            .do(function (result) { return _this.listDirQueryHandler(result); });
    }
    PathInputComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.diskQueryService.diskQueryFinishedEvent.subscribe(function (result) { return _this.diskQueryFinishedHandler(result); });
    };
    PathInputComponent.prototype.ngAfterViewInit = function () {
        // configure Observables for path autocompletion, etc.
        this.streamInputKeyPresses = rxjs_1.Observable.fromEvent(this.pathInputBox.nativeElement, "keydown", function (event) { return event; })
            .debounceTime(500);
        this.streamEnter = this.streamInputKeyPresses
            .filter(function (event) { return event.key === "Enter"; })
            .combineLatest(this.streamListDirResults);
        // this.inputBoxStreamSource = Observable.fromEvent(
        //     this.pathInputBox.nativeElement,
        //     "keydown",
        //     (x: any) => { return x.target.value; })
        //     .debounceTime(500)
        //     .distinctUntilChanged()
        //     .map((x: any) => {
        //         let regexDir = /.*\/$/; // directories end in '/'
        //         if (regexDir.test(x)) {
        //             this.dirname = x;
        //             return x; // identity mapping if its a dir
        //         } else {
        //             // TODO use paths.join instead of literal '/'
        //             this.dirname = `${paths.dirname(x)}/`;
        //             return `${paths.dirname(x)}/`; // map to parent dir otherwise
        //         }
        //     });
        // this.inputBoxStream = this.inputBoxStreamSource
        //     .subscribe((x: any) => { this.listDirQuery(x); });
    };
    PathInputComponent.prototype.sendDiskUsageQuery = function (path) {
        // TODO replace console.log with dev logging
        console.log("Analyzing path: " + path);
        console.log(this.path);
        this.diskQueryService.diskUsage(path);
    };
    PathInputComponent.prototype.diskQueryFinishedHandler = function (result) {
        this.cwd = result.summary.cwd;
        this.path = result.summary.cwd;
        this.changeDetectorRef.detectChanges();
    };
    PathInputComponent.prototype.listDirQuery = function (path) {
        this.listDirService.listDirContents(paths.normalize(path));
    };
    PathInputComponent.prototype.listDirQueryHandler = function (result) {
        // TODO change to constructing an InputSelection object
        this.autocompleteEntries = new AutocompleteEntries(result.entries, result.dir);
        // .filter((entry: string) => {
        //     return entry.indexOf(this.path) === 0;
        // })
        // .subscribe((entry: string) => {
        //     this.autocompletePaths.push(entry);
        // });
        console.log(this.autocompleteEntries);
        //this.changeDetectorRef.detectChanges();
    };
    return PathInputComponent;
}());
__decorate([
    core_1.ViewChild("pathSubmitter"),
    __metadata("design:type", Object)
], PathInputComponent.prototype, "pathSubmitter", void 0);
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
var AutocompleteEntries = (function () {
    function AutocompleteEntries(entries, cwd) {
        var _this = this;
        this.entries = entries
            .filter(function (e) { return e.charAt(e.length - 1) === "/"; })
            .map(function (e) { return paths.join(_this.cwd, e); });
        if (entries.length > 0) {
            this.isEmpty = false;
        }
        this.selected = -1;
        this.cwd = cwd;
    }
    return AutocompleteEntries;
}());
//# sourceMappingURL=path-input.component.js.map