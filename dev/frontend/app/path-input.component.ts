import { Component } from '@angular/core'

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

  analyze(): void {
    // TODO replace console.log with dev logging
    console.log(`Analyzing path: ${this.path}`)
    this.diskQueryService.diskUsage(this.path)
  }


}
