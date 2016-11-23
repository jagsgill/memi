import { Component, ViewChild, AfterViewInit } from "@angular/core";

@Component({
  selector: "menu-bar-main",
  templateUrl: "menu-bar-main.component.html",
  styleUrls: [
    "menu-bar-main.style.css"
  ]
})

export class MenuBarMainComponent implements AfterViewInit {
  @ViewChild("nav") navbar: any;

  links = [
    { path: "/", display: "Home" },
    { path: "/list", display: "List" },
    { path: "/detective", display: "Detective" }
  ];

  ngAfterViewInit(): void {
    // apply ".active" class to Home tab
    this.navbar.nativeElement.children[0].classList.add("active");
  }

  setActiveLink(index: number) {
    let children: HTMLCollection = this.navbar.nativeElement.children;
    for (let i = 0; i < children.length; i++) {
      let item: Element = children[i];
      item.classList.remove("active");
    }
    this.navbar.nativeElement.children[index].classList.add("active");
  }
}
