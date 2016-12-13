import { Component, OnInit, AfterViewInit, ChangeDetectorRef, NgZone, ViewChild } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import * as paths from "path";

import { DiskUsageService } from "./disk-usage-for-path.service";
import { ListDirService } from "./list-contents-for-path.service";

const STATUS = require("../../util/errorcodes.js").STATUS;

@Component({
    selector: "path-input",
    templateUrl: "path-input.component.html",
    styleUrls: [
        "path-input.style.css"
    ]
})

export class PathInputComponent implements OnInit, AfterViewInit {
    iconToParentDir = require("./icons/ic_subdirectory_arrow_right_black_24px.svg");
    @ViewChild("pathInputBox") pathInputBox: any;
    path = ""; // user path in input box
    cwd: string; // current working directory for analysis in output view TODO remove, belongs in output view routing
    autocompleteEntries: AutocompleteEntries;
    autocompleteActive = false;

    streamListDirResults: Observable<any>;
    streamInputKeyPresses: Observable<any>;
    streamEnter: Subscription;
    streamSlash: Subscription;
    streamArrowKeys: Subscription;
    streamBackspace: Subscription;
    streamUpdateAutocompleteEntries: Subscription;

    constructor(
        private diskQueryService: DiskUsageService,
        private listDirService: ListDirService,
        private zone: NgZone
    ) {
        this.streamListDirResults = listDirService.getResultStream()
            .map((result: any) => { return this.listDirQueryHandler(result) });
        this.autocompleteEntries = new AutocompleteEntries([], paths.normalize("."));
    }

    ngOnInit(): void {
        this.diskQueryService.diskQueryFinishedEvent.subscribe((result: any) => this.diskQueryFinishedHandler(result));
    }

    ngAfterViewInit(): void {
        // configure Observables for path autocompletion and keybindings
        this.streamInputKeyPresses = Observable.fromEvent(
            this.pathInputBox.nativeElement,
            "keydown",
            (event: any) => { return event; });
        let slowInputStream = this.streamInputKeyPresses.debounceTime(100);

        this.streamUpdateAutocompleteEntries = slowInputStream
            .filter(event => event.key !== "Enter")
            .do(e => {
                this.zone.run(() => {
                    this.autocompleteActive = true;
                    this.autocompleteEntries.setFilteredEntries(this.path);
                })
            })
            .subscribe();

        this.streamEnter = this.streamInputKeyPresses
            .filter(event => event.key === "Enter")
            .do(event => {
                this.zone.run(() => {
                    let ae = this.autocompleteEntries,
                        path: string;
                    event.preventDefault();
                    this.autocompleteActive = false; // hide autocomplete list
                    if (ae.selected === null) { // use path in input box
                        path = this.path;
                    } else { // use selected path in autocomplete list
                        path = ae.filteredEntries[ae.selected];
                    }
                    this.sendDiskUsageQuery(paths.normalize(path));
                })
            }).subscribe();

        this.streamBackspace = this.streamInputKeyPresses
            .filter(e => e.key === "Backspace")
            .filter(event => {
                let path = event.target.value,
                    lastChar = path[path.length - 1]; // char to be removed by Backspace
                return lastChar === paths.sep;
            })
            .do(event => {
                let dirname = paths.dirname(event.target.value);
                this.listDirQuery(paths.normalize(dirname));
            })
            .subscribe();

        this.streamSlash = Observable.zip(
            // zip the key press with upcoming results of the list dir query it initiates here
            this.streamListDirResults,
            this.streamInputKeyPresses
                .filter(event => event.key === paths.sep)
                .do(e => {
                    // add separator char for testing the path becuase it is not appended yet
                    let path = `${e.target.value}${paths.sep}`;
                    path = this.getDirName(path);
                    this.listDirQuery(paths.normalize(path));
                }),
            (result, key) => { return { result: result, key: key } }).subscribe();

        this.streamArrowKeys = this.streamInputKeyPresses
            .filter(event => ["ArrowUp", "ArrowDown", "Tab"].indexOf(event.key) > -1)
            .do(event => {
                let key = event.key;
                let ae = this.autocompleteEntries;
                if (ae.isEmpty) {
                    // do nothing
                } else if (key === "ArrowDown") {
                    if (ae.selected === null) { // nothing selected
                        ae.selected = 0;
                    } else if (ae.selected === (ae.filteredEntries.length - 1)) { // already at last entry
                        ae.selected = null;
                    } else { // somewhere in the middle
                        ae.selected++;
                    }
                } else if (key === "ArrowUp") {
                    if (ae.selected === null) { // nothing selected
                        ae.selected = ae.filteredEntries.length - 1;
                    } else if (ae.selected === 0) { // at first entry
                        ae.selected = null;
                    } else { // somewhere in the middle
                        ae.selected--;
                    }
                } else if (event.shiftKey && key === "Tab") {
                    event.preventDefault();
                    if (event.target.value) { // input box contains non-empty string
                        let newPath = paths.dirname(event.target.value);
                        this.path = `${newPath}${paths.sep}`; // re-add separator since paths.dirname removes it
                        this.listDirQuery(newPath);
                    }
                } else if (key === "Tab") {
                    event.preventDefault();
                    if (ae.filteredEntries.length === 1) { // only 1 choice
                        this.path = ae.filteredEntries[0];
                        this.listDirQuery(this.path);
                    } else if (ae.selected === null || ae.isEmpty) { // no choices
                        // do nothing
                    } else if (ae.selected !== null) { // > 1 choice and user has one selected
                        this.path = ae.filteredEntries[ae.selected];
                        this.listDirQuery(this.path);
                    }
                }
            }).subscribe();
    }

