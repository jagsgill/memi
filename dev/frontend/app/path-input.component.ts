import { Component, Output, EventEmitter } from '@angular/core'

import { DiskQueryService } from './disk-query.service'

@Component({
  selector: 'path-input',
  templateUrl: 'path-input.component.html',
  styleUrls: [
    'path-input.style.css'
  ]
})

export class PathInputComponent {

  constructor(
    private diskQueryService: DiskQueryService
  ) {}

  path = ""
  @Output() diskQueryFinished = new EventEmitter()


  analyze(): void {
    console.log(`Analyzing path: ${this.path}`)
    let result = this.diskQueryService.diskUsage(this.path)
    console.log(`Query finished with result: ${result.toString()}`)
    this.diskQueryFinished.emit(result)
  }


}
