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
    streamArrowKeys: Subscription;

    ngOnInit(): void {
        this.diskQueryService.diskQueryFinishedEvent.subscribe((result: any) => this.diskQueryFinishedHandler(result));
    }

    ngAfterViewInit(): void {
        // configure Observables for path autocompletion, etc.
        this.streamInputKeyPresses = Observable.fromEvent(
            this.pathInputBox.nativeElement,
            "keydown",
            (event: any) => { return event; });

        this.streamEnter = this.streamInputKeyPresses
            .filter(event => event.key === "Enter")
            .combineLatest(this.streamListDirResults);

        let slowInputStream = this.streamInputKeyPresses.debounceTime(500);
        this.streamTabSlash = Observable.zip(
            // zip the key press with upcoming results of the list dir query it initiates here
            this.streamListDirResults,
            slowInputStream
                .filter(event => [paths.sep, "Tab"].indexOf(event.key) > -1)
                // TODO handle Tab separately
                .do(e => {
                    let path = e.target.value;
                    path = path[path.length - 1] === paths.sep ? path : paths.dirname(path);
                    this.listDirQuery(paths.normalize(path));
                }),
            (result, key) => { return { result: result, key: key } }).subscribe();

        this.streamArrowKeys = this.streamInputKeyPresses
            .filter(event => ["ArrowUp", "ArrowDown"].indexOf(event.key) > -1)
            .combineLatest(this.streamListDirResults)
            .do(eventAndResult => {
                console.log(eventAndResult)
                let key = eventAndResult[0].key;
                let ae: AutocompleteEntries = eventAndResult[1];
                if (ae.isEmpty) {
                    // do nothing
                } else if (key === "ArrowDown") {
                    if (ae.selected === null) { // nothing selected
                        ae.selected = 0;
                    } else if (ae.selected === (ae.entries.length - 1)) { // already at last entry
                        ae.selected = null;
                    } else { // somewhere in the middle
                        ae.selected++;
                    }
                } else {
                    if (ae.selected === null) { // nothing selected
                        ae.selected = ae.entries.length - 1;
                    } else if (ae.selected === 0) { // at first entry
                        ae.selected = null;
                    } else { // somewhere in the middle
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
    }

    constructor(
        private diskQueryService: DiskUsageService,
        private listDirService: ListDirService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.streamListDirResults = listDirService.getResultStream()
            .map((result: any) => { return this.listDirQueryHandler(result) });
        this.autocompleteEntries = new AutocompleteEntries([], "."); // TODO find platform-agnostic default path

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

    listDirQueryHandler(result: any): AutocompleteEntries {
        // TODO change to constructing an InputSelection object
        // save an instance member for template re-rendering
        let ae = new AutocompleteEntries(result.entries, result.dir);
        this.autocompleteEntries = ae;
        this.changeDetectorRef.detectChanges(); // force re-rendering of autocomplete list
        return ae;
        // .filter((entry: string) => {
        //     return entry.indexOf(this.path) === 0;
        // })
        // .subscribe((entry: string) => {
        //     this.autocompletePaths.push(entry);
        // });
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
    isEmpty = true;

    constructor(entries: string[], cwd: string) {
        this.cwd = cwd;
        this.entries = entries
            .filter(e => e.charAt(e.length - 1) === paths.sep)
            .map(e => paths.join(this.cwd, e));
        console.log(this.entries);

        if (entries.length > 0) {
            this.isEmpty = false;
        }
        this.selected = null;
    }
}
