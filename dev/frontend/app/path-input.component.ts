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
    // TODO path completio
    iconToParentDir = require("./icons/ic_subdirectory_arrow_right_black_24px.svg");
    @ViewChild("pathInputBox") pathInputBox: any;
    path = ""; // user path in input box
    dirname = ""; // directory path for autocomplete entries
    cwd: string; // current working directory for analysis in output view
    autocompletePaths: string[] = [];
    autocompleteActive = false;
    listDirResultStream: Subscription;
    inputBoxStreamSource: Observable<any>;
    inputBoxStream: Subscription;

    ngOnInit(): void {
        this.diskQueryService.diskQueryFinishedEvent.subscribe((result: any) => this.diskQueryFinishedHandler(result));
    }

    ngAfterViewInit(): void {
        this.inputBoxStreamSource = Observable.fromEvent(
            this.pathInputBox.nativeElement,
            "input",
            (x: any) => { return x.target.value; }
        );
        this.inputBoxStream = this.inputBoxStreamSource
        .map( (x: any) => {
          let regexDir = /.*\/$/; // directories end in '/'
          if (regexDir.test(x)) {
            this.dirname = x;
            return x; // identity mapping if its a dir
          } else {
            this.dirname = `${paths.dirname(x)}/`;
            return `${paths.dirname(x)}/`; // map to parent dir otherwise
          }
        })
        .subscribe( (x: any) => { this.listDirQuery(x); } );
    }

    constructor(
        private diskQueryService: DiskUsageService,
        private listDirService: ListDirService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.listDirResultStream = listDirService.getResultStream()
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
        this.listDirService.listDirContents(path);
    }

    listDirQueryHandler(result: string[]): void {
        this.autocompletePaths = [];
        let onlyDirStream = Observable.from(result)
            .filter((entry: string) => {
                return entry.charAt(entry.length - 1) === "/"; // only dirs
            });
        let s = onlyDirStream.subscribe((entry: string) => {
            this.autocompletePaths.push(`${this.dirname}${entry}`);
        });
        this.changeDetectorRef.detectChanges();
    }

    toParentDir(): void {
        this.sendDiskUsageQuery(`${this.cwd}/..`);
    }

}
