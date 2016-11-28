import { Pipe, PipeTransform } from "@angular/core";
import * as paths from "path";

@Pipe({ name: "joinpaths" })
export class JoinPathsPipe implements PipeTransform {
  transform(entry: string, prefix: string): string {
    return paths.join(prefix, entry); // create path using platform-specific separator
  }
}
