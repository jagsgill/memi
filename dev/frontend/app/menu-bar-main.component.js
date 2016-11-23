"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var MenuBarMainComponent = (function () {
    function MenuBarMainComponent() {
        this.links = [
            { path: "/", display: "Home" },
            { path: "/list", display: "List" },
            { path: "/detective", display: "Detective" }
        ];
    }
    MenuBarMainComponent.prototype.ngAfterViewInit = function () {
        // apply ".active" class to Home tab
        this.navbar.nativeElement.children[0].classList.add("active");
    };
    MenuBarMainComponent.prototype.setActiveLink = function (index) {
        var children = this.navbar.nativeElement.children;
        for (var i = 0; i < children.length; i++) {
            var item = children[i];
            item.classList.remove("active");
        }
        this.navbar.nativeElement.children[index].classList.add("active");
    };
    return MenuBarMainComponent;
}());
__decorate([
    core_1.ViewChild("nav"),
    __metadata("design:type", Object)
], MenuBarMainComponent.prototype, "navbar", void 0);
MenuBarMainComponent = __decorate([
    core_1.Component({
        selector: "menu-bar-main",
        templateUrl: "menu-bar-main.component.html",
        styleUrls: [
            "menu-bar-main.style.css"
        ]
    }),
    __metadata("design:paramtypes", [])
], MenuBarMainComponent);
exports.MenuBarMainComponent = MenuBarMainComponent;
//# sourceMappingURL=menu-bar-main.component.js.map