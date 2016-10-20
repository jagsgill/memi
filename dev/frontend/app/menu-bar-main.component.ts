import { Component } from "@angular/core"

@Component({
  moduleId: module.id,
  selector: "menu-bar-main",
  templateUrl: "menu-bar-main.html",
  styleUrls: [
    'menu-bar-main.style.css'  
  ]
})

export class MenuBarMainComponent {
  navlist = {
    "Home" : ""
  }
}
