import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
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

export class PathInputComponent implements OnInit {
  // TODO path completion

iconToParentDir = require("./icons/ic_subdirectory_arrow_right_black_24px.svg");

  ngOnInit(): void {
    this.diskQueryService.diskQueryFinishedEvent.subscribe((result: any) => this.diskQueryFinishedHandler(result));
  }

  constructor(
    private diskQueryService: DiskUsageService,
    private listDirService: ListDirService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
      this.listDirResultStream = listDirService.getResultStream()
      .subscribe( (result: string[]) => this.listDirQueryHandler(result));
  }

  path = "";
  cwd: string;
  autocompletePaths: string[] = [];
  hidePathSuggestions = true;
  listDirResultStream: Subscription;

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
      .filter( (entry: string) => {
        return entry.charAt(entry.length - 1) === "/";
      });
      let s = onlyDirStream.subscribe( (entry: string) => {
        this.autocompletePaths.push(entry);
      });
      console.log(this.autocompletePaths);
  }

  toParentDir(): void {
    this.sendDiskUsageQuery(`${this.cwd}/..`);
  }

}
