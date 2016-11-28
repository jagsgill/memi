import { Injectable, EventEmitter, Output } from "@angular/core";
import { ipcRenderer as ipc } from "electron";
import * as paths from "path";

const STATUS = require("../../util/errorcodes.js").STATUS;

@Injectable()
export class ListDirService {

  @Output() listDirFinishedEvent = new EventEmitter();
  channel = "requestListDirContents";

  constructor() {
    ipc.on(this.channel, this.listDirContentsHandler.bind(this));
  }

  listDirContents(path: string): void {
    console.log(`sending path for list dir contents: ${path}`);
    ipc.send(this.channel, paths.normalize(path));
  }

  listDirContentsHandler(event: any, output: any, dir: any): void {
      console.log("ls event:");
      console.log(event);
      console.log("received result");
      console.log(output);
  }
}