    sendDiskUsageQuery(path: string): void {
        // TODO replace console.log with dev logging
        this.diskQueryService.diskUsage(path);
    }

    diskQueryFinishedHandler(result: any): void {
        this.zone.run(() => {
            this.cwd = result.summary.cwd;
            this.path = result.summary.cwd;
        });
    }

    listDirQuery(path: string): void {
        this.listDirService.listDirContents(paths.normalize(path));
    }

    listDirQueryHandler(result: any): void {
        // save an instance member for template re-rendering
        this.zone.run(() => {
            let ae = new AutocompleteEntries(result.entries, result.dir);
            this.autocompleteEntries = ae;
        });
    }

    getDirName(path: string): string {
        // return the longest directory path found in the input string
        // /Users/Applications/ => /Users/Applications/
        // whereas paths.dirname("/Users/Applications/") => /Users/
        return path[path.length - 1] === paths.sep ? path : paths.dirname(path);
    }

    liClickHandler(event: any): void {
        this.zone.run(() => {
            event.preventDefault();
            this.autocompleteActive = false;
            let path = event.target.text; // entry user clicked on
            this.sendDiskUsageQuery(paths.normalize(path));
        });
    }
}

class AutocompleteEntries {
    entries: string[];
    selected: number; // index in `filteredEntries` or null (nothing selected)
    cwd: string; // parent directory for items in `entries`
    isEmpty = true;
    filterPath: string; // path used to produce filteredEntries from entries
    filteredEntries: string[] = [];

    constructor(entries: string[], cwd: string) {
        this.cwd = cwd;
        this.entries = entries
            .filter(e => e.charAt(e.length - 1) === paths.sep) // only select directories
            .map(e => paths.join(this.cwd, e));

        if (entries.length > 0) {
            this.isEmpty = false;
        }
        this.selected = null;
    }

    setFilteredEntries(path: string): string[] {
        // select all entries that contain the exact path input by user
        this.filterPath = path;
        this.filteredEntries = this.entries.filter(entry => entry.indexOf(path) === 0);
        return this.filteredEntries;
    }
}
