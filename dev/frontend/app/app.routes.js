"use strict";
var router_1 = require("@angular/router");
var home_content_component_1 = require("./home-content.component");
var output_text_component_1 = require("./output-text.component");
var output_detective_component_1 = require("./output-detective.component");
// TODO fix refreshing. e.g. when showing list or detective views, does not work
exports.routes = [
    { path: "", component: home_content_component_1.HomeContentComponent },
    { path: "list", component: output_text_component_1.OutputTextComponent },
    { path: "detective", component: output_detective_component_1.OutputDetectiveComponent }
];
exports.routing = router_1.RouterModule.forRoot(exports.routes);
//# sourceMappingURL=app.routes.js.map