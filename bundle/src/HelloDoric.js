'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let HelloDoric = class HelloDoric extends doric.Panel {
    build(root) {
        doric.vlayout([
            doric.image({
                imageUrl: 'https://doric.pub/logo.png'
            }),
            doric.text({
                text: "Hello,    Doric",
                textSize: 12,
                textColor: doric.Color.RED,
            }),
            doric.text({
                text: "Hello,Doric",
                textSize: 16,
                textColor: doric.Color.BLUE,
            }),
            doric.text({
                text: "Hello,Doric",
                textSize: 20,
                textColor: doric.Color.GREEN,
            }),
        ], {
            layoutConfig: doric.layoutConfig().fit().configAlignment(doric.Gravity.Center),
            space: 20,
            gravity: doric.Gravity.Center
        }).in(root);
    }
};
HelloDoric = __decorate([
    Entry
], HelloDoric);
//# sourceMappingURL=HelloDoric.js.map
