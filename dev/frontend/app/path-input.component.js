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
            .map(function (result) { return _this.listDirQueryHandler(result); });
        this.autocompleteEntries = new AutocompleteEntries([], "."); // TODO find platform-agnostic default path
    }
    PathInputComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.diskQueryService.diskQueryFinishedEvent.subscribe(function (result) { return _this.diskQueryFinishedHandler(result); });
    };
    PathInputComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // configure Observables for path autocompletion, etc.
        this.streamInputKeyPresses = rxjs_1.Observable.fromEvent(this.pathInputBox.nativeElement, "keydown", function (event) { return event; });
        this.streamEnter = this.streamInputKeyPresses
            .filter(function (event) { return event.key === "Enter"; })
            .do(function (event) {
            var ae = _this.autocompleteEntries, path;
            event.preventDefault();
            event.target.blur(); // hide autocomplete list
            console.log(ae);
            if (ae.selected === null) {
                path = _this.path;
            }
            else {
                path = ae.entries[ae.selected];
            }
            _this.sendDiskUsageQuery(paths.normalize(path));
        }).subscribe();
        var slowInputStream = this.streamInputKeyPresses.debounceTime(500);
        this.streamTabSlash = rxjs_1.Observable.zip(
        // zip the key press with upcoming results of the list dir query it initiates here
        this.streamListDirResults, slowInputStream
            .filter(function (event) { return [paths.sep, "Tab"].indexOf(event.key) > -1; })
            .do(function (e) {
            var path = e.target.value;
            path = path[path.length - 1] === paths.sep ? path : paths.dirname(path);
            _this.listDirQuery(paths.normalize(path));
        }), function (result, key) { return { result: result, key: key }; }).subscribe();
        this.streamArrowKeys = this.streamInputKeyPresses
            .filter(function (event) { return ["ArrowUp", "ArrowDown"].indexOf(event.key) > -1; })
            .do(function (event) {
            var key = event.key;
            var ae = _this.autocompleteEntries;
            if (ae.isEmpty) {
            }
            else if (key === "ArrowDown") {
                if (ae.selected === null) {
                    ae.selected = 0;
                }
                else if (ae.selected === (ae.entries.length - 1)) {
                    ae.selected = null;
                }
                else {
                    ae.selected++;
                }
            }
            else {
                if (ae.selected === null) {
                    ae.selected = ae.entries.length - 1;
                }
                else if (ae.selected === 0) {
                    ae.selected = null;
                }
                else {
                    ae.selected--;
                }
            }
        }).subscribe();
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
        // save an instance member for template re-rendering
        var ae = new AutocompleteEntries(result.entries, result.dir);
        this.autocompleteEntries = ae;
        this.changeDetectorRef.detectChanges(); // force re-rendering of autocomplete list
        return ae;
        // .filter((entry: string) => {
        //     return entry.indexOf(this.path) === 0;
        // })
        // .subscribe((entry: string) => {
        //     this.autocompletePaths.push(entry);
        // });
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
        this.isEmpty = true;
        this.cwd = cwd;
        this.entries = entries
            .filter(function (e) { return e.charAt(e.length - 1) === paths.sep; })
            .map(function (e) { return paths.join(_this.cwd, e); });
        if (entries.length > 0) {
            this.isEmpty = false;
        }
        this.selected = null;
    }
    return AutocompleteEntries;
}());
//# sourceMappingURL=path-input.component.js.map