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
    cwd: string; // current working directory for analysis in output view
    autocompletePaths: string[] = [];
    autocompleteActive = false;
    selectedAutocompleteEntry: number = undefined;

    listDirResultStream: Subscription;
    inputBoxStreamSource: Observable<any>;
    inputBoxStream: Subscription;

    ngOnInit(): void {
        this.diskQueryService.diskQueryFinishedEvent.subscribe((result: any) => this.diskQueryFinishedHandler(result));
    }

    ngAfterViewInit(): void {
        this.inputBoxStreamSource = Observable.fromEvent(
            this.pathInputBox.nativeElement,
            "keydown",
            (x: any) => { return x.target.value; })
            .distinctUntilChanged()
            .map((x: any) => {
                let regexDir = /.*\/$/; // directories end in '/'
                if (regexDir.test(x)) {
                    this.dirname = x;
                    return x; // identity mapping if its a dir
                } else {
                    // TODO use paths.join instead of literal '/'
                    this.dirname = `${paths.dirname(x)}/`;
                    return `${paths.dirname(x)}/`; // map to parent dir otherwise
                }
            });
        this.inputBoxStream = this.inputBoxStreamSource
            .subscribe((x: any) => { this.listDirQuery(x); });
    }

    constructor(
        private diskQueryService: DiskUsageService,
        private listDirService: ListDirService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.listDirResultStream = listDirService.getResultStream()
        .distinctUntilChanged()
        .subscribe((result: string[]) => this.listDirQueryHandler(result));
    }

    sendDiskUsageQuery(path: string): void {
        // TODO replace console.log with dev logging
        console.log(`Analyzing path: ${path}`);
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

    listDirQueryHandler(result: string[]): void {
        this.autocompletePaths = [];
        let listDirStream = Observable.from(result);
        let s = listDirStream
            .filter((entry: string) => {
                return entry.charAt(entry.length - 1) === "/"; // only dirs
            })
            .map((entry: string) => {
                return paths.join(this.dirname, entry);
            })
            .filter((entry: string) => {
                return entry.indexOf(this.path) === 0;
            })
            .subscribe((entry: string) => {
                this.autocompletePaths.push(entry);
            });
        console.log(this.autocompletePaths)
        this.changeDetectorRef.detectChanges();
    }

    navigateInputs(event: any) {
        if (!this.autocompletePaths) {
            return;
        } else if (this.selectedAutocompleteEntry === undefined) {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                this.selectedAutocompleteEntry = 0;
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                this.selectedAutocompleteEntry = this.autocompletePaths.length - 1;
            } else if (event.key === "Enter") {
                this.sendDiskUsageQuery(this.path);
                this.pathInputBox.nativeElement.blur();
            }
        } else {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                this.selectedAutocompleteEntry = (++this.selectedAutocompleteEntry
                    % this.autocompletePaths.length);
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                this.selectedAutocompleteEntry = (--this.selectedAutocompleteEntry
                    % this.autocompletePaths.length);
            } else if (event.key === "Tab") {
                event.preventDefault();
                this.selectAutocompleteEntry(this.selectedAutocompleteEntry);
            } else if (event.key === "Enter") {
                event.preventDefault();
                this.selectAutocompleteEntry(this.selectedAutocompleteEntry);
                this.sendDiskUsageQuery(this.path);
                this.pathInputBox.nativeElement.blur();
            }
        }
        console.log("selected: ", this.selectedAutocompleteEntry)
    }

    selectAutocompleteEntry(i: number): void {
        this.path = this.autocompletePaths[i];
        console.log("set path to: ", this.path)
    }

    toParentDir(): void {
        this.sendDiskUsageQuery(`${this.cwd}/..`);
    }

}
