import { Injectable, Output, EventEmitter } from "@angular/core";
import { ipcRenderer as ipc } from "electron";
import * as paths from "path";


@Injectable()
export class DiskQueryService {

  @Output() diskQueryFinishedEvent = new EventEmitter();

  constructor() {
    // http://onehungrymind.com/electron-angular-2-things/
    ipc.on("clientRequestDiskUsageForPath", this.sendParsedDiskUsageForPath.bind(this));
  }

  diskUsage(path: string): any {
    console.log(`sending path: ${path}`);
    ipc.send("clientRequestDiskUsageForPath", paths.normalize(path));
  }

  private sendParsedDiskUsageForPath(event: any, output: any, dir: any) {
    let rawdata = output.split("\n");
    let entries_to_process = rawdata.slice(0, -3); // trim the total line and 2x

    let entries = entries_to_process.map((e: string) => {
      let obj = {},
      data = e.split(/:/);
      obj["fname"] = data[1].toString();
      obj["fsize"] = data[0].toString();
      obj["type"] = data[2].toString();
      return obj;
    });

    let summary = (() => {
      let data = rawdata[rawdata.length - 2].split(/:/),
      obj = {};
      console.log("summary data: " , data);
      obj["totalsize"] = data[0];
      obj["cwd"] = data[1];
      return obj;
    })();
    console.log(entries);
    console.log(summary);
    console.log("before emit");
    this.diskQueryFinishedEvent.emit( {"entries": entries, "summary": summary} );
  }
}
