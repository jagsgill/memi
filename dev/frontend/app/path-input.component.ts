import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

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
  ) {}

  path = "";
  cwd: string;
  ls: any;

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
      console.log("clicked ls button")
      this.listDirService.listDirContents(path);
  }

  listDirQueryFinishedHandler(result: any): void {
      console.log("path input received ls:")
      console.log(result.toString())
  }

  toParentDir(): void {
    this.sendDiskUsageQuery(`${this.cwd}/..`);
  }
}
