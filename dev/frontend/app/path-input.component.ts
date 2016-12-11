import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild } from "@angular/core";
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
    // TODO path completion
    // TODO use observables & eventemitters to simplify ui actions
    iconToParentDir = require("./icons/ic_subdirectory_arrow_right_black_24px.svg");
    @ViewChild("pathSubmitter") pathSubmitter: any;
    @ViewChild("pathInputBox") pathInputBox: any;
    path = ""; // user path in input box
    dirname = ""; // directory path for autocomplete entries
    cwd: string; // current working directory for analysis in output view TODO remove, belongs in output view routing
    autocompleteEntries: AutocompleteEntries;
    autocompleteActive = false;

    streamListDirResults: Observable<any>;
    streamInputKeyPresses: Observable<any>;
    streamEnter: Observable<any>;
    streamEnterResultHandler: Observable<any>; // handles async results
    streamTabSlash: Subscription;
    streamTabSlashResultHandler: Observable<any>; // handles async results
    streamArrowKeys: Observable<any>;

    ngOnInit(): void {
        this.diskQueryService.diskQueryFinishedEvent.subscribe((result: any) => this.diskQueryFinishedHandler(result));
    }

    ngAfterViewInit(): void {
        // configure Observables for path autocompletion, etc.
        this.streamInputKeyPresses = Observable.fromEvent(
            this.pathInputBox.nativeElement,
            "keydown",
            (event: any) => { return event; })
            .debounceTime(500);

        this.streamEnter = this.streamInputKeyPresses
            .filter(event => event.key === "Enter")
            .combineLatest(this.streamListDirResults);

        this.streamTabSlash = Observable.zip(
            // zip key press with upcoming results of the list dir query it initiates here
            this.streamListDirResults,
            this.streamInputKeyPresses
                .filter(event => ["/", "Tab"].indexOf(event.key) > -1)
                // TODO handle Tab separately
                .do(e => {
                    console.log(e);
                    console.log(e.target.value);
                    console.log(paths.dirname(e.target.value));
                    // TODO fix, paths.dirname truncates last subdir in e.g. /Users/Applications/  
                    let dirname = paths.dirname(e.target.value);
                    this.listDirQuery(paths.normalize(dirname));
                }),
            (result, key) => { return { result: result, key: key } }).subscribe();

        this.streamArrowKeys = this.streamInputKeyPresses
            .filter(event => ["ArrowUp", "ArrowDown"].indexOf(event.key) > -1)
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
    }

    constructor(
        private diskQueryService: DiskUsageService,
        private listDirService: ListDirService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.streamListDirResults = listDirService.getResultStream()
            .do((result: any) => this.listDirQueryHandler(result));
        this.autocompleteEntries = new AutocompleteEntries([], ".");

    }

    sendDiskUsageQuery(path: string): void {
        // TODO replace console.log with dev logging
        console.log(`Analyzing path: ${path}`);
        console.log(this.path);
        this.diskQueryService.diskUsage(path);
    }

    diskQueryFinishedHandler(result: any): void {
        this.cwd = result.summary.cwd;
        this.path = result.summary.cwd;
        this.changeDetectorRef.detectChanges();
    }

    listDirQuery(path: string): void {
        this.listDirService.listDirContents(paths.normalize(path));
    }

    listDirQueryHandler(result: any): void {
        // TODO change to constructing an InputSelection object
        this.autocompleteEntries = new AutocompleteEntries(result.entries, result.dir);
        // .filter((entry: string) => {
        //     return entry.indexOf(this.path) === 0;
        // })
        // .subscribe((entry: string) => {
        //     this.autocompletePaths.push(entry);
        // });
        console.log(this.autocompleteEntries)
        this.changeDetectorRef.detectChanges();
    }

    //   navigateInputs(event: any) {
    // TODO remove
    //       if (!this.autocompletePaths) {
    //           return;
    //       } else if (event.key === "Enter") {
    //           this.pathInputBox.nativeElement.blur();
    //       } else if (this.selectedAutocompleteEntry === undefined) {
    //           if (event.key === "ArrowDown") {
    //               event.preventDefault();
    //               this.selectedAutocompleteEntry = 0;
    //           } else if (event.key === "ArrowUp") {
    //               event.preventDefault();
    //               this.selectedAutocompleteEntry = this.autocompletePaths.length - 1;
    //           } else if (event.key === "Tab") {
    //               event.preventDefault();
    //               if (this.autocompletePaths.length === 1){
    //                 this.selectAutocompleteEntry(0);
    //               }
    //           }
    //       } else {
    //           if (event.key === "ArrowDown") {
    //               event.preventDefault();
    //               this.selectedAutocompleteEntry = (++this.selectedAutocompleteEntry
    //                   % this.autocompletePaths.length);
    //           } else if (event.key === "ArrowUp") {
    //               event.preventDefault();
    //               this.selectedAutocompleteEntry = (--this.selectedAutocompleteEntry
    //                   % this.autocompletePaths.length);
    //           } else if (event.key === "Tab") {
    //               event.preventDefault();
    //               this.selectAutocompleteEntry(this.selectedAutocompleteEntry);
    //           }
    //       console.log("selected: ", this.selectedAutocompleteEntry)
    //   }
    // }
    //
    // selectAutocompleteEntry(i: number): void {
    //     TODO remove
    //     this.path = this.autocompletePaths[i];
    //     console.log("set path to: ", this.path)
    // }

    // toParentDir(): void {
    //     // TODO this belongs in routing for analysis/output view
    //     this.sendDiskUsageQuery(`${this.cwd}/..`);
    // }

}

class AutocompleteEntries {
    entries: string[];
    selected: number; // index in `entries` or null (nothing selected)
    cwd: string; // parent directory for items in `entries`
    isEmpty: boolean;

    constructor(entries: string[], cwd: string) {
        this.cwd = cwd;
        this.entries = entries
            .filter(e => e.charAt(e.length - 1) === "/")
            .map(e => paths.join(this.cwd, e));

        if (entries.length > 0) {
            this.isEmpty = false;
        }
        this.selected = null;
    }
}
