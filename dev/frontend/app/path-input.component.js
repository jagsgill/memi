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
    function PathInputComponent(diskQueryService, listDirService, zone) {
        var _this = this;
        this.diskQueryService = diskQueryService;
        this.listDirService = listDirService;
        this.zone = zone;
        this.iconToParentDir = require("./icons/ic_subdirectory_arrow_right_black_24px.svg");
        this.path = ""; // user path in input box
        this.autocompleteActive = false;
        this.streamListDirResults = listDirService.getResultStream()
            .map(function (result) { return _this.listDirQueryHandler(result); });
        this.autocompleteEntries = new AutocompleteEntries([], paths.normalize("."));
    }
    PathInputComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.diskQueryService.diskQueryFinishedEvent.subscribe(function (result) { return _this.diskQueryFinishedHandler(result); });
    };
    PathInputComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // configure Observables for path autocompletion and keybindings
        var inputBox = this.pathInputBox.nativeElement;
        this.streamFocusInput = rxjs_1.Observable.fromEvent(inputBox, "focus")
            .do(function (e) { return _this.zone.run(function () { return _this.autocompleteActive = true; }); })
            .subscribe();
        this.streamFocusInput = rxjs_1.Observable.fromEvent(inputBox, "focusout")
            .do(function (e) { return _this.zone.run(function () { return _this.autocompleteActive = false; }); })
            .subscribe();
        this.streamInputKeyPresses = rxjs_1.Observable.fromEvent(inputBox, "keydown", function (event) { return event; });
        var slowInputStream = this.streamInputKeyPresses.debounceTime(100);
        this.streamUpdateAutocompleteEntries = slowInputStream
            .filter(function (event) { return event.key !== "Enter"; })
            .do(function (e) {
            _this.zone.run(function () {
                _this.autocompleteActive = true;
                _this.autocompleteEntries.setFilteredEntries(_this.path);
            });
        })
            .subscribe();
        this.streamEnter = this.streamInputKeyPresses
            .filter(function (event) { return event.key === "Enter"; })
            .do(function (event) {
            _this.zone.run(function () {
                var ae = _this.autocompleteEntries, path;
                event.preventDefault();
                _this.autocompleteActive = false; // hide autocomplete list
                if (ae.selected === null) {
                    path = _this.path;
                }
                else {
                    path = ae.filteredEntries[ae.selected];
                }
                _this.sendDiskUsageQuery(paths.normalize(path));
            });
        }).subscribe();
        this.streamBackspace = this.streamInputKeyPresses
            .filter(function (e) { return e.key === "Backspace"; })
            .filter(function (event) {
            var path = event.target.value, lastChar = path[path.length - 1]; // char to be removed by Backspace
            return lastChar === paths.sep;
        })
            .do(function (event) {
            var dirname = paths.dirname(event.target.value);
            _this.listDirQuery(paths.normalize(dirname));
        })
            .subscribe();
        this.streamSlash = rxjs_1.Observable.zip(
        // zip the key press with upcoming results of the list dir query it initiates here
        this.streamListDirResults, this.streamInputKeyPresses
            .filter(function (event) { return event.key === paths.sep; })
            .do(function (e) {
            // add separator char for testing the path becuase it is not appended yet
            var path = "" + e.target.value + paths.sep;
            path = _this.getDirName(path);
            _this.listDirQuery(paths.normalize(path));
        })).subscribe();
        this.streamArrowKeys = this.streamInputKeyPresses
            .filter(function (event) { return ["ArrowUp", "ArrowDown", "Tab"].indexOf(event.key) > -1; })
            .do(function (event) {
            var key = event.key;
            var ae = _this.autocompleteEntries;
            if (ae.isEmpty) {
            }
            else if (key === "ArrowDown") {
                if (ae.selected === null) {
                    ae.selected = 0;
                }
                else if (ae.selected === (ae.filteredEntries.length - 1)) {
                    ae.selected = null;
                }
                else {
                    ae.selected++;
                }
            }
            else if (key === "ArrowUp") {
                if (ae.selected === null) {
                    ae.selected = ae.filteredEntries.length - 1;
                }
                else if (ae.selected === 0) {
                    ae.selected = null;
                }
                else {
                    ae.selected--;
                }
            }
            else if (event.shiftKey && key === "Tab") {
                event.preventDefault();
                if (event.target.value) {
                    var newPath = paths.dirname(event.target.value);
                    _this.path = "" + newPath + paths.sep; // re-add separator since paths.dirname removes it
                    _this.listDirQuery(newPath);
                }
            }
            else if (key === "Tab") {
                event.preventDefault();
                if (ae.filteredEntries.length === 1) {
                    _this.path = ae.filteredEntries[0];
                    _this.listDirQuery(_this.path);
                }
                else if (ae.selected === null || ae.isEmpty) {
                }
                else if (ae.selected !== null) {
                    _this.path = ae.filteredEntries[ae.selected];
                    _this.listDirQuery(_this.path);
                }
            }
        }).subscribe();
    };
    PathInputComponent.prototype.sendDiskUsageQuery = function (path) {
        // TODO replace console.log with dev logging
        this.diskQueryService.diskUsage(path);
    };
    PathInputComponent.prototype.diskQueryFinishedHandler = function (result) {
        var _this = this;
        this.zone.run(function () {
            _this.cwd = result.summary.cwd;
            _this.path = result.summary.cwd;
        });
    };
    PathInputComponent.prototype.listDirQuery = function (path) {
        this.listDirService.listDirContents(paths.normalize(path));
    };
    PathInputComponent.prototype.listDirQueryHandler = function (result) {
        var _this = this;
        // save an instance member for template re-rendering
        this.zone.run(function () {
            var ae = new AutocompleteEntries(result.entries, result.dir);
            _this.autocompleteEntries = ae;
        });
    };
    PathInputComponent.prototype.getDirName = function (path) {
        // return the longest directory path found in the input string
        // /Users/Applications/ => /Users/Applications/
        // whereas paths.dirname("/Users/Applications/") => /Users/
        return path[path.length - 1] === paths.sep ? path : paths.dirname(path);
    };
    PathInputComponent.prototype.liClickHandler = function (event) {
        var _this = this;
        this.zone.run(function () {
            event.preventDefault();
            _this.autocompleteActive = false;
            var path = event.target.text; // entry user clicked on
            _this.sendDiskUsageQuery(paths.normalize(path));
        });
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
        core_1.NgZone])
], PathInputComponent);
exports.PathInputComponent = PathInputComponent;
var AutocompleteEntries = (function () {
    function AutocompleteEntries(entries, cwd) {
        var _this = this;
        this.isEmpty = true;
        this.filteredEntries = [];
        this.cwd = cwd;
        this.entries = entries
            .filter(function (e) { return e.charAt(e.length - 1) === paths.sep; }) // only select directories
            .map(function (e) { return paths.join(_this.cwd, e); });
        if (entries.length > 0) {
            this.isEmpty = false;
        }
        this.selected = null;
    }
    AutocompleteEntries.prototype.setFilteredEntries = function (path) {
        // select all entries that contain the exact path input by user
        this.filterPath = path;
        this.filteredEntries = this.entries.filter(function (entry) { return entry.indexOf(path) === 0; });
        return this.filteredEntries;
    };
    return AutocompleteEntries;
}());
//# sourceMappingURL=path-input.component.js.map